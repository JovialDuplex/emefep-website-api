import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
import categoryValidator from "../middlewares/categoryValidation.js";
import { uploadFile } from "../config/config.js";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategory);
categoryRouter.post("/create", uploadFile.single("category_image_preview"), categoryValidator.createCategoryValidation, categoryController.createCategory);
categoryRouter.patch("/update", uploadFile.single("category_image_preview"), categoryController.updateCategory);
categoryRouter.delete("/delete", categoryController.deleteCategory);

export default categoryRouter;