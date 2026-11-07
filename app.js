require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { connectDB, syncDB, configApp } = require("./config/config");
const mainRouter = require("./routes/index");

const PORT = process.env.PORT || 3000;
const app = express();

const configureApp = () => {
  configApp(app, express);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/", mainRouter);
};

// Initialise la base et les routes une seule fois (reutilise entre les requetes
// d'une meme instance serverless).
let initPromise = null;
const initApp = () => {
  if (!initPromise) {
    initPromise = (async () => {
      await connectDB();
      await syncDB();
      configureApp();
      return app;
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
};

const start = async () => {
  try {
    await initApp();

    app.listen(PORT, (error) => {
      if (error) {
        console.log("erreur lors du lancement du serveur backend ");
        throw error;
      }
      console.log("le serveur backend a demarre avec succes et ecoute sur le port : ", PORT);
    });
  } catch (error) {
    console.error("Erreur fatale au demarrage :", error);
    process.exit(1);
  }
};

// Demarre un serveur HTTP uniquement quand le fichier est lance directement
// (`node app.js` / `npm start`). Sur Netlify, l'app est servie par une fonction.
if (require.main === module) {
  start();
}

module.exports = app;
module.exports.initApp = initApp;
