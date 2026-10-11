const joi = require("joi");

const categoryValidationSchema = joi.object({
    category_name: joi.string().required(),
    category_desc: joi.string().required(),
    category_image_preview: joi.object({
        size: joi.number().max(1024 * 1024 * 5).required(),
        mimetype: joi.string()
            .valid('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/octet-stream')
            .required(),
    }).required(),
});

/**
 * 
 * @param { import("express").Request} request 
 * @param { import("express").Response} response 
 * @param { import("express").NextFunction} next 
 */
const createCategoryValidation = function (request, response, next) {
    console.log(request.file.mimetype);

    const { error } = categoryValidationSchema.validate({
        ...request.body,
        category_image_preview: {
            size: request.file.size,
            mimetype: request.file.mimetype
        }
    }, { abortEarly: false });

    if (error) {
        const details = error.details.map(detail => ({
            message: detail.message,
            path: detail.path,
        }));

        console.log("erreur de validation lors de la creation de la category : ", details);

        return response.status(400).json({
            message: "Erreur de validation lors de la creation de la category",
            error: details,
            status: 400,
        });
    }

    console.log("aucune erreur lors de la validation de la category");
    return next();
};

module.exports = {
    createCategoryValidation
};