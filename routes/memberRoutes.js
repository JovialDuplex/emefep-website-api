import memberController from "../controllers/memberController.js";
import { Router } from "express";
import { uploadFile } from "../config/config.js";
import { createMemberValidation } from "../middlewares/memberValidation.js";

const memberRouter = Router();

memberRouter.get("/", memberController.getMember);
memberRouter.post("/add", uploadFile.single('member_image'), createMemberValidation, memberController.addMember);
memberRouter.put("/update", memberController.updateMember);
memberRouter.delete("/remove", memberController.removeMember);

export default memberRouter;
