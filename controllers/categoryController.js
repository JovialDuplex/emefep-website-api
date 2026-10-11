/**
 * @description recuperation des categories et d'une seule si l'identifiant est defini
 * GET /api/categories : Recupere toutes les categories
 * GET /api/categories?id=<id_category> : Recupere une categorie par son identifiant
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const getCategory = function (request, response) {
    response.send("recuperation de la category");
}

/**
 * @description supprime une category
 * DELETE /api/categories?id=<id_category>
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const deleteCategory = function (request, response) {
    response.send("suppression de la category");
}

/**
 * @description modifie une category
 * PUT /api/categories?id=<id_category>
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const updateCategory = function (request, response) {
    response.send("modification de la category");
}

/**
 * @description cree une category
 * POST /api/categories
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const createCategory = function (request, response) {
    response.send("creation de la category");
}

module.exports = {
    getCategory,
    deleteCategory,
    updateCategory,
    createCategory
}