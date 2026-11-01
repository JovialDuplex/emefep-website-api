import "dotenv/config";
import express from "express";
import { connectDB, syncDB, configApp } from "./config/config.js";
import mainRouter from "./routes/index.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const PORT = process.env.PORT || 3000;
const app = express();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "welcome to my api",
      version: "1.0.0",
      description: "a simple api for emefep website",
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },

  apis: ["./routes/*js", "./app.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

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

export default app;
