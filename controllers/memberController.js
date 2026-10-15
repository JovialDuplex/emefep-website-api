const { Member } = require("../models/init-models");

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
                return response.status(404).json({
                    status: 404,
                    message: "Le membre en question n'a pas ete trouve "
                });
            }
            return response.status(200).json({
                status: 200,
                message: "Recuperation des information sur le membre reussie",
                member
            });
        } else {
            const members = await Member.findAll();
            return response.status(200).json({
                status: 200,
                message: "Recuperation de tous les membres reussie",
                members
            })
        }
    } catch (error) {
        console.error("Erreur serveur lors de la recuperation des membres : ", error);
        return response.status(500).json({
            status: 500,
            message: "Erreur serveur lors de la recuperation des membres",
            error: error.message
        });
    }
};

/**
 * @description Ajout d'un membre 
 * POST : /api/member/add
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const addMember = (request, response) => {
    response.send("adding a member ");
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
 * DELETE : /api/member/remove
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const removeMember = (request, response) => {
    response.send("removing a member ");
};

module.exports = {
    getMember,
    addMember,
    updateMember,
    removeMember,
};
