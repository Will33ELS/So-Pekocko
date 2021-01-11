const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");
const saucesCtrl = require("../controllers/sauce");

const authMiddleware = require("../middleware/auth");
const multerMiddleware = require("../middleware/multer-config");

router.post("/auth/signup", authCtrl.signup);
router.post("/auth/login", authCtrl.signin);

router.get("/sauces", authMiddleware, saucesCtrl.getAllSauces);
router.get("/sauces/:id", authMiddleware, saucesCtrl.getSauce);
router.post("/sauces", authMiddleware, multerMiddleware, saucesCtrl.createSauce);
router.put("/sauces/:id", authMiddleware, multerMiddleware, saucesCtrl.updateSauce);
router.delete("/sauces/:id", authMiddleware, saucesCtrl.deleteSauce);
router.post("/sauces/:id/like", authMiddleware, saucesCtrl.likeSauce);

module.exports = router;
