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
 * PATCH /api/categories/update?id=<id_category>
 *
 * Principe : on recupere l'instance via findOne() puis on appelle instance.save().
 * Contrairement a Category.update() (methode statique), instance.save() declenche
 * les hooks Sequelize :
 *   - beforeUpdate → recalcule automatiquement le slug si category_name change
 *   - afterUpdate  → supprime l'ancienne image si category_image_preview change
 *
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const updateCategory = async function (request, response) {
    try {
        const { id } = request.query;

        // 1. Verifier que l'identifiant est fourni
        if (!id) {
            return response.status(400).json({
                message: "L'identifiant de la category est requis pour la mise a jour",
                status: 400,
            });
        }

        // 2. Recuperer l'instance de la category en base de donnees
        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return response.status(404).json({
                message: "La category n'a pas ete trouve",
                status: 404,
            });
        }

        const IS_CLOUD = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production';

        // 3. Appliquer les modifications sur l'instance
        //    Sequelize tracke les champs modifies via category.changed()
        const { category_name, category_desc } = request.body;

        if (category_name !== undefined) {
            category.category_name = category_name;
        }

        if (category_desc !== undefined) {
            category.category_desc = category_desc;
        }

        // 4. Si une nouvelle image est uploadee, mettre a jour le chemin
        //    Le hook afterUpdate supprimera automatiquement l'ancienne image
        if (request.file) {
            category.category_image_preview = IS_CLOUD
                ? request.file.path
                : `uploads/category/${request.file.filename}`;
        }

        // 5. Sauvegarder → declenche beforeUpdate puis afterUpdate
        await category.save();

        console.log(`[updateCategory] Category #${id} mise a jour avec succes`);

        return response.status(200).json({
            message: "Category mise a jour avec succes",
            status: 200,
            category
        });

    } catch (error) {
        console.error("Erreur serveur lors de la mise a jour de la category :", error);
        return response.status(500).json({
            message: "Erreur serveur lors de la mise a jour de la category",
            status: 500,
            error: error.message
        });
    }
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