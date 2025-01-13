const express = require("express");
const { signupUser } = require("../controllers/auth/signupController");
const { confirmEmail } = require("../controllers/auth/confirmEmailController");
const loginUser = require("../controllers/auth/loginController");
const forgotPassword = require("../controllers/auth/forgotPasswordController");
const resetPassword = require("../controllers/auth/resetPasswordController");
const resendLink = require("../controllers/auth/resendLinkController");
const {
  resendVerificationEmail,
} = require("../controllers/auth/resendVerificationEmail ");

const router = express.Router();

router.post("/signup", signupUser);
router.get("/confirm-email", confirmEmail);

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.post("/resend-link", resendLink);
router.post("/resend-verification", resendVerificationEmail);
module.exports = router;
