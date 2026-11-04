/**
 * @method POST
 * @url /api/user/login
 * @description Fonction permettant de se connecter 
 * @param {import("express").Request} request 
 * @param {import('express').Response} response
 * 
*/
const login = function(request, response){
    response.send("connexion de l'utilisateur reussit ");
}

/**
 * @method POST
 * @url /api/user/register
 * @description Fonction permettant d'enregistrer un utilisateur 
 * @param {import('express').Request} request 
 * @param {import("express").Response} response 
 */
const register = function(request, response){
    response.send("enregistrement de l'utilisateur reussit !");
}

/**
 * 
 * @method GET
 * @url /api/user/get-infos
 * @description Fonction permettant de recuperer les infos d'un utilisateur 
 * @param {import('express').Request} request 
 * @param {import('express').Response} response 
 */
const getUserInfos = function(request, response){
    response.send("recuperation des informations de l'utilisateur effectuer avec success !");
};

module.exports = {
    getUserInfos,
    login, 
    register,
}