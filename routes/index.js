const categoryRoutes = require("./categoryRoutes");
const statRoutes = require("./statRoutes");
const memberRoutes = require("./memberRoutes");

const router = require("express").Router();

//ajout des routes pour les categories a la route principale 
router.use("/category", categoryRoutes);
router.use("/stat", statRoutes);
router.use("/member", memberRoutes);


//donne les informations sur l'api 
router.get("/", (request, response) => {
    response.json({
        "api-name": "emefep-website-api",
        "version": "1.0.0",
        "description": "API pour le site web de l'EMEFEP",
        "message": "welcome to emefep api"
    })
});

//donner tous les endpoints de l'api 
router.get("/endpoints", (request, response) => {
    response.json({
        endpoints: [{
            endpoint: "/api/category",
            method: "GET",
            description: "Recuperation des categories"
        }, {
            endpoint: "/api/category",
            method: "POST",
            description: "Creation d'une category"
        }, {
            endpoint: "/api/category",
            method: "PUT",
            description: "Mise a jour d'une category"
        }, {
            endpoint: "/api/category",
            method: "DELETE",
            description: "Recuperation des categories"
        }]
    })
});

module.exports = router;