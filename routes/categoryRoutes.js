const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../middlewares/categoryValidation");
const { uploadFile } = require("../config/config");

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategory);
categoryRouter.post("/create", uploadFile.single("category_image_preview"), categoryValidator.createCategoryValidation, categoryController.createCategory);
categoryRouter.patch("/update", uploadFile.single("category_image_preview"), categoryController.updateCategory);
categoryRouter.delete("/delete", categoryController.deleteCategory);

module.exports = categoryRouter;
