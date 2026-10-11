const { Category } = require("../models/init-models");

/**
 * @description recuperation des categories et d'une seule si l'identifiant est defini
 * GET /api/categories : Recupere toutes les categories
 * GET /api/categories?id=<id_category> : Recupere une categorie par son identifiant
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const getCategory = async function (request, response) {
    try {
        const { id } = request.query;
        if (id) {
            const category = await Category.findOne({ where: { id } });
            if (category) {
                return response.status(200).json({
                    message: "Category recuperer avec success",
                    status: 200,
                    category
                });
            } else {
                return response.status(404).json({
                    message: "la category n'a pas ete trouve",
                    status: 404,
                });
            }
        } else {
            const categories = await Category.findAll();
            return response.status(200).json({
                message: "Categories recuperer avec success",
                status: 200,
                categories
            });
        }
    } catch (error) {
        console.log("une erreur serveur est survenue lors de la recuperation de la category ", error)
        return response.status(500).json({
            message: "Erreur lors de la recuperation de la category",
            status: 500,
            error: error.message
        });
    }
}

/**
 * @description supprime une category
 * DELETE /api/categories?id=<id_category>
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const deleteCategory = async function (request, response) {
    const { id } = request.query;

    if (!id) {
        return response.status(400).json({
            message: "L'identifiant de la categorie est requis pour la suppression",
            status: 400,
        });
    }

    try {
        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return response.status(404).json({
                message: "La categorie n'a pas ete trouvee",
                status: 404,
            });
        }

        // La suppression declenche automatiquement le hook afterDestroy
        // qui se charge de supprimer le fichier image (local ou Cloudinary)
        await category.destroy();

        console.log(`Categorie #${id} supprimee avec succes`);
        return response.status(200).json({
            message: "Categorie supprimee avec succes",
            status: 200,
        });
    } catch (error) {
        console.error("Erreur lors de la suppression de la categorie :", error);
        return response.status(500).json({
            message: "Erreur serveur lors de la suppression de la categorie",
            status: 500,
            error: error.message
        });
    }
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