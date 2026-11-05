import { Goal } from '../models';

/**
 * Conseils "carburant" pensés pour quelqu'un qui ne choisit pas ce qu'il mange
 * (repas cuisinés par la famille). Aucun régime, aucun comptage de calories :
 * seulement ce qui reste sous ton contrôle.
 */

export interface TipCard {
  title: string;
  icon: string;
  text: string;
}

export const CONTROL: TipCard[] = [
  {
    title: "L'EAU",
    icon: '💧',
    text: "Vise environ 1,5 à 2 L par jour, un peu plus les jours de séance. Un grand verre au réveil, un pendant la séance, un après. C'est gratuit et 100 % sous ton contrôle.",
  },
  {
    title: 'LE SOMMEIL',
    icon: '🌙',
    text: "C'est là que les muscles se reconstruisent. 8 h ou plus si tu peux, et des horaires réguliers. Écran rangé 30 min avant de dormir.",
  },
  {
    title: "L'ORDRE DANS L'ASSIETTE",
    icon: '🍽️',
    text: "Commence par la partie protéines (viande, poisson, œufs, lentilles, fromage…) et les légumes, puis le reste. Tu manges la même chose, mais tu es sûr d'avoir l'essentiel.",
  },
  {
    title: 'MANGER À TA FAIM',
    icon: '🙌',
    text: "Ne saute pas de repas, surtout les jours d'entraînement. S'entraîner le ventre vide, c'est moins de force et plus de fatigue.",
  },
  {
    title: 'LE TIMING',
    icon: '⏱️',
    text: "Le mieux : t'entraîner 1 h 30 à 3 h après un repas. Si la séance tombe loin d'un repas, un petit en-cas suffit (fruit, pain, yaourt, verre de lait… ce qu'il y a à la maison).",
  },
  {
    title: 'LES BOISSONS',
    icon: '🥤',
    text: "Sodas et jus, c'est souvent toi qui choisis. Les remplacer par de l'eau est le changement le plus simple et le plus efficace.",
  },
];

export const BY_GOAL: Record<Goal, TipCard> = {
  muscle: {
    title: 'OBJECTIF MUSCLE',
    icon: '💪',
    text: "Pour grossir en muscle il faut manger assez. Les jours de séance, ressers-toi si tu as encore faim, surtout en féculents (riz, pâtes, pain, pommes de terre) et en protéines. Ta progression sera peut-être un peu plus lente sans maîtriser les menus : c'est normal, la régularité compte plus que tout.",
  },
  forme: {
    title: 'OBJECTIF FORME',
    icon: '⚡',
    text: "Pas besoin de te priver : ce que tu contrôles, c'est le mouvement. Bouge chaque jour (marche, vélo, escaliers), mange lentement, bois de l'eau avant le repas et limite le grignotage entre les repas. L'appli ajoute des finishers cardio à tes séances.",
  },
  force: {
    title: 'OBJECTIF FORCE',
    icon: '🏋️',
    text: "La force dépend surtout de l'entraînement et du sommeil. Mange à ta faim avant les grosses séances, prends de vrais temps de repos entre les séries, et note tes charges pour battre tes records.",
  },
  mobilite: {
    title: 'OBJECTIF MOBILITÉ',
    icon: '🧘',
    text: "Ici l'alimentation compte peu. Hydrate-toi bien et sois régulier : 10 minutes d'étirements par jour valent mieux qu'une heure par semaine.",
  },
};

export const ASK: string[] = [
  "Si tu peux en parler à la maison : demander qu'il y ait plus souvent des œufs, des yaourts, du lait, des lentilles ou des pois chiches. Ce sont des protéines pas chères, faciles à ajouter sans changer les repas.",
  "Proposer de donner un coup de main en cuisine ou pour les courses, c'est aussi une façon d'avoir un peu plus ton mot à dire.",
  "Pas de compléments nécessaires : avec des repas normaux et de l'entraînement régulier, tu progresses.",
];

export const TIPS: string[] = [
  "Bois un grand verre d'eau avant de commencer ta séance.",
  'Une séance courte faite vaut mieux qu’une séance parfaite jamais faite.',
  'Note tes reps et tes charges : battre ton record, même d’une rep, c’est progresser.',
  'Si un exo fait mal (douleur, pas fatigue), arrête-le et change-le avec le bouton ⇄.',
  "Dans l'assiette, commence par les protéines et les légumes.",
  'Le muscle se construit pendant le repos : dors bien ce soir.',
  'Contrôle la descente : 2 à 3 secondes, c’est là que le muscle travaille le plus.',
  'Pas faim le matin ? Un fruit ou un verre de lait avant une séance suffit.',
  'Pas le temps ? Choisis 15 min : 3 exos bien faits, c’est déjà gagné.',
  'Respire : souffle pendant l’effort, inspire pendant le retour.',
];
