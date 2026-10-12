import { Member } from "../models/init-models.js";
import { apiResponse, apiResponseError } from "../utils/apiResponse.js";
import { deleteMulterFile } from "../utils/deleteUploadedFile.js";

const IS_TEST = process.env.NODE_ENV === 'test';
const IS_DEV = process.env.NODE_ENV === 'development';


/**
 * @description Recuperation de toutes les informations sur un membre ou tous  les membres -----------------------------------------------------------
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
 * @description Ajout d'un membre ---------------------------------------------------------------
 * POST : /api/member/add
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const addMember = async (request, response) => {
    try {
        const data = request.body;

        //verifier si le membre existe deja 
        const mymember = await Member.findOne({ where: { member_email: data.member_email } });
        if (mymember) {
            await deleteMulterFile(request.file);
            return apiResponse(response, "le membre existe deja ", 201);
        }

        //url de l'image pour la production n'a pas encore definie 
        const image_url = IS_TEST ? request.file.path : IS_DEV ? `/uploads/member/${request.file.filename}` : null;
        
        const member = await Member.create({
            ...data,
            member_image: image_url,
        });
        return apiResponse(response, "Le membre a ete ajouter avec success ! ", 200, member);

    } catch (error) {
        await deleteMulterFile(request.file)
        return apiResponseError(
            response,
            "Une erreur cote serveur est survenue lors de l'ajout du membre ",
            500,
            error
        );
    }
};

/**
 * @description Mise a jour des informations d'un membre-----------------------------------------
 * PUT : /api/member/update
 * @param {import("express").Request} request 
 * @param {import("express").Response} response 
 */
const updateMember = async (request, response) => {
    const { id } = request.query;

    if (!id) {
        return apiResponse(
            response,
            "L'identifiant du membre est requis pour effectuer la mise a jour",
            400
        );
    }

    try {
        // 1. Verifier que le membre existe
        const member = await Member.update({
            ...request.body,
            ...(request.file ? {
                member_image: IS_TEST ? request.file.path : IS_DEV ? `/uploads/member/${request.file.filename}` : null,
            } : {}),
        }, { where: { id }, individualHooks: true });

        if (!member[0]) {
            // si l'utilisateur n'a pas ete trouve on supprime l'image qui a ete uploader
            if (request.file) {
                await deleteMulterFile(request.file);
            }

            return apiResponse(
                response,
                `le membre #${id} n'a pas ete retrouve`,
                404,
            );
        }

        return apiResponse(
            response,
            `le membre #${id} a ete mise a jour avec succes `,
            200,
            member,
        );

    } catch (error) {
        return apiResponseError(
            response,
            "Une erreur cote serveur est survenue lors de la mise a jour du membre ",
            500,
            error
        )
    }

};

/**
 * @description Suppression d'un membre-----------------------------------------------------------
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

export default {
    getMember,
    addMember,
    updateMember,
    removeMember,
};
