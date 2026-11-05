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

const start = async () => {
  try {
    await connectDB();
    await syncDB();
    configureApp();

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

start();

module.exports = app;
