const nodemailer = require("nodemailer");
const User = require("../../models/user");

const sendConfirmationEmail = async (user, isResend = false) => {
  if (
    !process.env.EMAIL_USER ||
    !process.env.EMAIL_PASS ||
    !process.env.FRONTEND_URL
  ) {
    throw new Error(
      "Missing required environment variables for email service."
    );
  }

  try {
    const token = user.generateEmailConfirmToken();
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
    const subject = isResend
      ? "Resend Email Verification"
      : "Email Verification";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: rgba(91, 170, 96, 1);">Welcome to OneFarm</h2>
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
        <p><strong>OneFarm Team</strong></p>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending confirmation email:", error.message);
    throw new Error("Unable to send confirmation email. Please try again.");
  }
};

const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

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
