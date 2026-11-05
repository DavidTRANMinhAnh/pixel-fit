import { Equipment, Focus, Goal } from '../models';

export const MUSCLE_LABEL: Record<string, string> = {
  quadriceps: 'Quadriceps',
  epaules: 'Épaules',
  abdos: 'Abdos',
  pectoraux: 'Pectoraux',
  ischios: 'Ischios',
  triceps: 'Triceps',
  biceps: 'Biceps',
  dorsaux: 'Dorsaux',
  haut_dos: 'Haut du dos',
  mollets: 'Mollets',
  lombaires: 'Lombaires',
  avant_bras: 'Avant-bras',
  fessiers: 'Fessiers',
  trapezes: 'Trapèzes',
  adducteurs: 'Adducteurs',
  abducteurs: 'Abducteurs',
  cou: 'Cou',
};

export const MUSCLE_GROUPS: { id: string; label: string; muscles: string[] }[] = [
  { id: 'pousser', label: 'Pousser', muscles: ['pectoraux', 'epaules', 'triceps'] },
  { id: 'tirer', label: 'Tirer', muscles: ['dorsaux', 'haut_dos', 'biceps', 'trapezes', 'avant_bras'] },
  {
    id: 'jambes',
    label: 'Jambes',
    muscles: ['quadriceps', 'ischios', 'fessiers', 'mollets', 'adducteurs', 'abducteurs'],
  },
  { id: 'tronc', label: 'Tronc', muscles: ['abdos', 'lombaires'] },
];

export const UPPER = ['pectoraux', 'epaules', 'triceps', 'dorsaux', 'haut_dos', 'biceps', 'trapezes', 'avant_bras'];
export const LOWER = ['quadriceps', 'ischios', 'fessiers', 'mollets', 'adducteurs', 'abducteurs'];

export const EQUIPMENT_LABEL: Record<Equipment, string> = {
  corps: 'Poids du corps',
  chaise: 'Chaise / banc / marche',
  traction: 'Barre de traction',
  halteres: 'Haltères',
  kettlebell: 'Kettlebell',
  elastique: 'Élastiques',
  barre: 'Barre + disques (rack)',
  salle: 'Machines de salle',
  corde: 'Corde à sauter',
  paralleles: 'Barres parallèles',
};

export const GOAL_LABEL: Record<Goal, string> = {
  muscle: 'Prendre du muscle',
  forme: 'Forme & sèche',
  force: 'Devenir plus fort',
  mobilite: 'Mobilité & dos',
};

export const FOCUS_LABEL: Record<Focus, string> = {
  auto: 'Auto (selon ta récup)',
  full: 'Corps entier',
  haut: 'Haut du corps',
  bas: 'Bas du corps',
  gainage: 'Abdos / gainage',
  cardio: 'Cardio',
  mobilite: 'Mobilité / récup',
};

export const TYPE_LABEL: Record<string, string> = {
  force: 'Renfo',
  cardio: 'Cardio',
  gainage: 'Gainage',
  mobilite: 'Mobilité',
};
