const router = require("express").Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getCategory);
router.post("/create", categoryController.createCategory);
router.patch("/update", categoryController.updateCategory);
router.delete("/delete", categoryController.deleteCategory);

module.exports = router;