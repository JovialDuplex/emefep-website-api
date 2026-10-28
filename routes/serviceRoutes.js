import {Router} from "express";
import serviceController from "../controllers/serviceController.js";
import { uploadFile } from "../config/config.js";
import { serviceValidation } from "../middlewares/serviceValidation.js";
const serviceRouter = Router();

serviceRouter.post("/create", uploadFile.single("service_image"), serviceValidation, serviceController.createService);
serviceRouter.get("/", serviceController.getService);
serviceRouter.patch("/update", uploadFile.single("service_image"), serviceController.updateService);
serviceRouter.delete("/delete", serviceController.deleteService);

export default serviceRouter;
