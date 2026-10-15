const memberController = require("../controllers/memberController");
const router = require("express").Router();

router.get("/", memberController.getMember);
router.post("/add", memberController.addMember);
router.put("/update", memberController.updateMember);
router.delete("/remove", memberController.removeMember);

module.exports = router;
