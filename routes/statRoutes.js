const { Router } = require("express");
const statController = require("../controllers/statController");
const statValidation = require("../middlewares/statValidation");

const statRouter = Router();

/**
 * @openapi
 * /stat:
 *   get:
 *     tags: [Statistiques]
 *     summary: Récupérer les statistiques
 *     operationId: getStats
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
statRouter.get("/", statController.getAllStat);

/**
 * @openapi
 * /stat/create:
 *   post:
 *     tags: [Statistiques]
 *     summary: Créer une statistique
 *     operationId: createStat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stat_label, stat_value]
 *             properties:
 *               stat_label: { type: string, maxLength: 150 }
 *               stat_value: { type: string, maxLength: 16 }
 *     responses:
 *       '201': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
statRouter.post("/create", statValidation.createStatValidate, statController.createStat);

/**
 * @openapi
 * /stat/update:
 *   patch:
 *     tags: [Statistiques]
 *     summary: Modifier une statistique
 *     operationId: updateStat
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant de la statistique à modifier.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stat_label: { type: string, maxLength: 150 }
 *               stat_value: { type: string, maxLength: 16 }
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
statRouter.patch("/update", statValidation.updateStatValidate, statController.updateStat);

/**
 * @openapi
 * /stat/delete:
 *   delete:
 *     tags: [Statistiques]
 *     summary: Supprimer une statistique
 *     operationId: deleteStat
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant de la statistique à supprimer.
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
statRouter.delete("/delete", statController.deleteStat);

module.exports = statRouter;
