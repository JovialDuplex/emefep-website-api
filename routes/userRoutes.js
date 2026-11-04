const { getUserInfos, login, register } = require("../controllers/userController");

const router = require("express").Router();

router.get("/get-infos", getUserInfos);
router.post("/login", login);
router.post("/register", register);

module.exports = router;
