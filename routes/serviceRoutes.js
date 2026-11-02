const { Router } = require("express");
const serviceController = require("../controllers/serviceController");
const { uploadFile } = require("../config/config");
const { serviceValidation } = require("../middlewares/serviceValidation");

const serviceRouter = Router();

serviceRouter.post("/create", uploadFile.single("service_image"), serviceValidation, serviceController.createService);
serviceRouter.get("/", serviceController.getService);
serviceRouter.patch("/update", uploadFile.single("service_image"), serviceValidation, serviceController.updateService);
serviceRouter.delete("/delete", serviceController.deleteService);

module.exports = serviceRouter;
