/**
 * Petit moteur d'animation pixel art.
 *
 * Un personnage vu de profil (il regarde vers la droite) est défini par une "pose" :
 * position du bassin, inclinaison du buste et positions visées des mains et des pieds.
 * Coudes et genoux sont placés par cinématique inverse à 2 segments.
 * Le dessin se fait pixel par pixel dans un tampon de 64x48, puis un contour noir est ajouté.
 */

export type Pt = [number, number];

export interface Pose {
  /** Bassin (x, y). L'axe y descend. */
  hip: Pt;
  /** Angle du buste en degrés : 0 = debout, 90 = penché vers l'avant à l'horizontale, -90 = allongé sur le dos. */
  torso: number;
  /** Inclinaison supplémentaire de la tête. */
  head?: number;
  /** Mains visées : [proche, éloignée]. */
  hands: [Pt, Pt];
  /** Pieds visés : [proche, éloigné]. */
  feet: [Pt, Pt];
  /** Sens de pliure des coudes [proche, éloigné] : 1 ou -1. */
  elbows?: [number, number];
  /** Sens de pliure des genoux [proche, éloigné] : 1 ou -1. */
  knees?: [number, number];
}

export type HandProp = 'halteres' | 'barre' | 'kettlebell' | 'elastique' | 'corde';

export type SceneProp =
  | { kind: 'banc'; x: number; y: number; w: number }
  | { kind: 'boite'; x: number; y: number; w: number }
  | { kind: 'barre-fixe'; x: number; y: number }
  | { kind: 'tapis'; x: number; w: number };

export interface Anim {
  keys: Pose[];
  /** Objet tenu dans les mains. */
  hold?: HandProp;
  /** Décor fixe (banc, barre de traction…). */
  scene?: SceneProp[];
  /** Images de transition entre deux poses (plus = plus lent). */
  steps?: number;
  /** Images de pause sur chaque pose. */
  hold_frames?: number;
}

export const W = 64;
export const H = 52;
export const G = 45; // ligne du sol (coordonnées des poses)
/** Décalage vertical au dessin : laisse de la place au-dessus de la tête pour les bras tendus. */
export const OY = 4;

const L = { thigh: 9, shin: 9, upper: 7, fore: 7, torso: 12, neck: 2, head: 3 };

const C = {
  outline: 0xff170e0d,
  skin: rgb(0xf0, 0xa8, 0x78),
  skinFar: rgb(0xc0, 0x78, 0x58),
  shirt: rgb(0x38, 0xb7, 0x64),
  shirtFar: rgb(0x25, 0x71, 0x79),
  shorts: rgb(0x3b, 0x5d, 0xc9),
  shortsFar: rgb(0x29, 0x36, 0x6f),
  shoe: rgb(0xf4, 0xf4, 0xf4),
  shoeFar: rgb(0x94, 0xb0, 0xc2),
  hair: rgb(0x33, 0x2b, 0x2b),
  metal: rgb(0x94, 0xb0, 0xc2),
  metalDark: rgb(0x56, 0x6c, 0x86),
  iron: rgb(0x33, 0x3c, 0x57),
  wood: rgb(0xb0, 0x6a, 0x40),
  woodDark: rgb(0x7a, 0x44, 0x2a),
  band: rgb(0xb1, 0x3e, 0x53),
  mat: rgb(0x5d, 0x27, 0x5d),
};

function rgb(r: number, g: number, b: number): number {
  // ImageData est en RGBA, lu en Uint32 little-endian : 0xAABBGGRR
  return (0xff << 24) | (b << 16) | (g << 8) | r;
}

const rad = (d: number) => (d * Math.PI) / 180;

