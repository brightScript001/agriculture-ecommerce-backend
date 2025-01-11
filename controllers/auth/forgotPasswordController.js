const User = require("../../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token and expiration time in the database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Set up nodemailer transporter
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "Email credentials are not set in the environment variables."
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      subject: "Reset Your Password",
      text: `
Dear ${user.name || "User"},

We received a request to reset the password for your account. If you made this request, please click the link below to reset your password:

${resetUrl}

If you did not request a password reset, please ignore this email or contact our support team if you have concerns about your account's security.

Please note: This link will expire in 24 hours.

Thank you for using our service.

Best regards,
The ${process.env.COMPANY_NAME || "Team"}
`,
      html: `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <p>Dear ${user.name || "User"},</p>
    <p>
      We received a request to reset the password for your account. If you made this request, please click the button below to reset your password:
    </p>
    <p style="text-align: center;">
      <a 
        href="${resetUrl}" 
        style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </p>
    <p>
      If the button above doesn't work, copy and paste the following URL into your browser:
    </p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>
      If you did not request a password reset, please ignore this email or contact our support team if you have concerns about your account's security.
    </p>
    <p><strong>Note:</strong> This link will expire in 24 hours.</p>
    <p>Thank you for using our service.</p>
    <p>Best regards,<br>The ${process.env.COMPANY_NAME || "Team"}</p>
  </body>
</html>
`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

module.exports = forgotPassword;
