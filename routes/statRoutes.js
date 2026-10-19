import { Router } from "express";
import statController from "../controllers/statController.js";
import statValidation from "../middlewares/statValidation.js";

const statRouter = Router();

statRouter.post("/create", statValidation.createStatValidate, statController.createStat);
statRouter.get("/", statController.getAllStat);
statRouter.patch("/update", statValidation.updateStatValidate, statController.updateStat);
statRouter.delete("/delete", statController.deleteStat);

export default statRouter;