function ik(a: Pt, target: Pt, l1: number, l2: number, sign: number): [Pt, Pt] {
  const dx = target[0] - a[0];
  const dy = target[1] - a[1];
  const dist = Math.hypot(dx, dy) || 0.001;
  const d = Math.min(dist, l1 + l2 - 0.01);
  const base = Math.atan2(dy, dx);
  const cos = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const off = Math.acos(Math.max(-1, Math.min(1, cos)));
  const ang = base + sign * off;
  const joint: Pt = [a[0] + l1 * Math.cos(ang), a[1] + l1 * Math.sin(ang)];
  const end: Pt = [a[0] + (dx / dist) * d, a[1] + (dy / dist) * d];
  return [joint, end];
}

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const n = (x: number, y: number) => x + (y - x) * t;
  const p = (x: Pt, y: Pt): Pt => [n(x[0], y[0]), n(x[1], y[1])];
  return {
    hip: p(a.hip, b.hip),
    torso: n(a.torso, b.torso),
    head: n(a.head ?? 0, b.head ?? 0),
    hands: [p(a.hands[0], b.hands[0]), p(a.hands[1], b.hands[1])],
    feet: [p(a.feet[0], b.feet[0]), p(a.feet[1], b.feet[1])],
    elbows: t < 0.5 ? a.elbows : b.elbows,
    knees: t < 0.5 ? a.knees : b.knees,
  };
}

class Canvas {
  readonly px = new Uint32Array(W * H);


  set(x: number, y: number, c: number) {
    x = Math.round(x);
    y = Math.round(y) + OY;
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    this.px[y * W + x] = c;
  }

  /** Carré plein de taille s centré sur (x, y). */
  stamp(x: number, y: number, s: number, c: number) {
    const o = Math.floor((s - 1) / 2);
    const x0 = Math.round(x) - o;
    const y0 = Math.round(y) - o;
    for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) this.set(x0 + i, y0 + j, c);
  }

  line(a: Pt, b: Pt, s: number, c: number) {
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 2));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      this.stamp(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, s, c);
    }
  }

  disc(cx: number, cy: number, r: number, c: number, filter?: (dx: number, dy: number) => boolean) {
    for (let y = -Math.ceil(r); y <= Math.ceil(r); y++)
      for (let x = -Math.ceil(r); x <= Math.ceil(r); x++)
        if (x * x + y * y <= r * r + r * 0.8 && (!filter || filter(x, y))) this.set(cx + x, cy + y, c);
  }

  rect(x: number, y: number, w: number, h: number, c: number) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  outline() {
    const src = this.px.slice();
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        if (src[y * W + x]) continue;
        const n =
          (x > 0 && src[y * W + x - 1]) ||
          (x < W - 1 && src[y * W + x + 1]) ||
          (y > 0 && src[(y - 1) * W + x]) ||
          (y < H - 1 && src[(y + 1) * W + x]);
        if (n) this.px[y * W + x] = C.outline;
      }
  }
}

export interface Skeleton {
  hip: Pt;
  shoulder: Pt;
  head: Pt;
  arms: { elbow: Pt; hand: Pt }[];
  legs: { knee: Pt; ankle: Pt }[];
}

export function solve(p: Pose): Skeleton {
  const t = rad(p.torso);
  const shoulder: Pt = [p.hip[0] + L.torso * Math.sin(t), p.hip[1] - L.torso * Math.cos(t)];
  const th = rad(p.torso + (p.head ?? 0));
  const hd = L.neck + L.head;
  const head: Pt = [shoulder[0] + hd * Math.sin(th), shoulder[1] - hd * Math.cos(th)];
  const el = p.elbows ?? [1, 1];
  const kn = p.knees ?? [-1, -1];
  const arms = [0, 1].map((i) => {
    const [elbow, hand] = ik(shoulder, p.hands[i], L.upper, L.fore, el[i]);
    return { elbow, hand };
  });
  const legs = [0, 1].map((i) => {
    const [knee, ankle] = ik(p.hip, p.feet[i], L.thigh, L.shin, kn[i]);
    return { knee, ankle };
  });
  return { hip: p.hip, shoulder, head, arms, legs };
}

function drawScene(cv: Canvas, scene: SceneProp[] = []) {
  for (const s of scene) {
    if (s.kind === 'banc') {
      cv.rect(s.x, s.y, s.w, 2, C.metal);
      cv.rect(s.x + 1, s.y + 2, 1, G - s.y - 1, C.metalDark);
      cv.rect(s.x + s.w - 2, s.y + 2, 1, G - s.y - 1, C.metalDark);
    } else if (s.kind === 'boite') {
      cv.rect(s.x, s.y, s.w, G - s.y + 1, C.wood);
      cv.rect(s.x + 1, s.y + 1, s.w - 2, 1, C.woodDark);
    } else if (s.kind === 'barre-fixe') {
      cv.rect(s.x - 6, s.y, 13, 1, C.metal);
    } else if (s.kind === 'tapis') {
      cv.rect(s.x, G, s.w, 1, C.mat);
    }
  }
}

