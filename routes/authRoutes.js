const express = require("express");
const {
  signupUser,
  loginUser,
  forgotPassword,
  resetPassword,
  resendLink,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-link", resendLink);

module.exports = router;
