const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../../models/user");

// Function to generate a confirmation token and send an email
const sendConfirmationEmail = async (user, isResend = false) => {
  try {
    // Generate a confirmation token and save it
    const token = user.generateEmailConfirmToken();
    await user.save();

    // Create transporter for sending the email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construct the confirmation URL
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
    const subject = isResend
      ? "Resend Email Verification"
      : "Email Verification";

    // Setup email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: rgba(91, 170, 96, 1);">Welcome to Our Platform</h2>
        <p>Hi ${user.firstName},</p>
        <p>Thank you for signing up. Please confirm your email address by clicking the link below:</p>
        <p>
          <a href="${confirmUrl}" 
             style="display: inline-block; background-color: rgba(91, 170, 96, 1); color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
            Confirm Email Address
          </a>
        </p>
        <p>If the button above doesn't work, you can also click the link below:</p>
        <p>
          <a href="${confirmUrl}">
            ${confirmUrl}
          </a>
        </p>
        <p style="color: #666;">If you did not sign up for this account, you can safely ignore this email.</p>
        <p>Best regards,</p>
        <p><strong>Your Company Team</strong></p>
      </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending confirmation email:", error.message);
    throw new Error("Unable to send confirmation email. Please try again.");
  }
};

// Signup Controller
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    // Send email confirmation link
    await sendConfirmationEmail(newUser);

    res.status(201).json({
      message:
        "User created successfully. Please check your email to confirm your account.",
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = {
  signupUser,
};
