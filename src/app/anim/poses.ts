import { Anim, G, Pose, Pt } from './rig';

/*
 * Animations pixel art des exercices (personnage vu de profil, tourné vers la droite).
 * Repères : sol à y = G (45), debout le bassin est à y = 27 et les épaules à y = 15.
 */

const X = 30;
const HIP_Y = G - 18;

function stand(over: Partial<Pose> = {}): Pose {
  return {
    hip: [X, HIP_Y],
    torso: 0,
    feet: [
      [X + 1, G],
      [X - 1, G],
    ],
    hands: [
      [X + 1, HIP_Y + 2],
      [X - 1, HIP_Y + 2],
    ],
    ...over,
  };
}

const both = (p: Pt, dx = -1): [Pt, Pt] => [p, [p[0] + dx, p[1]]];

/** Position des épaules pour un bassin et un angle de buste donnés. */
function shoulder(hip: Pt, torso: number): Pt {
  const t = (torso * Math.PI) / 180;
  return [hip[0] + 12 * Math.sin(t), hip[1] - 12 * Math.cos(t)];
}

/** Planche / pompe : pieds en (fx, fy), épaules à la hauteur sy au-dessus des mains en hx. */
function plank(hx: number, sy: number, fx = 8, fy = G - 1, handY = G): Pose {
  const sx = hx;
  const dx = sx - fx;
  const dy = sy - fy;
  const len = Math.hypot(dx, dy);
  const hip: Pt = [fx + (dx / len) * 18, fy + (dy / len) * 18];
  const torso = (Math.atan2(sx - hip[0], -(sy - hip[1])) * 180) / Math.PI;
  return {
    hip,
    torso,
    hands: both([hx, handY]),
    feet: both([fx, fy + 1], 0),
    knees: [1, 1],
  };
}

// ---------- Squats ----------
const squatLow = (hands: [Pt, Pt]): Pose => ({
  hip: [X - 6, 36],
  torso: 35,
  feet: [
    [X + 1, G],
    [X - 1, G],
  ],
  hands,
});

const SQUAT: Anim = {
  keys: [
    stand({ hands: both([X + 13, 16]) }),
    squatLow(both([X + 14, 25])),
  ],
};

const DB_SQUAT: Anim = {
  hold: 'halteres',
  keys: [stand(), squatLow(both([X + 2, 38]))],
};

const GOBLET: Anim = {
  hold: 'kettlebell',
  keys: [
    stand({ hands: both([X + 5, 20]), elbows: [-1, -1] }),
    { ...squatLow(both([X + 3, 30])), elbows: [-1, -1] },
  ],
};

const BB_SQUAT: Anim = {
  hold: 'barre',
  keys: [
    stand({ hands: both([X - 2, 14]), elbows: [1, 1] }),
    { ...squatLow(both([X - 3, 26])), torso: 30 },
  ],
};

const JUMP_SQUAT: Anim = {
  steps: 4,
  keys: [
    squatLow(both([X - 6, 34])),
    stand({
      hip: [X, HIP_Y - 5],
      feet: [
        [X + 1, G - 5],
        [X - 1, G - 5],
      ],
      hands: both([X + 3, 2]),
    }),
  ],
};

const TUCK_JUMP: Anim = {
  steps: 4,
  keys: [
    squatLow(both([X - 6, 34])),
    {
      hip: [X, HIP_Y - 6],
      torso: 5,
      feet: [
        [X + 1, HIP_Y + 3],
        [X - 1, HIP_Y + 3],
      ],
      hands: both([X + 9, HIP_Y - 3]),
    },
  ],
};

// ---------- Fentes ----------
const LUNGE = (hold?: Anim['hold']): Anim => ({
  hold,
  keys: [
    stand({
      feet: [
        [X + 8, G],
        [X - 9, G],
      ],
    }),
    stand({
      hip: [X, 36],
      feet: [
        [X + 8, G],
        [X - 9, G],
      ],
      hands: both([X + 1, 38]),
      knees: [-1, -1],
    }),
  ],
});

const SPLIT_JUMP: Anim = {
  steps: 4,
  keys: [
    stand({
      hip: [X, 36],
      feet: [
        [X + 8, G],
        [X - 9, G],
      ],
      hands: [
        [X - 5, 30],
        [X + 6, 25],
      ],
    }),
    stand({
      hip: [X, HIP_Y - 4],
      feet: [
        [X + 2, G - 4],
        [X - 2, G - 4],
      ],
      hands: both([X + 1, 30]),
    }),
    stand({
      hip: [X, 36],
      feet: [
        [X - 9, G],
        [X + 8, G],
      ],
      hands: [
        [X + 6, 25],
        [X - 5, 30],
      ],
    }),
    stand({
      hip: [X, HIP_Y - 4],
      feet: [
        [X + 2, G - 4],
        [X - 2, G - 4],
      ],
      hands: both([X + 1, 30]),
    }),
  ],
};

