const { Router } = require("express");
const serviceController = require("../controllers/serviceController");
const { uploadFile } = require("../config/config");
const { serviceValidation } = require("../middlewares/serviceValidation");

const serviceRouter = Router();

/**
 * @openapi
 * /service:
 *   get:
 *     tags: [Services]
 *     summary: Récupérer les services
 *     operationId: getServices
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema: { type: integer }
 *         description: Identifiant du service. Sans cet identifiant, tous les services sont retournés.
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
serviceRouter.get("/", serviceController.getService);

/**
 * @openapi
 * /service/create:
 *   post:
 *     tags: [Services]
 *     summary: Créer un service
 *     operationId: createService
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [service_name, service_desc, service_image, service_category]
 *             properties:
 *               service_name: { type: string, maxLength: 150 }
 *               service_desc: { type: string, maxLength: 500 }
 *               service_image: { type: string, format: binary, description: Image obligatoire, maximum 5 Mo. }
 *               service_details: { type: object, additionalProperties: true }
 *               service_category: { type: string, description: Identifiant de la catégorie. }
 *               service_slug: { type: string, maxLength: 150 }
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
serviceRouter.post("/create", uploadFile.single("service_image"), serviceValidation, serviceController.createService);

/**
 * @openapi
 * /service/update:
 *   patch:
 *     tags: [Services]
 *     summary: Modifier un service
 *     operationId: updateService
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant du service à modifier.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               service_name: { type: string, maxLength: 150 }
 *               service_desc: { type: string, maxLength: 500 }
 *               service_image: { type: string, format: binary }
 *               service_details: { type: object, additionalProperties: true }
 *               service_category: { type: string }
 *               service_slug: { type: string, maxLength: 150 }
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
serviceRouter.patch("/update", uploadFile.single("service_image"), serviceValidation, serviceController.updateService);

/**
 * @openapi
 * /service/delete:
 *   delete:
 *     tags: [Services]
 *     summary: Supprimer un service
 *     operationId: deleteService
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant du service à supprimer.
 *     responses:
 *       '201': { description: Service supprimé avec succès. }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
serviceRouter.delete("/delete", serviceController.deleteService);

module.exports = serviceRouter;
