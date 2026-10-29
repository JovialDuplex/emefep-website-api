import "dotenv/config";
import express from "express";
import { connectDB, syncDB, configApp } from "./config/config.js";
import mainRouter from "./routes/index.js";

const PORT = 3000;
const app = express();

// Demarrage de l'application : connexion DB → chargement des modeles → migration automatique
const start = async () => {
    // Connexion a la base de donnee

    await connectDB();

    // Synchronisation / migration automatique des tables
    await syncDB();

    // ajout de la configuration de l'app 
    configApp(app, express);

    // Ajout des routes de l'application
    app.use("/", mainRouter);

    // Lancement du serveur HTTP
    app.listen(PORT, (error) => {
        if (error) {
            console.log("erreur lors du lancement du serveur backend ");
            throw error;
        }
        console.log("le serveur backend a demarre avec succes et ecoute sur le port : ", PORT);
    });
};

start().catch((err) => {
    console.error("Erreur fatale au demarrage :", err);
    process.exit(1);
});

export default app;
