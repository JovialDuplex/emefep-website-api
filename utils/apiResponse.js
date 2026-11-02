/**
 * Utilitaire pour les reponse d'erreur de l'api
 */
const apiResponseError = function (response, message, status, error) {
  console.log(message + " : ", error);
  response.status(status).json({
    message,
    status,
    error: error.message,
  });
};

/**
 * Utilitaire pour tous type de reponse d'api
 */
const apiResponse = function (response, message, status, data) {
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
    ...(data !== undefined && { data }),
  });
};

module.exports = {
  apiResponse,
  apiResponseError,
};
