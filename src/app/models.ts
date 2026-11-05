export type Equipment =
  | 'corps'
  | 'chaise'
  | 'traction'
  | 'halteres'
  | 'kettlebell'
  | 'elastique'
  | 'barre'
  | 'salle'
  | 'corde'
  | 'paralleles';

export type ExType = 'force' | 'cardio' | 'gainage' | 'mobilite';

export type Muscle =
  | 'quadriceps'
  | 'epaules'
  | 'abdos'
  | 'pectoraux'
  | 'ischios'
  | 'triceps'
  | 'biceps'
  | 'dorsaux'
  | 'haut_dos'
  | 'mollets'
  | 'lombaires'
  | 'avant_bras'
  | 'fessiers'
  | 'trapezes'
  | 'adducteurs'
  | 'abducteurs'
  | 'cou';

export interface Exercise {
  id: string;
  nom: string;
  /** Chaque entrée est requise ; "a|b" signifie que l'un des deux suffit. */
  materiel: string[];
  type: string;
  mode: string;
  niveau: number;
  muscles: string[];
  secondaires: string[];
  consignes: string[];
  images: string[];
  source: string;
}

export type Goal = 'muscle' | 'forme' | 'force' | 'mobilite';

export interface Profile {
  pseudo: string;
  goal: Goal;
  level: 1 | 2 | 3;
  equipment: Equipment[];
  daysPerWeek: number;
}

export type Focus = 'auto' | 'full' | 'haut' | 'bas' | 'gainage' | 'cardio' | 'mobilite';
export type Block = 'echauffement' | 'principal' | 'finisher' | 'retour';

export interface PlannedItem {
  exId: string;
  block: Block;
  sets: number;
  /** Répétitions cibles (mode reps) ou secondes (mode temps). */
  target: number;
  rest: number;
  reason: string;
  slot?: string;
}

export interface SetLog {
  value: number;
  weight?: number;
  done: boolean;
}

export interface SessionItem extends PlannedItem {
  log: SetLog[];
}

export interface ActiveSession {
  id: string;
  startedAt: string;
  focus: Focus;
  minutes: number;
  energy: number;
  title: string;
  items: SessionItem[];
  current: number;
}

export interface WorkoutLog {
  id: string;
  date: string;
  durationMin: number;
  title: string;
  focus: Focus;
  items: { exId: string; sets: SetLog[] }[];
  xp: number;
  feeling?: number;
}

export interface DayLog {
  water: number;
  sleep?: number;
}
