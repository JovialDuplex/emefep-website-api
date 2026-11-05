const { Router } = require("express");
const categoryRouter = require("./categoryRoutes");
const statRouter = require("./statRoutes");
const memberRouter = require("./memberRoutes");
const serviceRouter = require("./serviceRoutes");
const userRouter = require("./userRoutes");

const mainRouter = Router();

mainRouter.use("/category", categoryRouter);
mainRouter.use("/stat", statRouter);
mainRouter.use("/member", memberRouter);
mainRouter.use("/service", serviceRouter);
mainRouter.use("/user", userRouter);

/**
 * @openapi
 * /:
 *   get:
 *     tags: [Accueil]
 *     summary: Vérifier l'API
 *     description: Retourne le nom, la version et un message de bienvenue.
 *     operationId: getApiInfo
 *     responses:
 *       '200':
 *         description: Informations de l'API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 api-name: { type: string, example: emefep-website-api }
 *                 version: { type: string, example: '1.0.0' }
 *                 description: { type: string }
 *                 message: { type: string }
 */
mainRouter.get("/", (request, response) => {
  response.json({
    "api-name": "emefep-website-api",
    version: "1.0.0",
    description: "API pour le site web de l'EMEFEP",
    message: "welcome to emefep api",
  });
});

/**
 * @openapi
 * /endpoints:
 *   get:
 *     tags: [Accueil]
 *     summary: Lister les routes de l'API
 *     description: Retourne une liste descriptive des routes déclarées dans la réponse de cet endpoint.
 *     operationId: getEndpointsList
 *     responses:
 *       '200':
 *         description: Liste des endpoints.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       endpoint: { type: string }
 *                       method: { type: string }
 *                       description: { type: string }
 */
mainRouter.get("/endpoints", (request, response) => {
  response.json({
    endpoints: [
      { endpoint: "/category", method: "GET", description: "Recuperation des categories" },
      { endpoint: "/category/create", method: "POST", description: "Creation d'une category" },
      { endpoint: "/category/update", method: "PATCH", description: "Mise a jour d'une category" },
      { endpoint: "/category/delete", method: "DELETE", description: "Suppression d'une category" },
    ],
  });
});

module.exports = mainRouter;
