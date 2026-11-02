require("dotenv").config();
const express = require("express");
const { connectDB, syncDB, configApp } = require("./config/config");
const mainRouter = require("./routes/index");

const PORT = process.env.PORT || 3000;
const app = express();

const configureApp = () => {
  configApp(app, express);
  app.use("/", mainRouter);
};

const start = async () => {
  try {
    await connectDB();
    await syncDB();
    configureApp();

    if (!process.env.VERCEL) {
      app.listen(PORT, (error) => {
        if (error) {
          console.log("erreur lors du lancement du serveur backend ");
          throw error;
        }
        console.log("le serveur backend a demarre avec succes et ecoute sur le port : ", PORT);
      });
    }
  } catch (error) {
    console.error("Erreur fatale au demarrage :", error);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  start();
} else {
  configureApp();
}

module.exports = app;
