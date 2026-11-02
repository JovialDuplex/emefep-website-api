const { Category } = require("../models/init-models");

const getCategory = async function (request, response) {
  try {
    const { id } = request.query;
    if (id) {
      const category = await Category.findOne({ where: { id } });
      if (category) {
        return response.status(200).json({
          message: "Category recuperer avec success",
          status: 200,
          category,
        });
      }
      return response.status(404).json({
        message: "la category n'a pas ete trouve",
        status: 404,
      });
    }

    const categories = await Category.findAll();
    return response.status(200).json({
      message: "Categories recuperer avec success",
      status: 200,
      categories,
    });
  } catch (error) {
    console.log("une erreur serveur est survenue lors de la recuperation de la category ", error);
    return response.status(500).json({
      message: "Erreur lors de la recuperation de la category",
      status: 500,
      error: error.message,
    });
  }
};

const deleteCategory = async function (request, response) {
  const { id } = request.query;

  if (!id) {
    return response.status(400).json({
      message: "L'identifiant de la categorie est requis pour la suppression",
      status: 400,
    });
  }

  try {
    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return response.status(404).json({
        message: "La categorie n'a pas ete trouvee",
        status: 404,
      });
    }

    await category.destroy();
    console.log(`Categorie #${id} supprimee avec succes`);
    return response.status(200).json({
      message: "Categorie supprimee avec succes",
      status: 200,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la categorie :", error);
    return response.status(500).json({
      message: "Erreur serveur lors de la suppression de la categorie",
      status: 500,
      error: error.message,
    });
  }
};

const updateCategory = async function (request, response) {
  try {
    const { id } = request.query;

    if (!id) {
      return response.status(400).json({
        message: "L'identifiant de la category est requis pour la mise a jour",
        status: 400,
      });
    }

    const category = await Category.findOne({ where: { id } });

    if (!category) {
      return response.status(404).json({
        message: "La category n'a pas ete trouve",
        status: 404,
      });
    }

    const IS_CLOUD = process.env.NODE_ENV === "test" || process.env.NODE_ENV === "production";
    const { category_name, category_desc } = request.body;

    if (category_name !== undefined) {
      category.category_name = category_name;
    }

    if (category_desc !== undefined) {
      category.category_desc = category_desc;
    }

    if (request.file) {
      category.category_image_preview = IS_CLOUD
        ? request.file.path
        : `uploads/category/${request.file.filename}`;
    }

    await category.save();

    console.log(`[updateCategory] Category #${id} mise a jour avec succes`);

    return response.status(200).json({
      message: "Category mise a jour avec succes",
      status: 200,
      category,
    });
  } catch (error) {
    console.error("Erreur serveur lors de la mise a jour de la category :", error);
    return response.status(500).json({
      message: "Erreur serveur lors de la mise a jour de la category",
      status: 500,
      error: error.message,
    });
  }
};

const createCategory = async function (request, response) {
  try {
    const data = request.body;
    const IS_CLOUD = process.env.NODE_ENV === "test" || process.env.NODE_ENV === "production";
    const image_url = IS_CLOUD
      ? request.file.path
      : `uploads/category/${request.file.filename}`;

    const category = await Category.create({
      ...data,
      category_slug: data.category_slug
        ? data.category_slug
        : "@" + data.category_name.toLowerCase().replace(/\s+/g, "-"),
      category_image_preview: image_url,
    });

    console.log("category cree avec success !");

    return response.status(201).json({
      message: "Category cree avec succes",
      status: 201,
      category,
    });
  } catch (error) {
    console.log("une erreur serveur est survenue lors de la creation de la category ", error);
    return response.status(500).json({
      message: "Erreur lors de la creation de la category",
      status: 500,
      error: error.message,
    });
  }
};

module.exports = {
  getCategory,
  deleteCategory,
  updateCategory,
  createCategory,
};
