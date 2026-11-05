# Pixel Fit

Application de suivi sportif au style rétro / pixel art, utilisable **hors ligne** et sur **mobile** (PWA installable).

## Fonctionnalités

- **Coach de séance** : choisis ton temps dispo (15 à 60 min), ton niveau d'énergie et un thème (ou « Auto »). L'appli compose une séance (échauffement, corps de séance, finisher, retour au calme) selon ton objectif, ton niveau, ton matériel et la récupération de tes muscles.
- **Changer un exo** en un clic s'il ne te plaît pas ou si tu n'as pas le matériel.
- **Séance guidée** : démo animée de chaque geste, consignes, saisie des reps et des charges, minuteur de repos avec bips 8-bit, rappel de ta dernière performance.
- **Bibliothèque de 120 exercices** (poids du corps, haltères, kettlebell, élastiques, barre de traction, salle…) avec recherche et filtres.
- **Journal** : historique, niveaux et XP, graphique des 8 dernières semaines, muscles travaillés et oubliés.
- **Carburant** : conseils pour quelqu'un qui ne choisit pas ses repas (eau, sommeil, ordre dans l'assiette, timing), suivi de l'eau et du sommeil. Aucun régime, aucun comptage de calories.
- **Hors ligne** : tout (code, images, polices) est mis en cache par le service worker après la première visite.
- **Sauvegarde** : les données restent sur le téléphone (localStorage), avec export / import en JSON.

## Installer sur le téléphone

1. Ouvre l'appli dans le navigateur (Chrome sur Android, Safari sur iPhone).
2. Android : menu ⋮ → « Installer l'application ». iPhone : bouton Partager → « Sur l'écran d'accueil ».
3. Ouvre-la une fois avec du réseau : ensuite elle fonctionne sans connexion.

## Développement

```bash
npm install
npm start          # http://localhost:4200
npm run build      # build de production dans dist/pixel-fit/browser
```

Le service worker n'est actif qu'en build de production. Pour tester le hors ligne :

```bash
npx ng build && cd dist/pixel-fit/browser && python3 -m http.server 8080
```

### Données des exercices

`tools/curation.py` contient la sélection des exercices avec leurs noms et consignes en français.
`tools/build_data.py` télécharge les images, les réduit et génère `src/app/data/exercises.ts` :

```bash
curl -L -o /tmp/exercises.json https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json
python3 tools/build_data.py /tmp/exercises.json
```

## Déploiement

Chaque push sur `main` déploie l'appli sur GitHub Pages (`.github/workflows/deploy.yml`).
À faire une fois : **Settings → Pages → Source : GitHub Actions**.

## Crédits

- Images et données de base des exercices : [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) (Unlicense, domaine public).
- Polices : [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) et [VT323](https://fonts.google.com/specimen/VT323) (SIL Open Font License).
- Palette inspirée de « Sweetie 16 » par GrafxKid.

Cette appli ne remplace pas l'avis d'un professionnel de santé. En cas de douleur, arrête l'exercice.
