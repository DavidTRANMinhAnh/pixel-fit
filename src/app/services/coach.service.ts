import { Injectable, computed, inject } from '@angular/core';
import { EXERCISES } from '../data/exercises';
import { LOWER, MUSCLE_LABEL, UPPER } from '../data/labels';
import { Exercise, Focus, Goal, PlannedItem, Profile, WorkoutLog } from '../models';
import { StoreService } from './store.service';

const BY_ID = new Map(EXERCISES.map((e) => [e.id, e]));
export function exById(id: string): Exercise | undefined {
  return BY_ID.get(id);
}

/** Un emplacement de la séance : les muscles visés et le type d'exo attendu. */
interface Slot {
  key: string;
  label: string;
  muscles: string[];
  types: string[];
  /** Si défini : seuls ces exercices conviennent. */
  ids?: string[];
}

const WARMUP_IDS = ['arm-circles', 'standing-hip-circles', 'worlds-greatest-stretch', 'cat-stretch', 'inchworm', 'kettlebell-halo'];

const S = {
  quad: { key: 'quad', label: 'cuisses', muscles: ['quadriceps'], types: ['force'] },
  hinge: { key: 'hinge', label: 'arrière des jambes', muscles: ['ischios', 'fessiers'], types: ['force'] },
  glute: { key: 'glute', label: 'fessiers', muscles: ['fessiers', 'abducteurs', 'adducteurs'], types: ['force'] },
  calf: { key: 'calf', label: 'mollets', muscles: ['mollets'], types: ['force'] },
  push: { key: 'push', label: 'pectoraux', muscles: ['pectoraux'], types: ['force'] },
  pull: { key: 'pull', label: 'dos', muscles: ['dorsaux', 'haut_dos'], types: ['force'] },
  shoulder: { key: 'shoulder', label: 'épaules', muscles: ['epaules'], types: ['force'] },
  biceps: { key: 'biceps', label: 'biceps', muscles: ['biceps', 'avant_bras'], types: ['force'] },
  triceps: { key: 'triceps', label: 'triceps', muscles: ['triceps'], types: ['force'] },
  core: { key: 'core', label: 'gainage', muscles: ['abdos', 'lombaires'], types: ['gainage', 'force'] },
  cardio: { key: 'cardio', label: 'cardio', muscles: [], types: ['cardio'] },
  mob: { key: 'mob', label: 'mobilité', muscles: [], types: ['mobilite'] },
  warm: { key: 'warm', label: 'échauffement', muscles: [], types: ['mobilite'], ids: WARMUP_IDS },
  stretch: {
    key: 'stretch',
    label: 'étirement',
    muscles: [],
    types: ['mobilite'],
    ids: [] as string[],
  },
} satisfies Record<string, Slot>;
S.stretch.ids = EXERCISES.filter((e) => e.type === 'mobilite' && !WARMUP_IDS.includes(e.id)).map((e) => e.id);

const PLANS: Record<Exclude<Focus, 'auto'>, Slot[]> = {
  full: [S.quad, S.push, S.pull, S.hinge, S.shoulder, S.core, S.glute, S.triceps],
  haut: [S.push, S.pull, S.shoulder, S.pull, S.triceps, S.biceps, S.core, S.push],
  bas: [S.quad, S.hinge, S.glute, S.quad, S.calf, S.core, S.hinge],
  gainage: [S.core, S.core, S.core, S.core, S.core, S.core],
  cardio: [S.cardio, S.cardio, S.core, S.cardio, S.cardio, S.core],
  mobilite: [S.mob, S.mob, S.mob, S.mob, S.mob, S.core, S.mob, S.mob],
};

interface Dose {
  sets: number;
  reps: number;
  seconds: number;
  rest: number;
}

const DOSES: Record<Goal, Dose> = {
  muscle: { sets: 3, reps: 10, seconds: 40, rest: 90 },
  force: { sets: 4, reps: 6, seconds: 45, rest: 150 },
  forme: { sets: 3, reps: 14, seconds: 35, rest: 45 },
  mobilite: { sets: 2, reps: 10, seconds: 40, rest: 30 },
};

export interface GenerateOptions {
  minutes: number;
  energy: 1 | 2 | 3;
  focus: Focus;
}

export interface Plan {
  title: string;
  focus: Exclude<Focus, 'auto'>;
  why: string;
  items: PlannedItem[];
}

const HALF_LIFE_H = 30;

@Injectable({ providedIn: 'root' })
export class CoachService {
  private store = inject(StoreService);

  /** Fatigue par muscle (0 = frais), d'après les séries faites ces 4 derniers jours. */
  readonly fatigue = computed(() => fatigueFrom(this.store.history(), Date.now()));

  /** Pourcentage de récupération par muscle (100 = prêt). */
  readonly recovery = computed(() => {
    const f = this.fatigue();
    const out: Record<string, number> = {};
    for (const m of Object.keys(MUSCLE_LABEL)) {
      out[m] = Math.max(0, Math.round(100 - (f[m] ?? 0) * 9));
    }
    return out;
  });

