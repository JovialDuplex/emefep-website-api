require("dotenv").config();
const express = require("express");
const { connectDB, syncDB } = require("./config/config");
const PORT = process.env.PORT;

const app = express();

// Demarrage de l'application : connexion DB → chargement des modeles → migration automatique
const start = async () => {
    // 1. Connexion a la base de donnee
    await connectDB();

    // 2. Chargement de tous les modeles (ils s'enregistrent sur dbConnector)
    require("./models/init-models");

    // 3. Synchronisation / migration automatique des tables
    await syncDB();

    // 4. Lancement du serveur HTTP
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