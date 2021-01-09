const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");


router.post("/auth/signup", authCtrl.signup);
router.post("/auth/login", authCtrl.signin);

module.exports = router;
