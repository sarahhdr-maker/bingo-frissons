# Bingo Frissons : mise en ligne sur Netlify

Contenu du dossier
- `public/index.html` : la page (participantes et organisatrices)
- `netlify/functions/api.mjs` et `netlify/lib/bingo.mjs` : la partie serveur qui garde le chrono et les cartes
- `package.json` et `netlify.toml` : réglages Netlify

## Méthode GitHub (sans ligne de commande)
1. Dézippe le dossier sur ton ordinateur.
2. Sur github.com, crée un nouveau dépôt nommé `bingo-frissons` (privé ou public).
3. Dans le dépôt, choisis « uploading an existing file » puis glisse tout le contenu du dossier : `public`, `netlify`, `package.json`, `netlify.toml`. Valide avec « Commit changes ».
4. Sur app.netlify.com : « Add new site », « Import an existing project », GitHub, puis ton dépôt. Ne change aucun réglage et lance « Deploy ».
5. Quand le déploiement est vert, ouvre l'adresse du site.

## Code organisatrice
Par défaut le code est `FRISSONS`. Pour le changer : Netlify, Site configuration, Environment variables, ajoute `ORGA_CODE` avec ton code, puis relance un déploiement (Deploys, Trigger deploy).

## Utilisation
- Participantes : l'adresse du site.
- Organisatrices : l'adresse du site, lien « Espace organisatrices » en bas de page, ou `adresse#organisatrices`, puis le code.

## Test avant la soirée
Ouvre le site sur deux téléphones. Sur le premier, entre un prénom et coche une case. Sur le second, ouvre l'espace organisatrices : le prénom doit apparaître. Lance « Le film démarre » et vérifie que le premier téléphone affiche « Le film est en cours ».
