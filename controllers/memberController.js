/**
 * @description Recuperation de toutes les informations sur un membre ou tous  les membres 
 * GET : /api/member/
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const getMember = (req, res) => {
    response.send("getting information of this member ");
};

/**
 * @description Ajout d'un membre 
 * POST : /api/member/add
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const addMember = (req, res) => {
    response.send("adding a member ");
};

/**
 * @description Mise a jour des informations d'un membre 
 * PUT : /api/member/update
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const updateMember = (req, res) => {
    response.send("updating a member ");
};

/**
 * @description Suppression d'un membre 
 * DELETE : /api/member/remove
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
const removeMember = (req, res) => {
    response.send("removing a member ");
};

module.exports = {
    getMember,
    addMember,
    updateMember,
    removeMember,
};
