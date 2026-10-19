import joi from "joi";
import { apiResponse, apiResponseError } from "../utils/apiResponse.js";
import { deleteMulterFile } from "../utils/deleteUploadedFile.js";

const createMemberValidationSchema = joi.object({
    member_name: joi.string().max(150).required().messages({
        "string.empty": "Le nom du membre ne doit pas etre vide ",
        "any.required": "Le nom du membre est requis",
        "string.max": `Le nom du membre ne dois pas depasse 150 caracteres`,
    }),

    member_role: joi.string().max(200).required().messages({
        "string.empty": "Le role du membre ne doit pas etre vide ",
        "any.required": "Le role du membre est requis",
        "string.max": `Le role du membre ne dois pas depasse 200 caracteres`,
    }),

    member_experience: joi.number().required().messages({
        "number.empty": "L'experience du membre est ne doit pas etre vide ",
        "number.base": "L'experience du membre doit etre un nombre",
        "any.required": "L'experience du membre est requis",
    }),

    member_bio: joi.string().required().messages({
        "string.empty": "La bio du membre ne doit pas etre vide ",
        "any.required": "La bio du membre est requis",
    }),

    member_phone: joi.string().max(30).required().messages({
        "string.empty": "Le telephone du membre ne doit pas etre vide ",
        "any.required": "Le telephone du membre est requis",
        "string.max": `Le telephone du membre ne dois pas depasse 30 caracteres`,
    }),

    member_email: joi.string().max(150).required().email().messages({
        "string.email": "L'email n'est pas valide",
        "string.empty": "L'email du membre ne doit pas etre vide ",
        "any.required": "L'email du membre est requis",
        "string.max": `L'email du membre ne dois pas depasse 150 caracteres`,
    }),

    member_image: joi.object({
        size: joi.number().required().max(5 * 1024 * 1024).messages({
            "number.empty": "La taille de l'image est requise",
            "number.max": "La taille de l'image du membre ne dois pas depasse 5Mo",
        }),
        mimetype: joi.string().required().valid('image/jpeg', 'image/png', 'image/jpg', 'image/svg', 'image/webp', 'application/octet-stream').messages({
            "string.empty": "Le type de l'image est requis",
            "any.only": "Le type de l'image doit etre jpeg ou png",
        }),
    }).required().messages({
        'object.base': 'L\'image du membre est requise',
        'any.required': 'L\'image du membre est requise',
    }),

    member_category: joi.number().required().messages({
        "number.empty": "La categorie du membre ne doit pas etre vide",
        'number.base': 'La categorie du membre doit etre un nombre',
        'any.required': 'La categorie du membre est requise',
    }),
});

/**
 * MIDDLEWARE QUI VALIDE LES DONNEES LORS DE LA CREATION D'UN MEMBRE
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} next 
 */
export const createMemberValidation = async function (request, response, next) {
    try {
        const { error } = createMemberValidationSchema.validate({
            ...request.body,
            member_image: request.file ? {
                size: request.file.size,
                mimetype: request.file.mimetype,
            } : null,

        }, { abortEarly: false });
        if (error) {
            const details = error.details.map((detail) => ({
                message: detail.message,
                path: detail.path.join("."),
            }));

            // supprimer l'image uploader en cas d'erreur de validation (local + Cloudinary)
            await deleteMulterFile(request.file);
            return apiResponse(
                response,
                "Erreur de validation des donnee lors de la creation du membre",
                400,
                details
            );
        }

        return next();
    }
    catch (error) {
        return apiResponseError(
            response,
            "Une erreur serveur est survenue lors de la validation de la creation du membre",
            500,
            error
        );
    }
};
