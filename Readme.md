# API Backend du site web EMEFEP

Ce projet contient la version 1 de l'API backend du site web pour l'entreprise EMEFEP.

## Documentation Swagger

La documentation OpenAPI est générée avec `swagger-jsdoc` à partir des annotations `@openapi` placées dans les fichiers de routes. Les schémas et réponses réutilisables sont définis dans `config/swagger.js`.

Après le démarrage de l'application, ouvrez :

- `http://localhost:3000/api-docs` pour Swagger UI en local ;
- `https://emefep-website-api.vercel.app/api-docs` pour l'instance de production.

Pour documenter une nouvelle route, ajoutez un bloc `@openapi` au-dessus de sa déclaration dans `routes/`, en réutilisant si possible les schémas et réponses `#/components/...` de `config/swagger.js`. Les chemins OpenAPI sont relatifs à la racine de l'API (par exemple `/category`), sans préfixe `/api`.