const STEP_UP: Anim = {
  hold: 'halteres',
  scene: [{ kind: 'boite', x: X + 4, y: G - 8, w: 12 }],
  keys: [
    stand({
      hip: [X - 4, HIP_Y],
      feet: [
        [X + 6, G - 8],
        [X - 4, G],
      ],
      hands: both([X - 3, HIP_Y + 2]),
    }),
    stand({
      hip: [X + 7, HIP_Y - 8],
      feet: [
        [X + 7, G - 8],
        [X + 5, G - 8],
      ],
      hands: both([X + 8, HIP_Y - 6]),
    }),
  ],
};

// ---------- Charnière de hanche ----------
const hinge = (hold: Anim['hold'], low: boolean): Anim => ({
  hold,
  keys: [
    stand(),
    {
      hip: [X - 6, low ? 32 : 28],
      torso: low ? 70 : 80,
      feet: [
        [X + 1, G],
        [X - 1, G],
      ],
      hands: both(low ? [X + 3, 41] : [X + 4, 38]),
    },
  ],
});

const SWING: Anim = {
  hold: 'kettlebell',
  steps: 4,
  keys: [
    {
      hip: [X - 6, 31],
      torso: 70,
      feet: [
        [X + 2, G],
        [X - 2, G],
      ],
      hands: both([X - 2, 34]),
    },
    stand({ hands: both([X + 13, 16]) }),
  ],
};

const ROW: Anim = {
  hold: 'halteres',
  keys: [
    {
      hip: [X - 5, 31],
      torso: 65,
      feet: [
        [X + 1, G],
        [X - 1, G],
      ],
      hands: both([X + 5, 38]),
    },
    {
      hip: [X - 5, 31],
      torso: 65,
      feet: [
        [X + 1, G],
        [X - 1, G],
      ],
      hands: both([X, 30]),
      elbows: [-1, -1],
    },
  ],
};

// ---------- Bras / épaules debout ----------
const CURL: Anim = {
  hold: 'halteres',
  keys: [
    stand({ hands: both([X + 2, HIP_Y + 1]), elbows: [-1, -1] }),
    stand({ hands: both([X + 3, 17]), elbows: [-1, -1] }),
  ],
};

const PRESS = (hold: Anim['hold']): Anim => ({
  hold,
  keys: [
    stand({ hands: both([X + 2, 12]), elbows: [-1, -1] }),
    stand({ hands: both([X + 1, 1]), elbows: [-1, -1] }),
  ],
});

const FRONT_RAISE: Anim = {
  hold: 'halteres',
  keys: [stand({ hands: both([X + 2, HIP_Y + 2]) }), stand({ hands: both([X + 14, 15]) })],
};

const TRICEP_EXT: Anim = {
  hold: 'halteres',
  keys: [
    stand({ hands: both([X - 4, 8]), elbows: [-1, -1] }),
    stand({ hands: both([X + 1, 1]), elbows: [-1, -1] }),
  ],
};

const KICKBACK: Anim = {
  hold: 'halteres',
  keys: [
    { ...ROW.keys[1], hands: both([X - 3, 34]), elbows: [-1, -1] },
    { ...ROW.keys[1], hands: both([X - 12, 27]), elbows: [-1, -1] },
  ],
};

const SHRUG: Anim = {
  hold: 'halteres',
  steps: 4,
  keys: [stand(), stand({ hip: [X, HIP_Y - 1], feet: both([X + 1, G], -2), hands: both([X + 1, HIP_Y]) })],
};

const CALF: Anim = {
  hold: 'halteres',
  steps: 4,
  keys: [
    stand(),
    stand({
      hip: [X, HIP_Y - 3],
      feet: [
        [X + 1, G - 3],
        [X - 1, G - 3],
      ],
      hands: both([X + 1, HIP_Y - 1]),
    }),
  ],
};

const ARM_CIRCLES: Anim = {
  steps: 3,
  hold_frames: 0,
  keys: [
    stand({ hands: both([X + 14, 15]) }),
    stand({ hands: both([X + 1, 1]) }),
    stand({ hands: both([X - 14, 15]) }),
    stand({ hands: both([X - 1, 29]) }),
  ],
};

