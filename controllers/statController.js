const { CompanyStat } = require("../models/init-models");

const createStat = async function (request, response) {
  try {
    const stat = await CompanyStat.create(request.body);
    return response.status(201).json({
      message: "une statistique a ete ajoute avec success",
      status: 201,
      stat,
    });
  } catch (error) {
    console.error(" erreur serveur lors de la creation d'une statistique ", error);
    return response.status(500).json({
      message: "Erreur serveur lors de la creation de la statistique",
      status: 500,
      error: error.message,
    });
  }
};

const getAllStat = async function (request, response) {
  try {
    const stats = await CompanyStat.findAll();
    return response.status(200).json({
      message: "les statistiques ont ete recuperer avec success",
      status: 200,
      stats,
    });
  } catch (error) {
    console.error(" erreur serveur lors de la recuperation des statistiques ", error);
    return response.status(500).json({
      message: "Erreur serveur lors de la recuperation des statistiques",
      status: 500,
      error: error.message,
    });
  }
};

const updateStat = async function (request, response) {
  try {
    const { id } = request.query;
    if (!id) {
      return response.status(400).json({
        message: "l'identifiant de la statistique est requis pour la mise a jour",
        status: 400,
      });
    }

    const stat = await CompanyStat.findOne({ where: { id } });
    if (!stat) {
      return response.status(404).json({
        message: "la statistique n'a pas ete trouve",
        status: 404,
      });
    }

    const updatedStat = await stat.update(request.body);
    return response.status(200).json({
      message: "la statistique a ete mise a jour avec success",
      status: 200,
      updatedStat,
    });
  } catch (error) {
    console.error(" erreur serveur lors de la mise a jour de la statistique ", error);
    return response.status(500).json({
      message: "Erreur serveur lors de la mise a jour de la statistique",
      status: 500,
      error: error.message,
    });
  }
};

const deleteStat = async function (request, response) {
  try {
    const { id } = request.query;
    if (!id) {
      return response.status(400).json({
        message: "l'identifiant de la statistique est requis pour la suppression",
        status: 400,
      });
    }

    const stat = await CompanyStat.findOne({ where: { id } });
    if (!stat) {
      return response.status(404).json({
        message: "la statistique n'a pas ete trouve",
        status: 404,
      });
    }

    const deletedStat = await stat.destroy();
    return response.status(200).json({
      message: "la statistique a ete supprimer avec success",
      status: 200,
      deletedStat,
    });
  } catch (error) {
    console.error(" erreur serveur lors de la suppression de la statistique ", error);
    return response.status(500).json({
      message: "Erreur serveur lors de la suppression de la statistique",
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  createStat,
  getAllStat,
  updateStat,
  deleteStat,
};
