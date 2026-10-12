import {Router} from "express";
import { createService, deleteService, getService, updateService } from "../controllers/serviceController";

const serviceRouter = Router();

serviceRouter.post("/create", createService);
serviceRouter.get("/", getService);
serviceRouter.patch("/update", updateService);
serviceRouter.delete("/delete", deleteService);

export default serviceRouter;