function drawHeld(cv: Canvas, hold: HandProp | undefined, sk: Skeleton, near: boolean) {
  if (!hold) return;
  const i = near ? 0 : 1;
  const h = sk.arms[i].hand;
  if (hold === 'halteres') {
    cv.rect(Math.round(h[0]) - 1, Math.round(h[1]) - 1, 3, 3, near ? C.metal : C.metalDark);
  } else if (hold === 'barre' && !near) {
    // barre vue de bout : un grand disque centré entre les mains
    const x = (sk.arms[0].hand[0] + sk.arms[1].hand[0]) / 2;
    const y = (sk.arms[0].hand[1] + sk.arms[1].hand[1]) / 2;
    cv.disc(x, y, 4, C.iron);
    cv.disc(x, y, 1, C.metal);
  } else if (hold === 'kettlebell' && near) {
    const x = (sk.arms[0].hand[0] + sk.arms[1].hand[0]) / 2;
    const y = (sk.arms[0].hand[1] + sk.arms[1].hand[1]) / 2;
    cv.disc(x, y + 3, 2.5, C.iron);
    cv.rect(Math.round(x) - 1, Math.round(y), 3, 1, C.iron);
  } else if (hold === 'elastique' && near) {
    cv.line(sk.legs[0].ankle, h, 1, C.band);
  }
}

function drawLeg(cv: Canvas, hip: Pt, leg: Skeleton['legs'][number], near: boolean) {
  cv.line(hip, leg.knee, 3, near ? C.shorts : C.shortsFar);
  cv.line(leg.knee, leg.ankle, 2, near ? C.skin : C.skinFar);
  // pied : à plat près du sol, sinon sur la pointe
  const a = leg.ankle;
  const toe: Pt = a[1] > G - 4 ? [a[0] + 3, G] : [a[0] + 3, a[1]];
  cv.line(a, toe, 2, near ? C.shoe : C.shoeFar);
}

function drawArm(cv: Canvas, sh: Pt, arm: Skeleton['arms'][number], near: boolean) {
  cv.line(sh, arm.elbow, 2, near ? C.shirt : C.shirtFar);
  cv.line(arm.elbow, arm.hand, 2, near ? C.skin : C.skinFar);
}

export function render(anim: Anim, pose: Pose, out: ImageData) {
  const cv = new Canvas();
  const sk = solve(pose);
  drawScene(cv, anim.scene);
  // plan arrière
  drawArm(cv, sk.shoulder, sk.arms[1], false);
  drawHeld(cv, anim.hold, sk, false);
  drawLeg(cv, sk.hip, sk.legs[1], false);
  // corps
  cv.line(sk.hip, sk.shoulder, 4, C.shirt);
  cv.stamp(sk.hip[0], sk.hip[1], 4, C.shorts);
  cv.line(sk.shoulder, sk.head, 2, C.skin);
  const up = rad(pose.torso + (pose.head ?? 0));
  const ux = Math.sin(up);
  const uy = -Math.cos(up);
  cv.disc(sk.head[0], sk.head[1], L.head, C.skin);
  // cheveux : moitié haute et arrière de la tête
  cv.disc(sk.head[0], sk.head[1], L.head, C.hair, (dx, dy) => dx * ux + dy * uy > 0.5 && dx * uy - dy * ux > -1.5);
  // plan avant
  drawLeg(cv, sk.hip, sk.legs[0], true);
  drawArm(cv, sk.shoulder, sk.arms[0], true);
  drawHeld(cv, anim.hold, sk, true);
  cv.outline();
  new Uint32Array(out.data.buffer).set(cv.px);
}

/** Liste des poses à afficher image par image (transitions comprises). */
export function frames(anim: Anim): Pose[] {
  const steps = anim.steps ?? 5;
  const hold = anim.hold_frames ?? 2;
  const out: Pose[] = [];
  const k = anim.keys;
  for (let i = 0; i < k.length; i++) {
    const a = k[i];
    const b = k[(i + 1) % k.length];
    for (let h = 0; h < hold; h++) out.push(a);
    if (k.length === 1) break;
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      out.push(lerpPose(a, b, (1 - Math.cos(Math.PI * t)) / 2));
    }
  }
  return out;
}