const HIP_CIRCLES: Anim = {
  steps: 4,
  hold_frames: 0,
  keys: [
    stand({ hip: [X + 3, HIP_Y], torso: -6, hands: both([X + 4, HIP_Y - 1]), elbows: [-1, -1] }),
    stand({ hip: [X, HIP_Y + 1], torso: 0, hands: both([X + 1, HIP_Y - 1]), elbows: [-1, -1] }),
    stand({ hip: [X - 3, HIP_Y], torso: 6, hands: both([X - 2, HIP_Y - 1]), elbows: [-1, -1] }),
    stand({ hip: [X, HIP_Y - 1], torso: 0, hands: both([X + 1, HIP_Y - 1]), elbows: [-1, -1] }),
  ],
};

const QUAD_STRETCH: Anim = {
  steps: 6,
  hold_frames: 6,
  keys: [
    stand({
      feet: [
        [X - 6, HIP_Y + 6],
        [X, G],
      ],
      hands: [
        [X - 6, HIP_Y + 5],
        [X + 8, 20],
      ],
      knees: [1, -1],
    }),
    stand({
      feet: [
        [X - 4, HIP_Y + 3],
        [X, G],
      ],
      hands: [
        [X - 4, HIP_Y + 3],
        [X + 8, 20],
      ],
      knees: [1, -1],
    }),
  ],
};

// ---------- Au sol ----------
const PUSHUP: Anim = { keys: [plank(36, G - 14), plank(36, G - 6)] };
const PLYO_PUSHUP: Anim = { steps: 4, keys: [plank(36, G - 6), plank(36, G - 19, 8, G - 1, G - 6)] };
const INCLINE_PUSHUP: Anim = {
  scene: [{ kind: 'banc', x: 33, y: G - 10, w: 14 }],
  keys: [plank(38, G - 24, 8, G - 1, G - 10), plank(38, G - 14, 8, G - 1, G - 10)],
};
const DECLINE_PUSHUP: Anim = {
  scene: [{ kind: 'banc', x: 2, y: G - 9, w: 12 }],
  keys: [plank(40, G - 14, 8, G - 10), plank(40, G - 6, 8, G - 10)],
};
const PLANK: Anim = {
  steps: 8,
  hold_frames: 6,
  keys: [
    { ...plank(33, G - 7, 8, G - 1, G), hands: both([40, G]), elbows: [-1, -1] },
    { ...plank(33, G - 8, 8, G - 1, G), hands: both([40, G]), elbows: [-1, -1] },
  ],
};
const MOUNTAIN: Anim = {
  steps: 3,
  hold_frames: 1,
  keys: [
    { ...plank(38, G - 14), feet: [[30, G - 5], [10, G]], knees: [1, 1] },
    { ...plank(38, G - 14), feet: [[10, G], [30, G - 5]], knees: [1, 1] },
  ],
};
const INCHWORM: Anim = {
  steps: 6,
  keys: [
    stand(),
    { hip: [X - 2, HIP_Y], torso: 140, feet: both([X + 1, G], -2), hands: both([X + 6, G]), knees: [-1, -1] },
    plank(46, G - 14, 26),
    { hip: [X - 2, HIP_Y], torso: 140, feet: both([X + 1, G], -2), hands: both([X + 6, G]), knees: [-1, -1] },
  ],
};
const SPIDER: Anim = {
  keys: [plank(36, G - 14), { ...plank(36, G - 7), feet: [[22, G - 4], [8, G]], knees: [1, 1] }],
};

const backLie = (hipX: number, torso: number, hipY = G - 2): Pose => ({
  hip: [hipX, hipY],
  torso,
  feet: both([hipX + 10, G], 0),
  hands: both([hipX - 3, G - 1]),
  knees: [-1, -1],
});

