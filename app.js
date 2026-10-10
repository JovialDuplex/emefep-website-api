require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/config");
const PORT = process.env.PORT;

const app = express();

//connexion a la base de donnee 
connectDB();

// ajout des routes a l'application vers la route principale /api

app.listen(PORT, (error) => {
    if (error) {
        console.log("erreur lors du lancement du serveur backend ");
        throw error;
    }
    console.log("le serveur backend a demarre avec succes et ecoute sur le port : ", PORT);
});