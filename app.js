require("dotenv").config();
const express = require("express");

const IS_PROD = process.env.NODE_ENV != 'dev' ? true : false;
const PORT = process.env.PORT;

const app = express();

// ajout des routes a l'application vers la route principale /api
app.use("/api", routes);

app.listen(PORT, (error) => {
    if (error) {
        console.log("erreur lors du lancement du serveur backend ");
        throw error;
    }
    console.log("le serveur backend a demarre avec succes et ecoute sur le port : ", PORT);
});