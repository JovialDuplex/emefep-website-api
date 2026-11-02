const { Router } = require("express");
const memberController = require("../controllers/memberController");
const { uploadFile } = require("../config/config");
const { createMemberValidation, updateMemberValidation } = require("../middlewares/memberValidation");

const memberRouter = Router();

memberRouter.get("/", memberController.getMember);
memberRouter.post("/add", uploadFile.single("member_image"), createMemberValidation, memberController.addMember);
memberRouter.patch("/update", uploadFile.single("member_image"), updateMemberValidation, memberController.updateMember);
memberRouter.delete("/remove", memberController.removeMember);

module.exports = memberRouter;