  available(profile: Profile | null): Exercise[] {
    const eq = new Set<string>(['corps', ...(profile?.equipment ?? [])]);
    const lvl = profile?.level ?? 1;
    return EXERCISES.filter(
      (e) => e.niveau <= lvl + 1 && e.materiel.every((m) => m.split('|').some((x) => eq.has(x))),
    );
  }

  /** Choisit l'orientation de la séance quand l'utilisateur laisse "Auto". */
  pickFocus(opts: GenerateOptions, goal: Goal): { focus: Exclude<Focus, 'auto'>; why: string } {
    if (opts.focus !== 'auto') return { focus: opts.focus, why: 'Tu as choisi le thème.' };
    if (opts.energy === 1) return { focus: 'mobilite', why: 'Tu es fatigué : séance douce pour récupérer.' };
    if (goal === 'mobilite') return { focus: 'mobilite', why: 'Ton objectif est la mobilité.' };
    const f = this.fatigue();
    const avg = (ms: string[]) => ms.reduce((s, m) => s + (f[m] ?? 0), 0) / ms.length;
    const up = avg(UPPER);
    const low = avg(LOWER);
    if (up < 1.5 && low < 1.5) return { focus: 'full', why: 'Tout ton corps est reposé : séance complète.' };
    if (up < low) return { focus: 'haut', why: 'Tes jambes ont travaillé récemment : on fait le haut.' };
    return { focus: 'bas', why: 'Ton haut du corps a travaillé récemment : on fait les jambes.' };
  }

  generate(opts: GenerateOptions): Plan {
    const profile = this.store.profile();
    const goal = profile?.goal ?? 'forme';
    const level = profile?.level ?? 1;
    const pool = this.available(profile);
    const { focus, why } = this.pickFocus(opts, goal);
    const f = this.fatigue();
    const recent = recentIds(this.store.history(), 2);
    const used = new Set<string>();

    const dose = { ...DOSES[focus === 'mobilite' ? 'mobilite' : goal] };
    if (level === 1) dose.sets = Math.max(2, dose.sets - 1);
    if (opts.energy === 1) dose.sets = Math.max(2, dose.sets - 1);
    if (opts.energy === 3 && level > 1) dose.sets += 1;
    if (focus === 'cardio') dose.rest = Math.min(dose.rest, 45);

    const items: PlannedItem[] = [];
    const add = (slot: Slot, block: PlannedItem['block'], sets: number, override?: Partial<PlannedItem>) => {
      const ex = this.pick(pool, slot, used, recent, f, goal);
      if (!ex) return 0;
      used.add(ex.id);
      const isTime = ex.mode === 'temps';
      const target = isTime
        ? block === 'echauffement' || block === 'retour'
          ? 30
          : dose.seconds
        : block === 'echauffement'
          ? 10
          : ex.type === 'cardio'
            ? Math.max(dose.reps, 12)
            : dose.reps;
      const item: PlannedItem = {
        exId: ex.id,
        block,
        sets,
        target,
        rest: block === 'principal' ? dose.rest : 20,
        reason: this.reason(ex, slot, f, recent, block),
        slot: slot.key,
        ...override,
      };
      items.push(item);
      return estimateMin(item, ex);
    };

    let budget = opts.minutes;
    // Échauffement : 2 mouvements de mobilité
    budget -= add(S.warm, 'echauffement', 1);
    budget -= add(S.warm, 'echauffement', 1);
    // Retour au calme réservé à la fin
    const coolDownMin = opts.minutes >= 20 ? 3 : 1.5;
    budget -= coolDownMin;

    const plan = PLANS[focus];
    let i = 0;
    while (i < plan.length) {
      const slot = plan[i];
      const ex = this.pick(pool, slot, used, recent, f, goal);
      if (!ex) {
        i++;
        continue;
      }
      const cost = estimateMin({ exId: ex.id, sets: dose.sets, target: dose.reps, rest: dose.rest } as PlannedItem, ex);
      const isFirst = items.filter((x) => x.block === 'principal').length < 2;
      if (cost > budget && !isFirst) break;
      budget -= add(slot, 'principal', dose.sets);
      i++;
    }

    // Finisher cardio si objectif forme et qu'il reste du temps
    if (goal === 'forme' && focus !== 'cardio' && focus !== 'mobilite' && budget >= 4) {
      budget -= add(S.cardio, 'finisher', 2, { target: 30, rest: 30 });
    }

    // Retour au calme : étirements des muscles travaillés
    add(S.stretch, 'retour', 1);
    if (opts.minutes >= 20) add(S.stretch, 'retour', 1);

    const titles: Record<string, string> = {
      full: 'Corps entier',
      haut: 'Haut du corps',
      bas: 'Jambes',
      gainage: 'Gainage',
      cardio: 'Cardio',
      mobilite: 'Mobilité',
    };
    return { title: titles[focus], focus, why, items: sortBlocks(items) };
  }

