const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.get("/", authMiddleware, userController.getUser);
router.put("/", authMiddleware, userController.updateUserInfo);
module.exports = router;
