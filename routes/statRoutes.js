const { Router } = require("express");
const statController = require("../controllers/statController");
const statValidation = require("../middlewares/statValidation");

const statRouter = Router();

statRouter.post("/create", statValidation.createStatValidate, statController.createStat);
statRouter.get("/", statController.getAllStat);
statRouter.patch("/update", statValidation.updateStatValidate, statController.updateStat);
statRouter.delete("/delete", statController.deleteStat);

module.exports = statRouter;
