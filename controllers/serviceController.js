const { Category, Service } = require("../models/init-models");
const { apiResponse, apiResponseError } = require("../utils/apiResponse");
const { deleteMulterFile } = require("../utils/deleteUploadedFile");

const IS_TEST = process.env.NODE_ENV === "test";
const IS_DEV = process.env.NODE_ENV === "development";

const createService = async function (request, response) {
  try {
    const data = request.body;

    if (data.service_slug) {
      if (await Service.findOne({ where: { service_slug: data.service_slug } })) {
        deleteMulterFile(request.file);
        return apiResponse(response, "Le service que vous voulez cree existe deja ", 201);
      }
    } else if (await Service.findOne({ where: { service_slug: "@" + data.service_name.toLowerCase().replace(/\s+/g, "-") } })) {
      deleteMulterFile(request.file);
      return apiResponse(response, "Le service que vous voulez cree existe deja ", 201);
    }

    if (!(await Category.findOne({ where: { id: data.service_category } }))) {
      await deleteMulterFile(request.file);
      return apiResponse(response, "La categorie choisi n'existe pas ", 404);
    }

    const service = await Service.create({
      ...request.body,
      service_image: IS_TEST ? request.file.path : IS_DEV ? `/uploads/service/${request.file.filename}` : null,
      service_slug: data.service_slug ? "@" + data.service_slug : "@" + data.service_name.toLowerCase().replace(/\s+/g, "-"),
    });

    return apiResponse(response, "Le service a ete cree avec success ! ", 200, service);
  } catch (error) {
    await deleteMulterFile(request.file);
    return apiResponseError(response, "Une erreur serveur est survenue lors de la creation du service", 500, error);
  }
};

const updateService = async function (request, response) {
  try {
    const { id } = request.query;
    if (!id) {
      return apiResponse(response, "L'identifiant du service est obligatoire lors de la mise a jour", 400);
    }

    const newService = await Service.update({
      ...request.body,
      ...(request.file
        ? {
            service_image: IS_TEST ? request.file.path : IS_DEV ? `/uploads/service/${request.file.filename}` : null,
          }
        : {}),
    }, { where: { id }, individualHooks: true });

    if (!newService[0]) {
      if (request.file) {
        await deleteMulterFile(request.file);
      }
      return apiResponse(response, `le service #${id} n'a pas ete retrouvee`, 404);
    }

    return apiResponse(response, `le service #${id} a ete mis a jour avec success `, 200, newService);
  } catch (error) {
    return apiResponseError(response, "Une erreur serveur est survenue lors de la mise a jour du service ");
  }
};

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
};

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

module.exports = {
  getService,
  createService,
  deleteService,
  updateService,
};