const CRUNCH: Anim = {
  keys: [
    { ...backLie(32, -90), hands: both([16, G - 4]), elbows: [-1, -1] },
    { ...backLie(32, -62), hands: both([19, 32]), elbows: [-1, -1] },
  ],
};
const SITUP: Anim = {
  keys: [
    { ...backLie(32, -90), hands: both([16, G - 4]), elbows: [-1, -1] },
    { ...backLie(32, -15), hands: both([34, 16]), elbows: [-1, -1] },
  ],
};
const REVERSE_CRUNCH: Anim = {
  keys: [
    { ...backLie(32, -90), feet: both([40, G - 7], 0), hands: both([26, G - 1]) },
    {
      hip: [31, G - 4],
      torso: -100,
      feet: both([25, G - 17], 0),
      hands: both([22, G - 1]),
      knees: [1, 1],
    },
  ],
};
const BRIDGE: Anim = {
  keys: [
    backLie(32, -90),
    { ...backLie(32, -125, G - 9), hands: both([26, G - 1]) },
  ],
};
const DEAD_BUG: Anim = {
  hold_frames: 3,
  keys: [
    { ...backLie(34, -90), feet: both([42, G - 12], 0), hands: both([22, G - 15]), elbows: [-1, -1] },
    {
      ...backLie(34, -90),
      feet: [
        [52, G - 3],
        [42, G - 12],
      ],
      hands: [
        [22, G - 15],
        [9, G - 4],
      ],
      elbows: [-1, -1],
    },
  ],
};
const FLUTTER: Anim = {
  steps: 3,
  hold_frames: 0,
  keys: [
    { ...backLie(30, -90), feet: [[48, G - 7], [48, G - 3]], hands: both([28, G - 1]) },
    { ...backLie(30, -90), feet: [[48, G - 3], [48, G - 7]], hands: both([28, G - 1]) },
  ],
};
const SUPERMAN: Anim = {
  hold_frames: 4,
  keys: [
    { hip: [28, G - 2], torso: 90, head: 0, feet: both([10, G - 1], 0), hands: both([54, G - 1]) },
    { hip: [28, G - 2], torso: 78, head: -10, feet: both([11, G - 5], 0), hands: both([53, G - 9]) },
  ],
};
const GLUTE_KICKBACK: Anim = {
  keys: [
    { hip: [22, G - 11], torso: 90, feet: [[12, G], [12, G]], hands: both([35, G]), knees: [-1, -1] },
    { hip: [22, G - 11], torso: 90, feet: [[10, G - 20], [12, G]], hands: both([35, G]), knees: [1, -1] },
  ],
};

// ---------- Banc, barre fixe ----------
const benchLie = (hands: [Pt, Pt]): Pose => ({
  hip: [36, G - 12],
  torso: -90,
  feet: both([44, G], -2),
  hands,
  knees: [-1, -1],
  elbows: [-1, -1],
});
const BENCH_DB: Anim = {
  hold: 'halteres',
  scene: [{ kind: 'banc', x: 18, y: G - 10, w: 22 }],
  keys: [benchLie(both([24, G - 26])), benchLie(both([25, G - 15]))],
};
const BENCH_BB: Anim = { ...BENCH_DB, hold: 'barre' };

const pullHang = (handX = 30): Pose => ({
  hip: [X - 1, 31],
  torso: 0,
  hands: both([handX, 3], 0),
  feet: [
    [X - 3, 46],
    [X - 5, 45],
  ],
  knees: [1, 1],
});
const PULLUP: Anim = {
  scene: [{ kind: 'barre-fixe', x: 30, y: 2 }],
  steps: 6,
  keys: [
    pullHang(),
    { ...pullHang(), hip: [X - 1, 21], feet: [[X - 6, 35], [X - 8, 34]], elbows: [-1, -1] },
  ],
};
const SCAP_PULL: Anim = {
  scene: [{ kind: 'barre-fixe', x: 30, y: 2 }],
  steps: 4,
  keys: [pullHang(), { ...pullHang(), hip: [X - 1, 29], feet: [[X - 3, 44], [X - 5, 43]] }],
};
const INVERTED_ROW: Anim = {
  scene: [{ kind: 'barre-fixe', x: 38, y: 24 }],
  keys: [
    { ...plank(38, 38, 6, G - 1, 24), elbows: [1, 1] },
    { ...plank(38, 28, 6, G - 1, 24), elbows: [1, 1] },
  ],
};
const BENCH_DIPS: Anim = {
  scene: [{ kind: 'boite', x: 12, y: G - 13, w: 9 }],
  keys: [
    { hip: [22, 27], torso: -4, hands: both([20, G - 13]), feet: both([42, G], -2), knees: [-1, -1] },
    { hip: [22, 34], torso: -4, hands: both([20, G - 13]), feet: both([42, G], -2), knees: [-1, -1] },
  ],
};

