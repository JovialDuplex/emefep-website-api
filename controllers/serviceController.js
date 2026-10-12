import { Service } from "../models/init-models.js";
import { apiResponse, apiResponseError } from "../utils/apiResponse.js";
import { deleteMulterFile } from "../utils/deleteUploadedFile.js";

const IS_TEST = process.env.NODE_ENV === 'test';
const IS_DEV = process.env.NODE_ENV === 'development'
/**
 * Fonction pour cree un service 
 * POST: /api/service/create
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const createService = async function (request, response) {

    try {
        const data = request.body;
        const service = await Service.create({
            ...request.body,
            service_image: IS_TEST ? request.file.path : IS_DEV ? `/uploads/service/${request.file.filename}` : null,
            service_slug: data.service_slug ? data.service_slug : "@" + data.service_name.toLowerCase().replace(/\s+/g, "-"),
        });

        return apiResponse(response, "Le service a ete cree avec success ! ", 200, service);

    } catch (error) {
        await deleteMulterFile(request.file);
        return apiResponseError(response, "Une erreur serveur est survenue lors de la creation du service", 500, error);
    }
};

/**
 * Fonction pour mettre a jour un service 
 * PATCH : /api/service/update?id=<id_service>
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const updateService = function (request, response) {
    response.send("Mise a jour du service ");
}

/**
 * Fonction pour supprimer un service 
 * DELETE : /api/service/delete?id=<id_service>
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const deleteService = async function (request, response) {
    try {
        const { id } = request.query;
        if (!id) return apiResponse(response, "L'identifiant est requis pour supprimer le service", 400);

        const service = await Service.findOne({ where: { id } });
        if (!service) return apiResponse(response, `Le service #${id} n'a pas ete retrouve`, 404);

        await service.destroy();
        return apiResponse(response, `Le service #${id} a ete supprimer avec success !`, 201);

    } catch (error) {
        return apiResponseError(response, "Une erreur serveur est survenue lors de suppression du service ", 500, error);
    }
}

/**
 * Fonction pour recuperer un service 
 * GET : /api/service ou /api/service?id=<id_service>
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const getService = async function (request, response) {
    try {
        const { id } = request.query;
        if (id) {
            const service = await Service.findOne({ where: { id } });
            if (!service) return apiResponse(response, `Le service #${id} n'a pas ete trouver`, 404);
            return apiResponse(response, `Recuperation du service #${id} effectuer avec succes `, 200, service);
        }
        const services = await Service.findAll();
        return apiResponse(response, "Tous les services ont ete recuperer avec success !", 200, services);

    } catch (error) {
        return apiResponseError(response, "Une erreur serveur est survenue lors de recuperation du service ", 500, error);
    }
};

export default {
    getService,
    createService,
    deleteService,
    updateService,
};

