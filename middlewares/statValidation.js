const joi = require('joi');

const createStatValidationSchema = joi.object({
    stat_label: joi.string().max(150).required().messages({
        'string.empty': 'Le libelle est requis',
        'string.max': 'Le libelle ne doit pas depasser 150 caracteres',
    }),
    stat_value: joi.string().max(16).required().messages({
        'string.empty': 'La valeur est requise',
        'string.max': 'La valeur ne doit pas depasser 16 caracteres',
    }),
});

const updateStatValidationSchema = joi.object({
    stat_label: joi.string().max(150).optional().messages({
        'string.max': 'Le libelle ne doit pas depasser 150 caracteres',
    }),
    stat_value: joi.string().max(16).optional().messages({
        'string.max': 'La valeur ne doit pas depasser 16 caracteres',
    }),
});
/**
 * @description middleware de validation des donnees de la statistique 
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} next 
 */
const createStatValidate = function (request, response, next) {
    try {
        const { error } = createStatValidationSchema.validate(request.body, { abortEarly: false });
        if (error) {
            const details = error.details.map(detail => ({
                message: detail.message,
                path: detail.path,
            }));

            return response.status(400).json({
                message: "erreur de validation lors de la creation de la statistique",
                status: 400,
                details,
            });
        }
        console.log("aucune erreur lors de la validation des donnees de la statistique");
        next();
    }
    catch (error) {
        console.error(" erreur serveur lors de la validation des donnees de la statistique ", error);
        return response.status(500).json({
            message: "Erreur serveur lors de la validation des donnees de la statistique",
            status: 500,
            error: error.message,
        });
    }
};

/**
 * @description middleware de validation des donnees de la statistique 
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 * @param {import("express").NextFunction} next 
 */
const updateStatValidate = function (request, response, next) {
    try {
        const { error } = updateStatValidationSchema.validate(request.body, { abortEarly: false });
        if (error) {
            const details = error.details.map(detail => ({
                message: detail.message,
                path: detail.path,
            }));

            return response.status(400).json({
                message: "erreur de validation lors de la mise a jour de la statistique",
                status: 400,
                details,
            });
        }
        console.log("aucune erreur lors de la validation des donnees de la statistique");

        next();
    }
    catch (error) {
        console.error(" erreur serveur lors de la validation des donnees de la statistique ", error);
        return response.status(500).json({
            message: "Erreur serveur lors de la validation des donnees de la statistique",
            status: 500,
            error: error.message,
        });
    }
};


module.exports = {
    createStatValidate,
    updateStatValidate,
}