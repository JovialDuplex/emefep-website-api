import joi from "joi";
import { apiResponse } from "../utils/apiResponse.js";
import { deleteMulterFile } from "../utils/deleteUploadedFile.js";

const categoryValidationSchema = joi.object({
    category_name: joi.string().max(150).required().messages({
        "string.max": "Le nom de la categorie ne doit pas depasse 150 caracteres",
        "string.empty": "Le nom de la categorie ne doit pas etre vide ",
        "any.required": "Le nom de la categorie est requis"
    }),
    category_desc: joi.string().required().messages({
        "string.empty": "La description de la categorie ne doit pas etre vide",
        "any.required": "La description de la categorie est requise"
    }),
    category_image_preview: joi.object({
        size: joi.number().max(1024 * 1024 * 5).required(),
        mimetype: joi.string()
            .valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/octet-stream')
            .required(),
    }).required().messages({
        "object.base": "l'image de la categorie est requise",
        "any.required": "l'image de la categorie est requise",
    }),
});

/**
 * 
 * @param { import("express").Request} request 
 * @param { import("express").Response} response 
 * @param { import("express").NextFunction} next 
 */
const createCategoryValidation = async function (request, response, next) {

    const { error } = categoryValidationSchema.validate({
        ...request.body,
        category_image_preview: request.file ? {
            size: request.file.size,
            mimetype: request.file.mimetype,
        } : null,

    }, { abortEarly: false });

    if (error) {
        const details = error.details.map(detail => ({
            message: detail.message,
            path: detail.path,
        }));
        // supprimer l'image uploader en cas d'erreur de validation
        await deleteMulterFile(request.file);

        return apiResponse(response, "Erreur de validation lors de la creation de la category", 400, details)
    }

    console.log("aucune erreur lors de la validation de la category");
    return next();
};

export default {
    createCategoryValidation
};