// ---------- Mobilité ----------
const CHILD: Anim = {
  steps: 8,
  hold_frames: 6,
  keys: [
    { hip: [18, G - 7], torso: 70, feet: both([10, G], 0), hands: both([44, G]), knees: [1, 1] },
    { hip: [16, G - 6], torso: 78, feet: both([10, G], 0), hands: both([46, G]), knees: [1, 1] },
  ],
};
const WORLDS_GREATEST: Anim = {
  steps: 6,
  hold_frames: 4,
  keys: [
    { hip: [26, G - 9], torso: 60, feet: [[38, G], [8, G]], hands: [[36, G], [36, G]], knees: [-1, -1] },
    { hip: [26, G - 9], torso: 50, feet: [[38, G], [8, G]], hands: [[33, 14], [36, G]], knees: [-1, -1] },
  ],
};

export const ANIMS: Record<string, Anim> = {
  'bodyweight-squat': SQUAT,
  'dumbbell-squat': DB_SQUAT,
  'goblet-squat': GOBLET,
  'plie-dumbbell-squat': DB_SQUAT,
  'squats---with-bands': { ...SQUAT, hold: 'elastique', keys: [stand({ hands: both([X + 2, 14]), elbows: [-1, -1] }), squatLow(both([X + 2, 24]))] },
  'barbell-squat': BB_SQUAT,
  'freehand-jump-squat': JUMP_SQUAT,
  'knee-tuck-jump': TUCK_JUMP,
  'bodyweight-walking-lunge': LUNGE(),
  'split-squats': LUNGE(),
  'dumbbell-lunges': LUNGE('halteres'),
  'dumbbell-rear-lunge': LUNGE('halteres'),
  'split-jump': SPLIT_JUMP,
  'dumbbell-step-ups': STEP_UP,
  'step-up-with-knee-raise': { ...STEP_UP, hold: undefined },
  'stiff-legged-dumbbell-deadlift': hinge('halteres', false),
  'romanian-deadlift': hinge('barre', false),
  'barbell-deadlift': hinge('barre', true),
  'kettlebell-one-legged-deadlift': hinge('kettlebell', false),
  'one-arm-kettlebell-swings': SWING,
  'bent-over-two-dumbbell-row': ROW,
  'one-arm-dumbbell-row': ROW,
  'one-arm-kettlebell-row': { ...ROW, hold: 'kettlebell' },
  'bent-over-barbell-row': { ...ROW, hold: 'barre' },
  'dumbbell-bicep-curl': CURL,
  'hammer-curls': CURL,
  'concentration-curls': CURL,
  'barbell-curl': { ...CURL, hold: 'barre' },
  'dumbbell-shoulder-press': PRESS('halteres'),
  'arnold-dumbbell-press': PRESS('halteres'),
  'standing-military-press': PRESS('barre'),
  'shoulder-press---with-bands': PRESS('elastique'),
  'front-dumbbell-raise': FRONT_RAISE,
  'standing-dumbbell-triceps-extension': TRICEP_EXT,
  'tricep-dumbbell-kickback': KICKBACK,
  'dumbbell-shrug': SHRUG,
  'standing-dumbbell-calf-raise': CALF,
  'arm-circles': ARM_CIRCLES,
  'standing-hip-circles': HIP_CIRCLES,
  'quad-stretch': QUAD_STRETCH,
  pushups: PUSHUP,
  'push-up-wide': PUSHUP,
  'push-ups---close-triceps-position': PUSHUP,
  'plyo-push-up': PLYO_PUSHUP,
  'incline-push-up': INCLINE_PUSHUP,
  'push-ups-with-feet-elevated': DECLINE_PUSHUP,
  plank: PLANK,
  'mountain-climbers': MOUNTAIN,
  inchworm: INCHWORM,
  'spider-crawl': SPIDER,
  crunches: CRUNCH,
  'air-bike': CRUNCH,
  'elbow-to-knee': CRUNCH,
  'sit-up': SITUP,
  'reverse-crunch': REVERSE_CRUNCH,
  'butt-lift-bridge': BRIDGE,
  'single-leg-glute-bridge': BRIDGE,
  'dead-bug': DEAD_BUG,
  'flutter-kicks': FLUTTER,
  superman: SUPERMAN,
  'hyperextensions-with-no-hyperextension-bench': SUPERMAN,
  'glute-kickback': GLUTE_KICKBACK,
  'dumbbell-bench-press': BENCH_DB,
  'barbell-bench-press---medium-grip': BENCH_BB,
  pullups: PULLUP,
  'chin-up': PULLUP,
  'band-assisted-pull-up': PULLUP,
  'scapular-pull-up': SCAP_PULL,
  'inverted-row': INVERTED_ROW,
  'bench-dips': BENCH_DIPS,
  'childs-pose': CHILD,
  'worlds-greatest-stretch': WORLDS_GREATEST,
};
