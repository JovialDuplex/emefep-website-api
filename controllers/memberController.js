
const { Member } = require("../models/init-models");
const { apiResponse, apiResponseError } = require("../utils/apiResponse");

/**
 * @description Recuperation de toutes les informations sur un membre ou tous  les membres 
 * GET : /api/member/
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
const getMember = async (request, response) => {
    try {
        const { id } = request.query;
        if (id) {
            const member = await Member.findOne({ where: { id } });
            if (!member) {
                return apiResponse(response, "Le membre en question n'a pas ete trouve ", 404);

            }
            return apiResponse(response, "Recuperation des information sur le membre reussie", 200, member);

        } else {
            const members = await Member.findAll();
            return response.status(200).json({
                status: 200,
                message: "Recuperation de tous les membres reussie",
                members
            });

            return apiResponse(response, "Recuperation de tous les membres reussie", 200, members);
        }
    } catch (error) {
        return apiResponseError(response, "Erreur serveur lors de la recuperation des membres", 500, error)
    }
};

/**
 * @description Ajout d'un membre 
 * POST : /api/member/add
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const addMember = async (request, response) => {
    try {

    } catch (error) {
        return apiResponseError(
            response,
            "Une erreur cote serveur est survenue lors de l'ajout du membre ",
            500,
            error
        );
    }
};

/**
 * @description Mise a jour des informations d'un membre 
 * PUT : /api/member/update
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const updateMember = (request, response) => {
    response.send("updating a member ");
};

/**
 * @description Suppression d'un membre 
 * DELETE : /api/member/remove?id=<id_member>
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const removeMember = async (request, response) => {
    const { id } = request.query;
    if (!id) {
        return apiResponse(response, "l'identifiant est requis pour retirer le membre", 400);
    }
    try {

        const member = await Member.findOne({ where: { id } });
        if (!member) {
            return apiResponse(
                response, 
                `le membre #${id} n'a pas ete retrouve`, 
                404
            );
        }

        await member.destroy();
        console.log();
        return apiResponse(response, `le membre #${id} a ete supprime avec success `, 200);

    } catch (error) {
        return apiResponseError(
            response,
            `une erreur serveur est survenue lors de la suppression du membre #${id}`,
            500,
            error
        );
    }
};

module.exports = {
    getMember,
    addMember,
    updateMember,
    removeMember,
};
