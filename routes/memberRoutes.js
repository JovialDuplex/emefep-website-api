const { Router } = require("express");
const memberController = require("../controllers/memberController");
const { uploadFile } = require("../config/config");
const { createMemberValidation, updateMemberValidation } = require("../middlewares/memberValidation");

const memberRouter = Router();

/**
 * @openapi
 * /member:
 *   get:
 *     tags: [Membres]
 *     summary: Récupérer les membres
 *     operationId: getMembers
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema: { type: integer }
 *         description: Identifiant du membre. Sans cet identifiant, tous les membres sont retournés.
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
memberRouter.get("/", memberController.getMember);

/**
 * @openapi
 * /member/add:
 *   post:
 *     tags: [Membres]
 *     summary: Ajouter un membre
 *     operationId: addMember
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [member_name, member_role, member_experience, member_bio, member_phone, member_email, member_image, member_category]
 *             properties:
 *               member_name: { type: string, maxLength: 150 }
 *               member_role: { type: string, maxLength: 200 }
 *               member_experience: { type: number }
 *               member_bio: { type: string }
 *               member_phone: { type: string, maxLength: 30 }
 *               member_email: { type: string, format: email, maxLength: 150 }
 *               member_image: { type: string, format: binary, description: Image obligatoire, maximum 5 Mo. }
 *               member_category: { type: integer }
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
memberRouter.post("/add", uploadFile.single("member_image"), createMemberValidation, memberController.addMember);

/**
 * @openapi
 * /member/update:
 *   patch:
 *     tags: [Membres]
 *     summary: Modifier un membre
 *     operationId: updateMember
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant du membre à modifier.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               member_name: { type: string, maxLength: 150 }
 *               member_role: { type: string, maxLength: 200 }
 *               member_experience: { type: number }
 *               member_bio: { type: string }
 *               member_phone: { type: string, maxLength: 30 }
 *               member_email: { type: string, format: email, maxLength: 150 }
 *               member_image: { type: string, format: binary }
 *               member_category: { type: integer }
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
memberRouter.patch("/update", uploadFile.single("member_image"), updateMemberValidation, memberController.updateMember);

/**
 * @openapi
 * /member/remove:
 *   delete:
 *     tags: [Membres]
 *     summary: Supprimer un membre
 *     operationId: removeMember
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Identifiant du membre à supprimer.
 *     responses:
 *       '200': { $ref: '#/components/responses/Success' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *       '500': { $ref: '#/components/responses/ServerError' }
 */
memberRouter.delete("/remove", memberController.removeMember);

module.exports = memberRouter;
