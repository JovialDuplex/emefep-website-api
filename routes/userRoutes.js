const { getUserInfos, login, register } = require("../controllers/userController");
const router = require("express").Router();

/**
 * @openapi
 * /user/get-infos:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Récupérer les informations utilisateur
 *     operationId: getUserInfos
 *     responses:
 *       '200':
 *         description: Texte de confirmation renvoyé par le contrôleur.
 *         content:
 *           text/html:
 *             schema: { type: string, example: recuperation des informations de l'utilisateur effectuer avec success ! }
 */
router.get("/get-infos", getUserInfos);

/**
 * @openapi
 * /user/login:
 *   post:
 *     tags: [Utilisateurs]
 *     summary: Connexion utilisateur
 *     description: Endpoint actuellement démonstratif ; le contrôleur ne vérifie pas encore d'identifiants.
 *     operationId: loginUser
 *     responses:
 *       '200':
 *         description: Texte de confirmation renvoyé par le contrôleur.
 *         content:
 *           text/html:
 *             schema: { type: string, example: connexion de l'utilisateur reussit }
 */
router.post("/login", login);

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags: [Utilisateurs]
 *     summary: Enregistrer un utilisateur
 *     description: Endpoint actuellement démonstratif ; le contrôleur ne crée pas encore de compte.
 *     operationId: registerUser
 *     responses:
 *       '200':
 *         description: Texte de confirmation renvoyé par le contrôleur.
 *         content:
 *           text/html:
 *             schema: { type: string, example: enregistrement de l'utilisateur reussit ! }
 */
router.post("/register", register);

module.exports = router;
