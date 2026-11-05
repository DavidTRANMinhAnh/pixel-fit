# Sélection d'exercices pour PIXEL FIT.
# Source des images et des métadonnées (muscles, niveau) : Free Exercise DB
# https://github.com/yuhonas/free-exercise-db (Unlicense, domaine public).
# Les noms et consignes en français sont rédigés pour l'appli.
#
# Format : id_source: (nom, [matériel], type, mode, [consignes])
#   matériel : tout est requis ; "a|b" = l'un ou l'autre suffit.
#              corps, chaise, traction, halteres, kettlebell, elastique, barre,
#              salle, corde, paralleles
#   type     : force, cardio, gainage, mobilite
#   mode     : reps (répétitions) ou temps (secondes)

EX = {
  # ---------- POIDS DU CORPS : bas du corps ----------
  "Bodyweight_Squat": ("Squat au poids du corps", ["corps"], "force", "reps", [
    "Pieds largeur d'épaules, pointes légèrement ouvertes.",
    "Descends en poussant les fesses en arrière, comme pour t'asseoir.",
    "Genoux dans l'axe des pieds, talons collés au sol, dos droit.",
    "Remonte en poussant dans les talons."]),
  "Freehand_Jump_Squat": ("Squat sauté", ["corps"], "cardio", "reps", [
    "Fais un squat, puis saute le plus haut possible.",
    "Atterris en douceur sur l'avant du pied puis le talon, genoux fléchis.",
    "Enchaîne directement la descente suivante."]),
  "Bodyweight_Walking_Lunge": ("Fentes marchées", ["corps"], "force", "reps", [
    "Fais un grand pas en avant et descends le genou arrière vers le sol.",
    "Le genou avant reste au-dessus de la cheville.",
    "Pousse sur la jambe avant et avance l'autre jambe pour la fente suivante."]),
  "Split_Squats": ("Fente statique", ["corps"], "force", "reps", [
    "Un pied devant, un pied derrière, buste droit.",
    "Descends verticalement jusqu'à ce que le genou arrière frôle le sol.",
    "Remonte sans bouger les pieds. Fais toutes les reps puis change de jambe."]),
  "Crossover_Reverse_Lunge": ("Fente arrière croisée", ["corps"], "force", "reps", [
    "Recule une jambe en diagonale derrière l'autre.",
    "Descends en gardant le buste droit et le genou avant stable.",
    "Reviens au centre et alterne."]),
  "Step-up_with_Knee_Raise": ("Montée sur marche + genou", ["corps", "chaise"], "force", "reps", [
    "Pose un pied sur une marche ou un banc stable.",
    "Monte en poussant sur ce pied et lève l'autre genou devant toi.",
    "Redescends doucement. Alterne les jambes ou fais une série par côté."]),
  "Butt_Lift_Bridge": ("Pont fessier", ["corps"], "force", "reps", [
    "Allongé sur le dos, genoux pliés, pieds à plat près des fesses.",
    "Pousse dans les talons et monte le bassin jusqu'à aligner genoux, hanches, épaules.",
    "Serre les fessiers 1 seconde en haut, puis redescends lentement."]),
  "Single_Leg_Glute_Bridge": ("Pont fessier sur une jambe", ["corps"], "force", "reps", [
    "Même position que le pont, une jambe tendue en l'air.",
    "Monte le bassin en poussant sur le talon au sol.",
    "Garde les hanches à niveau. Change de jambe après la série."]),
  "Glute_Kickback": ("Kickback fessier à 4 pattes", ["corps"], "force", "reps", [
    "À quatre pattes, mains sous les épaules, genoux sous les hanches.",
    "Pousse un pied vers le plafond, genou plié à 90°.",
    "Ne creuse pas le dos. Redescends et fais la série puis change de côté."]),
  "Side_Leg_Raises": ("Élévation latérale de jambe", ["corps"], "force", "reps", [
    "Allongé sur le côté, jambes tendues l'une sur l'autre.",
    "Monte la jambe du dessus sans tourner le bassin.",
    "Redescends lentement. Change de côté."]),
  "Natural_Glute_Ham_Raise": ("Nordic curl (ischios)", ["corps"], "force", "reps", [
    "À genoux, chevilles bloquées sous un meuble lourd ou tenues par quelqu'un.",
    "Descends le buste vers l'avant le plus lentement possible, corps gainé.",
    "Rattrape-toi avec les mains, puis repousse pour remonter. Exo difficile."]),
  "Superman": ("Superman", ["corps"], "gainage", "reps", [
    "Allongé sur le ventre, bras tendus devant toi.",
    "Décolle en même temps bras, poitrine et jambes du sol.",
    "Tiens 2 secondes en haut puis redescends doucement."]),

  # ---------- POIDS DU CORPS : haut du corps ----------
  "Pushups": ("Pompes", ["corps"], "force", "reps", [
    "Mains un peu plus larges que les épaules, corps gainé de la tête aux talons.",
    "Descends la poitrine près du sol, coudes à environ 45° du corps.",
    "Pousse pour remonter sans casser au niveau du bassin."]),
  "Incline_Push-Up": ("Pompes inclinées (mains surélevées)", ["corps", "chaise"], "force", "reps", [
    "Mains sur un banc, une table solide ou un rebord.",
    "Corps droit, descends la poitrine vers le support.",
    "Plus le support est haut, plus c'est facile : idéal pour débuter."]),
  "Push-Ups_With_Feet_Elevated": ("Pompes pieds surélevés", ["corps", "chaise"], "force", "reps", [
    "Pieds sur une chaise ou un banc, mains au sol.",
    "Corps gainé, descends la poitrine vers le sol.",
    "Plus dur que les pompes classiques, cible le haut des pectoraux et les épaules."]),
  "Push-Up_Wide": ("Pompes mains larges", ["corps"], "force", "reps", [
    "Mains nettement plus larges que les épaules.",
    "Descends en contrôlant, poitrine vers le sol.",
    "Remonte en serrant les pectoraux."]),
  "Push-Ups_-_Close_Triceps_Position": ("Pompes serrées (triceps)", ["corps"], "force", "reps", [
    "Mains rapprochées sous la poitrine.",
    "Coudes qui frôlent les côtes pendant la descente.",
    "Pousse fort pour remonter : ce sont les triceps qui travaillent."]),
  "Plyo_Push-up": ("Pompes explosives", ["corps"], "force", "reps", [
    "Descends comme pour une pompe classique.",
    "Pousse assez fort pour que les mains décollent du sol.",
    "Réceptionne-toi bras légèrement fléchis. Pour niveau confirmé."]),
  "Bench_Dips": ("Dips sur chaise", ["corps", "chaise"], "force", "reps", [
    "Mains sur le bord d'une chaise stable ou d'un banc, dos près du bord.",
    "Plie les coudes vers l'arrière pour descendre les fesses.",
    "Pousse pour remonter. Jambes pliées = plus facile, tendues = plus dur."]),
  "Dips_-_Triceps_Version": ("Dips aux barres parallèles", ["paralleles"], "force", "reps", [
    "En appui bras tendus sur deux barres, buste droit.",
    "Descends en pliant les coudes jusqu'à 90°.",
    "Remonte en poussant. Buste droit = triceps, penché = pectoraux."]),
  "Pullups": ("Tractions", ["traction"], "force", "reps", [
    "Suspendu à la barre, mains en pronation (paumes vers l'avant), un peu plus larges que les épaules.",
    "Tire les coudes vers le bas jusqu'à passer le menton au-dessus de la barre.",
    "Redescends lentement jusqu'aux bras tendus."]),
  "Chin-Up": ("Tractions supination", ["traction"], "force", "reps", [
    "Paumes tournées vers toi, mains largeur d'épaules.",
    "Monte jusqu'à passer le menton au-dessus de la barre.",
    "Redescends en contrôlant. Plus facile que la prise pronation, sollicite les biceps."]),
  "Scapular_Pull-Up": ("Rétraction scapulaire à la barre", ["traction"], "force", "reps", [
    "Suspendu bras tendus à la barre.",
    "Sans plier les coudes, abaisse et serre les omoplates pour monter de quelques cm.",
    "Relâche doucement. Bonne préparation aux tractions."]),
  "Band_Assisted_Pull-Up": ("Traction assistée élastique", ["traction", "elastique"], "force", "reps", [
    "Accroche un élastique à la barre et place un pied ou un genou dedans.",
    "Fais la traction normalement : l'élastique t'aide en bas.",
    "Utilise un élastique de plus en plus fin au fil des semaines."]),
  "Inverted_Row": ("Rowing inversé (sous une table)", ["corps"], "force", "reps", [
    "Allongé sous une table solide ou une barre basse, mains sur le bord.",
    "Corps droit, tire la poitrine vers le bord en serrant les omoplates.",
    "Redescends lentement. Pieds plus proches = plus facile."]),
  "Inchworm": ("Chenille (inchworm)", ["corps"], "mobilite", "reps", [
    "Debout, penche-toi et pose les mains au sol devant les pieds.",
    "Avance les mains jusqu'à la position de pompe.",
    "Ramène les pieds vers les mains à petits pas et recommence."]),
  "Spider_Crawl": ("Pompe spiderman", ["corps"], "force", "reps", [
    "En position de pompe, descends en ramenant un genou vers le coude.",
    "Remonte et repose le pied.",
    "Alterne les côtés à chaque rep."]),
  "Push_Up_to_Side_Plank": ("Pompe + planche latérale", ["corps"], "gainage", "reps", [
    "Fais une pompe.",
    "En haut, pivote sur le côté et lève un bras vers le plafond.",
    "Reviens et alterne les côtés."]),

  # ---------- GAINAGE / ABDOS ----------
  "Plank": ("Planche", ["corps"], "gainage", "temps", [
    "Appui sur les avant-bras et la pointe des pieds.",
    "Corps aligné de la tête aux talons, ventre et fessiers serrés.",
    "Respire normalement. Arrête quand le bassin s'affaisse."]),
  "Side_Bridge": ("Planche latérale", ["corps"], "gainage", "temps", [
    "Sur le côté, appui sur un avant-bras, coude sous l'épaule.",
    "Monte le bassin pour aligner le corps.",
    "Tiens, puis change de côté. Genoux au sol pour simplifier."]),
  "Dead_Bug": ("Dead bug", ["corps"], "gainage", "reps", [
    "Sur le dos, bras vers le plafond, genoux pliés à 90° au-dessus des hanches.",
    "Bas du dos plaqué au sol, tends un bras et la jambe opposée.",
    "Reviens et alterne. Lentement, sans décoller le dos."]),
  "Crunches": ("Crunch", ["corps"], "gainage", "reps", [
    "Sur le dos, genoux pliés, mains sur les tempes.",
    "Enroule le haut du dos pour décoller les épaules.",
    "Ne tire pas sur la nuque. Redescends doucement."]),
  "Reverse_Crunch": ("Crunch inversé", ["corps"], "gainage", "reps", [
    "Sur le dos, jambes pliées en l'air, bras au sol.",
    "Ramène les genoux vers la poitrine en décollant le bassin.",
    "Redescends lentement sans élan."]),
  "Air_Bike": ("Crunch vélo", ["corps"], "gainage", "reps", [
    "Sur le dos, mains sur les tempes, jambes en l'air.",
    "Amène un coude vers le genou opposé en tendant l'autre jambe.",
    "Alterne comme un pédalage, sans te presser."]),
  "Russian_Twist": ("Rotation russe", ["corps"], "gainage", "reps", [
    "Assis, buste penché en arrière, pieds au sol ou décollés.",
    "Tourne le buste d'un côté puis de l'autre, mains jointes.",
    "Ajoute un poids (bouteille, haltère) pour corser."]),
  "Flutter_Kicks": ("Battements de jambes", ["corps"], "gainage", "temps", [
    "Sur le dos, mains sous les fesses, jambes tendues légèrement décollées.",
    "Fais de petits battements haut/bas rapides.",
    "Garde le bas du dos collé au sol."]),
  "Sit-Up": ("Sit-up (relevé de buste)", ["corps"], "gainage", "reps", [
    "Sur le dos, genoux pliés, pieds bloqués si besoin.",
    "Remonte le buste complètement jusqu'aux genoux.",
    "Redescends en contrôlant."]),
  "Mountain_Climbers": ("Mountain climbers", ["corps"], "cardio", "temps", [
    "En position de pompe, bras tendus.",
    "Ramène un genou vers la poitrine puis alterne rapidement.",
    "Bassin bas et stable, comme si tu courais au sol."]),
  "Elbow_to_Knee": ("Coude au genou", ["corps"], "gainage", "reps", [
    "Sur le dos, mains sur les tempes.",
    "Ramène un genou et touche-le avec le coude opposé.",
    "Alterne les côtés."]),
  "Hyperextensions_With_No_Hyperextension_Bench": ("Extension lombaire au sol", ["corps"], "gainage", "reps", [
    "Allongé sur le ventre, mains aux tempes.",
    "Décolle doucement le buste en contractant le bas du dos et les fessiers.",
    "Monte sans à-coup, redescends lentement."]),

  # ---------- CARDIO ----------
  "Star_Jump": ("Saut en étoile", ["corps"], "cardio", "reps", [
    "Accroupi légèrement, bras le long du corps.",
    "Saute en écartant bras et jambes en étoile.",
    "Atterris jambes serrées, genoux souples."]),
  "Knee_Tuck_Jump": ("Saut genoux-poitrine", ["corps"], "cardio", "reps", [
    "Debout, saute en ramenant les genoux vers la poitrine.",
    "Atterris en douceur et enchaîne.",
    "Exercice intense : garde de la qualité plutôt que de la vitesse."]),
  "Split_Jump": ("Fentes sautées", ["corps"], "cardio", "reps", [
    "En position de fente, saute et inverse les jambes en l'air.",
    "Atterris en fente de l'autre côté, genoux souples.",
    "Garde le buste droit."]),
  "Fast_Skipping": ("Montées de genoux sautillées", ["corps"], "cardio", "temps", [
    "Avance ou reste sur place en sautillant.",
    "Monte les genoux haut, bras qui accompagnent.",
    "Reste sur l'avant des pieds."]),
  "Rope_Jumping": ("Corde à sauter", ["corde"], "cardio", "temps", [
    "Coudes près du corps, ce sont les poignets qui font tourner.",
    "Petits sauts sur l'avant des pieds.",
    "Commence par des séries courtes."]),
  "Rowing_Stationary": ("Rameur", ["salle"], "cardio", "temps", [
    "Pousse d'abord avec les jambes, puis bascule le buste, puis tire les bras.",
    "Retour dans l'ordre inverse : bras, buste, jambes.",
    "Garde le dos droit."]),
  "Bicycling_Stationary": ("Vélo d'appartement", ["salle"], "cardio", "temps", [
    "Règle la selle : jambe presque tendue en bas.",
    "Pédale à un rythme où tu peux encore parler par phrases courtes.",
    "Accélère par intervalles si tu veux du fractionné."]),
  "Jogging_Treadmill": ("Course sur tapis", ["salle"], "cardio", "temps", [
    "Commence par 2 minutes de marche rapide.",
    "Cours à allure confortable, foulée courte.",
    "Ne t'accroche pas aux barres."]),

  # ---------- HALTÈRES ----------
  "Dumbbell_Squat": ("Squat aux haltères", ["halteres"], "force", "reps", [
    "Un haltère dans chaque main, bras le long du corps.",
    "Descends en poussant les fesses en arrière, dos droit.",
    "Remonte en poussant dans les talons."]),
  "Goblet_Squat": ("Squat goblet", ["kettlebell|halteres"], "force", "reps", [
    "Tiens un kettlebell ou un haltère contre la poitrine.",
    "Descends entre tes jambes, coudes à l'intérieur des genoux.",
    "Buste fier, remonte en poussant dans les talons."]),
  "Dumbbell_Lunges": ("Fentes aux haltères", ["halteres"], "force", "reps", [
    "Un haltère dans chaque main.",
    "Pas en avant, descends le genou arrière vers le sol.",
    "Repousse pour revenir et alterne."]),
  "Dumbbell_Rear_Lunge": ("Fente arrière aux haltères", ["halteres"], "force", "reps", [
    "Haltères en main, recule une jambe.",
    "Descends jusqu'à ce que le genou arrière frôle le sol.",
    "Reviens en poussant sur le talon avant. Plus doux pour les genoux."]),
  "Split_Squat_with_Dumbbells": ("Fente bulgare aux haltères", ["halteres", "chaise"], "force", "reps", [
    "Pied arrière posé sur un banc ou une chaise.",
    "Descends verticalement sur la jambe avant.",
    "Remonte. Toute la série d'un côté puis l'autre."]),
  "Dumbbell_Step_Ups": ("Step-up aux haltères", ["halteres", "chaise"], "force", "reps", [
    "Haltères en main, face à un banc stable.",
    "Monte en poussant uniquement sur la jambe posée sur le banc.",
    "Redescends en contrôlant."]),
  "Stiff-Legged_Dumbbell_Deadlift": ("Soulevé de terre jambes tendues (haltères)", ["halteres"], "force", "reps", [
    "Haltères devant les cuisses, genoux très légèrement fléchis.",
    "Penche le buste en poussant les fesses en arrière, dos bien plat.",
    "Descends jusqu'à sentir l'étirement des ischios, puis remonte."]),
  "Plie_Dumbbell_Squat": ("Squat sumo à l'haltère", ["halteres"], "force", "reps", [
    "Pieds très écartés, pointes ouvertes, un haltère tenu entre les jambes.",
    "Descends en gardant les genoux ouverts.",
    "Remonte en serrant les fessiers."]),
  "Standing_Dumbbell_Calf_Raise": ("Mollets debout aux haltères", ["halteres"], "force", "reps", [
    "Haltères en main, avant des pieds sur une marche si possible.",
    "Monte sur la pointe des pieds au maximum.",
    "Redescends lentement sous le niveau de la marche."]),
  "Dumbbell_Bench_Press": ("Développé couché haltères", ["halteres", "chaise"], "force", "reps", [
    "Allongé sur un banc (ou au sol), haltères au niveau de la poitrine.",
    "Pousse vers le plafond en rapprochant légèrement les haltères.",
    "Redescends lentement, coudes à environ 45°."]),
  "Incline_Dumbbell_Press": ("Développé incliné haltères", ["halteres", "chaise"], "force", "reps", [
    "Banc incliné à 30-45°.",
    "Pousse les haltères au-dessus du haut de la poitrine.",
    "Redescends en contrôlant."]),
  "Dumbbell_Flyes": ("Écarté couché haltères", ["halteres", "chaise"], "force", "reps", [
    "Allongé, haltères au-dessus de la poitrine, coudes légèrement fléchis.",
    "Ouvre les bras en arc de cercle jusqu'à sentir l'étirement.",
    "Referme comme pour enlacer un arbre. Poids léger."]),
  "One-Arm_Dumbbell_Row": ("Rowing un bras haltère", ["halteres", "chaise"], "force", "reps", [
    "Une main et un genou sur un banc, dos plat.",
    "Tire l'haltère vers la hanche, coude près du corps.",
    "Redescends bras tendu. Change de côté."]),
  "Bent_Over_Two-Dumbbell_Row": ("Rowing buste penché haltères", ["halteres"], "force", "reps", [
    "Buste penché à 45°, dos plat, haltères bras tendus.",
    "Tire les deux haltères vers les hanches en serrant les omoplates.",
    "Redescends lentement."]),
  "Dumbbell_Shoulder_Press": ("Développé épaules haltères", ["halteres"], "force", "reps", [
    "Assis ou debout, haltères à hauteur des oreilles.",
    "Pousse vers le haut jusqu'aux bras presque tendus.",
    "Redescends sans cambrer le dos."]),
  "Arnold_Dumbbell_Press": ("Développé Arnold", ["halteres"], "force", "reps", [
    "Haltères devant les épaules, paumes vers toi.",
    "Pousse vers le haut en tournant les paumes vers l'avant.",
    "Fais le chemin inverse en redescendant."]),
  "Side_Lateral_Raise": ("Élévations latérales", ["halteres"], "force", "reps", [
    "Debout, haltères le long du corps, coudes légèrement fléchis.",
    "Monte les bras sur les côtés jusqu'à hauteur d'épaules.",
    "Redescends lentement. Poids léger, pas d'élan."]),
  "Front_Dumbbell_Raise": ("Élévations frontales", ["halteres"], "force", "reps", [
    "Haltères devant les cuisses.",
    "Monte un bras (ou les deux) devant toi jusqu'à hauteur d'épaule.",
    "Redescends lentement."]),
  "Reverse_Flyes": ("Oiseau (arrière d'épaule)", ["halteres"], "force", "reps", [
    "Buste penché en avant, dos plat, haltères sous la poitrine.",
    "Ouvre les bras sur les côtés en serrant les omoplates.",
    "Poids léger, mouvement contrôlé."]),
  "Dumbbell_Shrug": ("Haussements d'épaules", ["halteres"], "force", "reps", [
    "Haltères le long du corps.",
    "Monte les épaules vers les oreilles.",
    "Tiens 1 seconde puis relâche. Ne roule pas les épaules."]),
  "Dumbbell_Bicep_Curl": ("Curl biceps haltères", ["halteres"], "force", "reps", [
    "Debout, haltères le long du corps, paumes vers l'avant.",
    "Plie les coudes pour monter les haltères, coudes fixes contre le corps.",
    "Redescends lentement jusqu'aux bras tendus."]),
  "Hammer_Curls": ("Curl marteau", ["halteres"], "force", "reps", [
    "Paumes face à face, comme si tu tenais un marteau.",
    "Monte les haltères sans bouger les coudes.",
    "Travaille biceps et avant-bras."]),
  "Concentration_Curls": ("Curl concentré", ["halteres", "chaise"], "force", "reps", [
    "Assis, coude calé contre l'intérieur de la cuisse.",
    "Monte l'haltère vers l'épaule.",
    "Redescends lentement. Change de bras."]),
  "Standing_Dumbbell_Triceps_Extension": ("Extension triceps au-dessus de la tête", ["halteres"], "force", "reps", [
    "Tiens un haltère à deux mains au-dessus de la tête.",
    "Plie les coudes pour descendre l'haltère derrière la nuque.",
    "Remonte en gardant les coudes pointés vers le haut."]),
  "Tricep_Dumbbell_Kickback": ("Kickback triceps", ["halteres"], "force", "reps", [
    "Buste penché, coude collé au corps et plié à 90°.",
    "Tends le bras vers l'arrière.",
    "Reviens lentement. Le haut du bras ne bouge pas."]),
  "Dumbbell_Side_Bend": ("Flexion latérale haltère", ["halteres"], "gainage", "reps", [
    "Debout, un haltère dans une main.",
    "Penche-toi sur le côté de l'haltère puis remonte en contractant l'autre flanc.",
    "Change de côté."]),
  "Straight-Arm_Dumbbell_Pullover": ("Pull-over haltère", ["halteres", "chaise"], "force", "reps", [
    "Allongé sur un banc, haltère tenu à deux mains au-dessus de la poitrine.",
    "Descends l'haltère derrière la tête, bras quasi tendus.",
    "Ramène-le au-dessus de la poitrine."]),

  # ---------- KETTLEBELL ----------
  "One-Arm_Kettlebell_Swings": ("Swing kettlebell", ["kettlebell"], "cardio", "reps", [
    "Pieds largeur d'épaules, kettlebell entre les jambes.",
    "Pousse les hanches vers l'avant de façon explosive : la cloche monte à hauteur de poitrine.",
    "Le mouvement vient des hanches, pas des bras. Dos plat."]),
  "Kettlebell_One-Legged_Deadlift": ("Soulevé de terre une jambe", ["kettlebell|halteres"], "force", "reps", [
    "Kettlebell dans une main, debout sur la jambe opposée.",
    "Penche le buste en tendant la jambe libre derrière toi.",
    "Remonte en gardant le dos plat. Change de côté."]),
  "One-Arm_Kettlebell_Row": ("Rowing kettlebell", ["kettlebell"], "force", "reps", [
    "Buste penché, dos plat, kettlebell dans une main.",
    "Tire vers la hanche en serrant l'omoplate.",
    "Change de côté."]),
  "Kettlebell_Halo": ("Halo kettlebell", ["kettlebell"], "mobilite", "reps", [
    "Tiens le kettlebell par les poignées, à l'envers, devant la poitrine.",
    "Fais-le tourner autour de ta tête.",
    "Garde le ventre serré. Change de sens."]),
  "Kettlebell_Thruster": ("Thruster kettlebell", ["kettlebell"], "cardio", "reps", [
    "Kettlebell en position haute contre l'épaule.",
    "Fais un squat, puis en remontant pousse la cloche au-dessus de la tête.",
    "Enchaîne de façon fluide."]),

  # ---------- ÉLASTIQUES ----------
  "Band_Pull_Apart": ("Écarté élastique (pull apart)", ["elastique"], "force", "reps", [
    "Tiens l'élastique bras tendus devant toi, à hauteur d'épaules.",
    "Écarte les bras jusqu'à ce que l'élastique touche la poitrine.",
    "Reviens lentement. Excellent pour la posture."]),
  "Squats_-_With_Bands": ("Squat élastique", ["elastique"], "force", "reps", [
    "Pieds sur l'élastique, poignées à hauteur d'épaules.",
    "Fais un squat classique.",
    "L'élastique rend la montée plus dure."]),
  "Shoulder_Press_-_With_Bands": ("Développé épaules élastique", ["elastique"], "force", "reps", [
    "Pieds sur l'élastique, mains à hauteur d'épaules.",
    "Pousse vers le haut.",
    "Redescends lentement."]),
  "Lateral_Raise_-_With_Bands": ("Élévations latérales élastique", ["elastique"], "force", "reps", [
    "Pieds sur l'élastique, une extrémité dans chaque main.",
    "Monte les bras sur les côtés jusqu'aux épaules.",
    "Redescends lentement."]),
  "Monster_Walk": ("Marche latérale élastique", ["elastique"], "force", "reps", [
    "Élastique autour des chevilles ou des genoux, demi-squat.",
    "Avance en pas larges sur le côté ou en diagonale.",
    "Garde la tension dans l'élastique tout le temps."]),
  "Hip_Extension_with_Bands": ("Extension de hanche élastique", ["elastique"], "force", "reps", [
    "Élastique accroché bas devant toi et autour d'une cheville.",
    "Tends la jambe vers l'arrière en serrant le fessier.",
    "Reviens lentement. Change de côté."]),

  # ---------- BARRE (salle) ----------
  "Barbell_Squat": ("Squat barre", ["barre"], "force", "reps", [
    "Barre sur le haut du dos, pieds largeur d'épaules.",
    "Descends au moins jusqu'à cuisses parallèles, dos droit.",
    "Remonte en poussant le sol. Utilise les sécurités du rack."]),
  "Barbell_Bench_Press_-_Medium_Grip": ("Développé couché barre", ["barre"], "force", "reps", [
    "Allongé, yeux sous la barre, omoplates serrées.",
    "Descends la barre au bas des pectoraux.",
    "Pousse vers le haut. Demande un pareur pour les charges lourdes."]),
  "Barbell_Deadlift": ("Soulevé de terre", ["barre"], "force", "reps", [
    "Barre au-dessus du milieu du pied, mains juste à l'extérieur des jambes.",
    "Dos plat, pousse le sol avec les jambes pour monter la barre le long des tibias.",
    "Termine debout, hanches tendues. Redescends dos plat."]),
  "Romanian_Deadlift": ("Soulevé de terre roumain", ["barre"], "force", "reps", [
    "Barre devant les cuisses, genoux légèrement fléchis.",
    "Pousse les fesses en arrière, la barre glisse le long des cuisses.",
    "Descends jusqu'à mi-tibia en gardant le dos plat, remonte."]),
  "Bent_Over_Barbell_Row": ("Rowing barre", ["barre"], "force", "reps", [
    "Buste penché à 45°, dos plat, barre bras tendus.",
    "Tire la barre vers le nombril.",
    "Redescends en contrôlant."]),
  "Standing_Military_Press": ("Développé militaire", ["barre"], "force", "reps", [
    "Barre devant les épaules, debout, fessiers serrés.",
    "Pousse la barre au-dessus de la tête.",
    "Ne cambre pas le dos."]),
  "Barbell_Curl": ("Curl barre", ["barre"], "force", "reps", [
    "Barre tenue paumes vers l'avant.",
    "Monte la barre sans balancer le buste.",
    "Redescends lentement."]),

  # ---------- MACHINES & POULIES (salle) ----------
  "Leg_Press": ("Presse à cuisses", ["salle"], "force", "reps", [
    "Dos bien calé, pieds largeur d'épaules sur la plateforme.",
    "Descends jusqu'à environ 90° aux genoux.",
    "Pousse sans verrouiller les genoux en haut."]),
  "Leg_Extensions": ("Leg extension", ["salle"], "force", "reps", [
    "Assis, chevilles sous le boudin.",
    "Tends les jambes complètement.",
    "Redescends lentement."]),
  "Lying_Leg_Curls": ("Leg curl allongé", ["salle"], "force", "reps", [
    "Allongé sur le ventre, boudin au-dessus des talons.",
    "Ramène les talons vers les fesses.",
    "Redescends lentement."]),
  "Standing_Calf_Raises": ("Mollets à la machine", ["salle"], "force", "reps", [
    "Épaules sous les appuis, avant des pieds sur la marche.",
    "Monte sur la pointe des pieds.",
    "Descends sous le niveau de la marche pour étirer."]),
  "Wide-Grip_Lat_Pulldown": ("Tirage vertical", ["salle"], "force", "reps", [
    "Assis, mains larges sur la barre.",
    "Tire la barre vers le haut de la poitrine en sortant la poitrine.",
    "Remonte lentement."]),
  "Seated_Cable_Rows": ("Tirage horizontal", ["salle"], "force", "reps", [
    "Assis, dos droit, poignée bras tendus.",
    "Tire vers le ventre en serrant les omoplates.",
    "Reviens sans arrondir le dos."]),
  "Triceps_Pushdown": ("Extension triceps à la poulie", ["salle"], "force", "reps", [
    "Debout face à la poulie haute, coudes collés au corps.",
    "Pousse la barre vers le bas jusqu'aux bras tendus.",
    "Remonte lentement."]),
  "Face_Pull": ("Face pull", ["salle"], "force", "reps", [
    "Corde à hauteur du visage.",
    "Tire la corde vers le front en écartant les mains.",
    "Super pour les épaules et la posture."]),
  "Cable_Crossover": ("Écarté à la poulie", ["salle"], "force", "reps", [
    "Entre deux poulies hautes, un pas en avant.",
    "Ramène les mains devant toi en arc de cercle.",
    "Reviens lentement."]),
  "Pallof_Press": ("Pallof press", ["salle|elastique"], "gainage", "reps", [
    "De profil par rapport à la poulie (ou à l'élastique), poignée contre la poitrine.",
    "Pousse les bras devant toi sans laisser le buste tourner.",
    "Ramène. Change de côté."]),

  # ---------- MOBILITÉ / ÉTIREMENTS ----------
  "Arm_Circles": ("Cercles de bras", ["corps"], "mobilite", "temps", [
    "Bras tendus sur les côtés.",
    "Fais des cercles, petits puis de plus en plus grands.",
    "Change de sens à mi-temps."]),
  "Standing_Hip_Circles": ("Cercles de hanches", ["corps"], "mobilite", "temps", [
    "Debout, mains sur les hanches.",
    "Fais de grands cercles avec le bassin.",
    "Change de sens à mi-temps."]),
  "Worlds_Greatest_Stretch": ("Le meilleur étirement du monde", ["corps"], "mobilite", "reps", [
    "Grande fente avant, main opposée au sol.",
    "Coude du côté de la jambe avant vers le sol, puis ouvre ce bras vers le plafond.",
    "Change de côté. Échauffe tout le corps."]),
  "Cat_Stretch": ("Dos rond / dos creux", ["corps"], "mobilite", "reps", [
    "À quatre pattes.",
    "Arrondis le dos vers le plafond en rentrant le menton.",
    "Puis creuse doucement en regardant devant. Alterne lentement."]),
  "Childs_Pose": ("Posture de l'enfant", ["corps"], "mobilite", "temps", [
    "À genoux, assieds-toi sur les talons.",
    "Penche-toi en avant, bras tendus au sol.",
    "Respire profondément et relâche le dos."]),
  "Hamstring_Stretch": ("Étirement ischios allongé", ["corps"], "mobilite", "temps", [
    "Sur le dos, une jambe tendue vers le plafond.",
    "Tiens-la derrière la cuisse et rapproche-la doucement.",
    "Change de jambe."]),
  "Quad_Stretch": ("Étirement quadriceps", ["corps"], "mobilite", "temps", [
    "Debout, attrape ton pied derrière toi.",
    "Rapproche le talon des fesses, genoux serrés.",
    "Tiens-toi à un mur si besoin. Change de côté."]),
  "Kneeling_Hip_Flexor": ("Étirement fléchisseurs de hanche", ["corps"], "mobilite", "temps", [
    "Un genou au sol, l'autre pied devant.",
    "Avance le bassin en serrant le fessier de la jambe arrière.",
    "Change de côté. Top si tu restes beaucoup assis."]),
  "Calf_Stretch_Hands_Against_Wall": ("Étirement mollets au mur", ["corps"], "mobilite", "temps", [
    "Mains contre un mur, une jambe tendue derrière.",
    "Talon arrière au sol, avance le bassin.",
    "Change de jambe."]),
  "Chest_And_Front_Of_Shoulder_Stretch": ("Étirement pectoraux", ["corps"], "mobilite", "temps", [
    "Avant-bras contre un cadre de porte, coude à hauteur d'épaule.",
    "Avance doucement jusqu'à sentir l'étirement dans la poitrine.",
    "Change de côté."]),
  "Triceps_Stretch": ("Étirement triceps", ["corps"], "mobilite", "temps", [
    "Un bras plié derrière la tête.",
    "Pousse doucement le coude avec l'autre main.",
    "Change de bras."]),
  "Shoulder_Stretch": ("Étirement épaule", ["corps"], "mobilite", "temps", [
    "Ramène un bras tendu devant la poitrine.",
    "Appuie avec l'autre bras au-dessus du coude.",
    "Change de côté."]),
  "Spinal_Stretch": ("Torsion assise", ["corps"], "mobilite", "temps", [
    "Assis, une jambe croisée par-dessus l'autre.",
    "Tourne le buste vers le genou plié, dos droit.",
    "Change de côté."]),
  "Hug_Knees_To_Chest": ("Genoux contre la poitrine", ["corps"], "mobilite", "temps", [
    "Sur le dos, ramène les deux genoux vers la poitrine.",
    "Serre-les avec les bras.",
    "Relâche le bas du dos en respirant."]),
  "Adductor_Groin": ("Étirement adducteurs", ["corps"], "mobilite", "temps", [
    "Sur le dos, plantes de pieds collées, genoux ouverts.",
    "Laisse les genoux descendre vers le sol.",
    "Respire et relâche."]),
  "Upper_Back_Stretch": ("Étirement haut du dos", ["corps"], "mobilite", "temps", [
    "Mains jointes devant toi, bras tendus.",
    "Arrondis le haut du dos en poussant les mains loin.",
    "Rentre le menton et respire."]),
  "Seated_Floor_Hamstring_Stretch": ("Étirement ischios assis", ["corps"], "mobilite", "temps", [
    "Assis, jambes tendues devant toi.",
    "Penche-toi en avant dos droit vers les pieds.",
    "Va jusqu'à une tension légère, pas de douleur."]),
}
