const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../middlewares/categoryValidation");
const { uploadFile } = require("../config/config");

const categoryRouter = Router();

/**
 * @openapi
 * /category:
 *   get:
 *     tags: [Catégories]
 *     summary: Récupérer les catégories
 *     operationId: getCategories
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema: { type: integer }
 *         description: Identifiant d'une catégorie. Sans cet identifiant, toutes les catégories sont retournées.
 *     responses:
 *       '200':
 *         description: Catégorie demandée ou liste des catégories.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     category: { $ref: '#/components/schemas/Category' }
 *                     categories: { type: array, items: { $ref: '#/components/schemas/Category' } }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
categoryRouter.get("/", categoryController.getCategory);

/**
 * @openapi
 * /category/create:
 *   post:
 *     tags: [Catégories]
 *     summary: Créer une catégorie
 *     operationId: createCategory
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [category_name, category_desc, category_image_preview]
 *             properties:
 *               category_name: { type: string, maxLength: 150 }
 *               category_desc: { type: string }
 *               category_slug: { type: string, description: Généré automatiquement s'il est omis. }
 *               category_image_preview: { type: string, format: binary, description: Image obligatoire, maximum 5 Mo. }
 *     responses:
 *       '201':
 *         description: Catégorie créée.
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     category: { $ref: '#/components/schemas/Category' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
categoryRouter.post("/create", uploadFile.single("category_image_preview"), categoryValidator.createCategoryValidation, categoryController.createCategory);

/**
 * @openapi
 * /category/update:
 *   patch:
 *     tags: [Catégories]
 *     summary: Modifier une catégorie
 *     operationId: updateCategory
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant de la catégorie à modifier.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               category_name: { type: string, maxLength: 150 }
 *               category_desc: { type: string }
 *               category_image_preview: { type: string, format: binary }
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
categoryRouter.patch("/update", uploadFile.single("category_image_preview"), categoryController.updateCategory);

/**
 * @openapi
 * /category/delete:
 *   delete:
 *     tags: [Catégories]
 *     summary: Supprimer une catégorie
 *     operationId: deleteCategory
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant de la catégorie à supprimer.
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
categoryRouter.delete("/delete", categoryController.deleteCategory);

module.exports = categoryRouter;
