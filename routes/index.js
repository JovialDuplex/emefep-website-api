import { Router } from "express";
import categoryRouter from "./categoryRoutes.js";
import statRouter from "./statRoutes.js";
import memberRouter from "./memberRoutes.js";

const mainRouter = Router();

//ajout des routes pour les categories a la route principale 
mainRouter.use("/category", categoryRouter);
mainRouter.use("/stat", statRouter);
mainRouter.use("/member", memberRouter);


//donne les informations sur l'api 
mainRouter.get("/", (request, response) => {
    response.json({
        "api-name": "emefep-website-api",
        "version": "1.0.0",
        "description": "API pour le site web de l'EMEFEP",
        "message": "welcome to emefep api"
    })
});

//donner tous les endpoints de l'api 
mainRouter.get("/endpoints", (request, response) => {
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

export default mainRouter;