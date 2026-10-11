const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../middlewares/categoryValidation");
const { uploadFile } = require("../config/config");

router.get("/", categoryController.getCategory);
router.post("/create", uploadFile.single("category_image_preview"), categoryValidator.createCategoryValidation, categoryController.createCategory);
router.patch("/update", uploadFile.single("category_image_preview"), categoryController.updateCategory);
router.delete("/delete", categoryController.deleteCategory);

module.exports = router;