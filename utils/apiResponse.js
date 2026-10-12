/**
 * Utilitaire pour les reponse d'erreur de l'api 
 * @param {import("express").Response} response 
 * @param {Error} error 
 * @param {number} status 
 * @param {string} message 
 */
const apiResponseError = function(response, message, status, error){
    console.log(message + " : ", error);
    response.status(status).json({
        message,
        status,
        error: error.message,
    })
};

/**
 * Utilitaire pour tous type de reponse d'api 
 * data non obligatoire 
 * @param {import("express").Response} response 
 * @param {number} status 
 * @param {string} message 
 * @param {any} data
 */
const apiResponse = function(response, message, status, data){
    
    console.log(`
        {
            message : ${message},
            status: ${status},
            data: ${data},
        }
    `);
    
    response.status(status).json({
        message,
        status,
        ...(data !== undefined && {data}),
    });

};

export {
    apiResponse,
    apiResponseError
};