const router = require("express").Router();
const statController = require("../controllers/statController");
const statValidation = require("../middlewares/statValidation");

router.post("/create", statValidation.createStatValidate, statController.createStat);

router.get("/", statController.getAllStat);

router.patch("/update", statValidation.updateStatValidate, statController.updateStat);

router.delete("/delete", statController.deleteStat);

module.exports = router;