  /** Propose un autre exercice pour le même emplacement. */
  swap(item: PlannedItem, exclude: string[]): PlannedItem | null {
    const profile = this.store.profile();
    const pool = this.available(profile);
    const ex = exById(item.exId);
    if (!ex) return null;
    const slot: Slot =
      (Object.values(S) as Slot[]).find((s) => s.key === item.slot) ??
      ({ key: 'x', label: '', muscles: ex.muscles, types: [ex.type] } as Slot);
    const used = new Set(exclude);
    const cand = this.candidates(pool, slot, used);
    if (!cand.length) return null;
    const next = cand[Math.floor(Math.random() * cand.length)];
    const target =
      next.mode === ex.mode ? item.target : next.mode === 'temps' ? 30 : DOSES[profile?.goal ?? 'forme'].reps;
    return { ...item, exId: next.id, target, reason: 'Alternative choisie pour toi.' };
  }

  private candidates(pool: Exercise[], slot: Slot, used: Set<string>): Exercise[] {
    return pool.filter(
      (e) =>
        !used.has(e.id) &&
        slot.types.includes(e.type) &&
        (!slot.ids || slot.ids.includes(e.id)) &&
        (slot.muscles.length === 0 || e.muscles.some((m) => slot.muscles.includes(m))),
    );
  }

  private pick(
    pool: Exercise[],
    slot: Slot,
    used: Set<string>,
    recent: Set<string>,
    f: Record<string, number>,
    goal: Goal,
  ): Exercise | undefined {
    const cand = this.candidates(pool, slot, used);
    if (!cand.length) return undefined;
    const scored = cand.map((e) => {
      let s = Math.random() * 2;
      if (recent.has(e.id)) s -= 2; // varier par rapport aux dernières séances
      const fat = e.muscles.reduce((a, m) => a + (f[m] ?? 0), 0) / Math.max(1, e.muscles.length);
      s -= fat * 0.8; // éviter les muscles encore fatigués
      const loaded = e.materiel.some((m) => !['corps', 'chaise'].includes(m));
      if ((goal === 'force' || goal === 'muscle') && loaded) s += 1.5;
      if (goal === 'forme' && e.type === 'cardio') s += 1;
      return { e, s };
    });
    scored.sort((a, b) => b.s - a.s);
    return scored[0].e;
  }

  private reason(
    ex: Exercise,
    slot: Slot,
    f: Record<string, number>,
    recent: Set<string>,
    block: PlannedItem['block'],
  ): string {
    if (block === 'echauffement') return 'Échauffement : prépare les articulations.';
    if (block === 'retour') return 'Retour au calme : relâche les muscles.';
    if (block === 'finisher') return 'Finisher cardio pour brûler un max.';
    const m = ex.muscles[0];
    const rec = Math.max(0, Math.round(100 - (f[m] ?? 0) * 9));
    const parts = [`Cible : ${MUSCLE_LABEL[m] ?? m}`];
    if (rec >= 90) parts.push('muscle reposé');
    else parts.push(`récup ${rec} %`);
    if (!recent.has(ex.id)) parts.push('nouveau par rapport à tes dernières séances');
    return parts.join(' · ') + '.';
  }
}

export function fatigueFrom(history: WorkoutLog[], now: number): Record<string, number> {
  const out: Record<string, number> = {};
  for (const w of history) {
    const ageH = (now - new Date(w.date).getTime()) / 3600000;
    if (ageH > 96 || ageH < 0) continue;
    const decay = Math.pow(0.5, ageH / HALF_LIFE_H);
    for (const it of w.items) {
      const ex = BY_ID.get(it.exId);
      if (!ex || ex.type === 'mobilite') continue;
      const n = it.sets.filter((s) => s.done).length;
      for (const m of ex.muscles) out[m] = (out[m] ?? 0) + n * decay;
      for (const m of ex.secondaires) out[m] = (out[m] ?? 0) + n * 0.5 * decay;
    }
  }
  return out;
}

function recentIds(history: WorkoutLog[], n: number): Set<string> {
  return new Set(history.slice(0, n).flatMap((w) => w.items.map((i) => i.exId)));
}

export function estimateMin(item: Pick<PlannedItem, 'sets' | 'target' | 'rest'>, ex: Exercise): number {
  const work = ex.mode === 'temps' ? item.target : item.target * 3.5;
  const sides = ex.consignes.join(' ').includes('Change de') ? 2 : 1;
  return (item.sets * (work * sides + item.rest) + 30) / 60;
}

function sortBlocks(items: PlannedItem[]): PlannedItem[] {
  const order = { echauffement: 0, principal: 1, finisher: 2, retour: 3 };
  return [...items].sort((a, b) => order[a.block] - order[b.block]);
}
