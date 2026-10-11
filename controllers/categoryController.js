const { Category } = require("../models/init-models");

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
const deleteCategory = async function (request, response) {
    response.send("suppresion de la category");
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
const createCategory = async function (request, response) {
    try {
        const data = request.body;

        // Vérification : l'image est obligatoire
        if (!request.file) {
            return response.status(400).json({
                message: "L'image de la categorie est obligatoire",
                status: 400,
            });
        }

        // Sur Cloudinary (TEST/PROD) : request.file.path contient l'URL Cloudinary
        // Sur disque local (DEV)    : on construit le chemin relatif accessible via /public
        const IS_CLOUD = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production';
        const image_url = IS_CLOUD
            ? request.file.path
            : `uploads/category/${request.file.filename}`;

        const category = await Category.create({
            ...data,
            category_slug: data.category_slug
                ? data.category_slug
                : "@" + data.category_name.toLowerCase().replace(/\s+/g, "-"),
            category_image_preview: image_url
        });
        console.log("category cree avec success !");

        return response.status(201).json({
            message: "Category cree avec succes",
            status: 201,
            category
        });
    } catch (error) {
        console.log("une erreur serveur est survenue lors de la creation de la category ", error)
        return response.status(500).json({
            message: "Erreur lors de la creation de la category",
            status: 500,
            error: error.message
        });
    }
}

module.exports = {
    getCategory,
    deleteCategory,
    updateCategory,
    createCategory
}