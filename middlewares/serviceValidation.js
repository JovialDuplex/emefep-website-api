import express from "express";
import joi from "joi";
import { DataTypes, Sequelize } from "sequelize";
import { apiResponse } from "../utils/apiResponse.js";

const createServiceValidationSchema = joi.object({
    service_name: joi.string().max(150).required().messages({
        "string.empty": "Le nom du service est obligatoire",
        "string.max": "Le nom du service ne doit pas depasser 150 caracteres",
    }),
    service_desc: joi.string().max(500).required().messages({
        "string.empty": "La description du service est obligatoire",
        "string.max": "La description du service ne doit pas depasser 500 caracteres", 
    }),
    service_image: joi.object({
        size: joi.number().required().max(5*1024*1024).messages({
            "number.max": "le taille de l'image du service ne doit pas depasser 5Mo",
            "any.required": "La taille est requise"         
        }),
        mimetype: joi.string().required().valid("image/jpg", "image/png", "image/jpeg", "image/bmp").messages({
            "any.only": "Le type de fichier accepter sont les image jpg, png, bmp, jpeg",
        })
    }).required().messages({
        "any.required": "L'image du service est obligatoire",
        "object.base": "L'image du service doit etre obligatoirement un fichier"
    }),

    service_details: joi.object().optional().messages({
        "object.base": "Le detail du service doit etre un objet json "
    }),
    service_category: joi.string().required().messages({
        "string.empty": "La category du service est obligatoire",
    }),

    service_slug: joi.string().optional().max(150).messages({
        "string.max": "Le slug du service ne doit pas depasser 150 caracteres ",
    })
});

const updateServiceValidationSchema = joi.object({
    service_name: joi.string().max(150).optional().messages({
        "string.max": "Le nom du service ne doit pas depasser 150 caracteres",
    }),
    service_desc: joi.string().optional().max(500).messages({
        "string.max": "La description du service ne doit pas depasser 500 caracteres", 
    }),
    service_image: joi.object({
        size: joi.number().required().max(5*1024*1024).messages({
            "number.max": "le taille de l'image du service ne doit pas depasser 5Mo",
            "any.required": "La taille est requise"         
        }),
        mimetype: joi.string().required().valid("image/jpg", "image/png", "image/jpeg", "image/bmp").messages({
            "any.only": "Le type de fichier accepter sont les image jpg, png, bmp, jpeg",
        })
    }).optional(),

    service_details: joi.object().optional().messages({
        "object.base": "Le detail du service doit etre un objet json "
    }),
    service_category: joi.string().optional().messages({
        "string.empty": "La category du service est obligatoire",
    }),

    service_slug: joi.string().optional().max(150).messages({
        "string.max": "Le slug du service ne doit pas depasser 150 caracteres ",
    })
});

/**
 * Fonction de validation de donnee lors de la creation du service 
 * @param {import('express').Request} request 
 * @param {import("express").Response} response 
 * @param {import('express').NextFunction} next 
 */
export const serviceValidation = function(request, response, next){
    const isCreate = request.method === "POST";
    console.log(isCreate ? "utilisation du schema de creation" : "utilisation du schema de modification")
    const {error} = (request.method === "POST" ? createServiceValidationSchema: updateServiceValidationSchema).validate({
        ...request.body,
        service_image: request.file ? {
            size: request.file.size,
            mimetype: request.file.mimetype,
        } : null,

    }, {abortEarly: false});

    if(!error) return next();
    const details = error.details.map(detail=> ({
        message: detail.message,
        path: detail.path,
    }));
  
    return apiResponse(response, "Une erreur de validation est survenue lors de creation du service ", 400, details);
};