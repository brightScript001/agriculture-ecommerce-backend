const User = require("../../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Resend Password Reset Link Controller
const resendLink = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetPasswordToken && user.resetPasswordExpires > Date.now()) {
      const resetUrl = `http://localhost:3000/reset-password/${user.resetPasswordToken}`;
      const mailOptions = {
        to: user.email,
        subject: "Resend Password Reset Request",
        text: `Click the link to reset your password: ${resetUrl}`,
      };

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail(mailOptions);
      return res
        .status(200)
        .json({ message: "Password reset link resent successfully" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl =  `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    const mailOptions = {
      to: user.email,
      subject: "Resend Password Reset Request",
      text: `Click the link to reset your password: ${resetUrl}`,
    };

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset link generated and sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resending password reset link" });
  }
};

module.exports = resendLink;
