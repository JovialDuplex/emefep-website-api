const router = require("express").Router();
const statController = require("../controllers/statController");

router.post("/create", statController.createStat);

router.get("/", statController.getAllStat);

router.patch("/update", statController.updateStat);

router.delete("/delete", statController.deleteStat);

module.exports = router;