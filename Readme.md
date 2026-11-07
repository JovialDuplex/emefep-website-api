# API Backend du site web EMEFEP

API Express 5 avec base MySQL/Sequelize, stockage Cloudinary et documentation Swagger.

## Exécution locale

```bash
npm install
cp .env.example .env
# Renseigner les variables, puis :
npm start
```

L'API répond sur `http://localhost:3000` (ou le port défini par `PORT`) et Swagger UI est disponible sur `/api-docs`.

## Déploiement sur Netlify

Le dépôt est configuré comme une **API Netlify Functions**, et non comme un site statique. Le fichier `netlify.toml` redirige les requêtes vers une fonction Express; l'API et Swagger sont servis sur le même domaine.

1. Dans Netlify, choisissez **Add new site > Import an existing project** et connectez `JovialDuplex/emefep-website-api`.
2. Gardez le répertoire de base à la racine du dépôt. `netlify.toml` configure déjà `netlify/functions` et le bundler; aucune commande de build statique n'est requise.
3. Choisissez Node.js 22 (également indiqué par `.nvmrc`).
4. Dans **Site configuration > Environment variables**, ajoutez les variables ci-dessous. Définissez-les pour le contexte de production et les deploy previews si nécessaire.
5. Déclenchez le déploiement. Testez `/`, `/api-docs` et `/endpoints` sur l'URL Netlify.

### Variables d'environnement Netlify

Obligatoires pour les routes qui utilisent MySQL :

- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT` (souvent `3306`), `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`

Obligatoires pour les transferts et suppressions de fichiers :

- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Si l'authentification Firebase est utilisée, configurez l'une des options suivantes :

- recommandé pour Netlify : `FIREBASE_SERVICE_ACCOUNT_JSON` avec le contenu JSON du compte de service Google/Firebase, sur une seule ligne;
- ou `GOOGLE_APPLICATION_CREDENTIALS` si le runtime dispose réellement du fichier référencé.

Ne commitez jamais les secrets et n'utilisez pas un compte Firebase de service aux permissions excessives. Après avoir ajouté ou changé des variables, redéployez le site.

### Points importants pour la production

- La fonction ouvre la connexion à MySQL et synchronise les modèles Sequelize une fois par instance chaude. N'utilisez pas les options destructrices `force` ou `alter` en production; exécutez les migrations de façon contrôlée.
- Netlify Functions est sans état et son système de fichiers n'est pas persistant. Les fichiers sont donc envoyés vers Cloudinary en production; les médias existants stockés dans `public/uploads` doivent être migrés ou transférés dans un stockage persistant.
- Hébergez MySQL chez un fournisseur accessible depuis Internet et autorisez les connexions nécessaires depuis Netlify. Les bases limitées à une IP fixe peuvent nécessiter un plan avec IP sortante fixe ou un autre hébergeur d'API.
- Les fonctions serverless peuvent être mises en veille puis recréées : la connexion est réinitialisée lors d'un démarrage à froid. Vérifiez également les limites de durée d'exécution de votre plan Netlify pour les requêtes longues et les uploads.
- Les variables locales historiques `LOCAL_DB_*`/`TEST_DB_*` restent utilisées pour les modes locaux et de test; la production lit les noms `DB_*` ci-dessus.

## Documentation et tests

- `GET /api-docs` : Swagger UI.
- `GET /` : informations de l'API.
- `GET /endpoints` : liste des routes documentées par l'application.
- `npm test` : tests Node (à compléter avec les tests du projet).
