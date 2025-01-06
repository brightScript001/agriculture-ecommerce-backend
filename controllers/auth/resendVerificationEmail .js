const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/user");

const SECRET_KEY = process.env.SECRET_KEY;

exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (existingUser.isVerified) {
      return res.status(400).json({ message: "Email is already verified." });
    }

    // Generate a new verification token
    const newToken = jwt.sign({ email: existingUser.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    existingUser.verificationToken = newToken; // Save to database
    await existingUser.save();

    // Send email (using nodemailer or any email service)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construct verification link
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${newToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: existingUser.email,
      subject: "Resend Email Verification",
      text: `Click the link to verify your email: ${verifyUrl}`,
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "Verification email resent successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message:
        "An error occurred while resending the verification email. Please try again.",
    });
  }
};
