import { request, response } from "express";
import { Service } from "../models/init-models";
import { apiResponse, apiResponseError } from "../utils/apiResponse";

/**
 * Fonction pour cree un service 
 * POST: /api/service/create
 * @param {string} request 
 * @param {import("express").Response} response 
 */
export const createService = function (request, response) {
    response.send("creation du service en cours ");

};

/**
 * Fonction pour mettre a jour un service 
 * PATCH : /api/service/update?id=<id_service>
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
export const updateService = function (request, response) {
    response.send("Mise a jour du service ");
}

/**
 * Fonction pour supprimer un service 
 * DELETE : /api/service/delete?id=<id_service>
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
export const deleteService = function (request, response) {
    response.send("suppression du service ");

}

/**
 * Fonction pour recuperer un service 
 * GET : /api/service ou /api/service?id=<id_service>
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
export const getService = async function (request, response) {
    response.send("recuperation du service ");
}

