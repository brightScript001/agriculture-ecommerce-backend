const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const user = require("../../models/user");

const SECRET_KEY = process.env.SECRET_KEY;

// Function to resend verification email
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await user.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate a new verification token
    const newToken = jwt.sign({ email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    user.verificationToken = newToken; // Save to database if needed
    await user.save();

    // Send email (using nodemailer or any email service)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Resend Email Verification",
      text: `Click the link to verify your email: http://localhost:3000/verify-email/${newToken}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Verification email resent." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again." });
  }
};
