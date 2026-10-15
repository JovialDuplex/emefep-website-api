/**
 * @description recuperer les infos sur l'entreprise
 * GET : /api/
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
const getCompanyInfos = function (request, response) {
    return response.status(200).json({
        success: true,
        message: "Company infos retrieved successfully",
    })
}

/**
 * @description modifier les infos sur l'entreprise
 * PATCH : /api/company/update
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */
const updateCompanyInfos = async function (request, response) {
    return response.status(200).json({
        success: true,
        message: "Company infos updated successfully",
    });
}

module.exports = {
    getCompanyInfos,
    updateCompanyInfos,
}