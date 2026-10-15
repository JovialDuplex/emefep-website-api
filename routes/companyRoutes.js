const companyController = require("../controllers/companyController");
const router = require("express").Router();

router.post("/", companyController.getCompanyInfos);
router.patch("/update", companyController.updateCompanyInfos);

module.exports = router;