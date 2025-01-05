const nodemailer = require("nodemailer");
const crypto = require("crypto");
const user = require("../../models/user");

// Function to generate a confirmation token and send an email
const sendConfirmationEmail = async (user) => {
  // Generate a confirmation token
  const token = user.generateEmailConfirmToken();

  // Update the user's record with the token
  user.emailConfirmedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  await user.save();

  // Create transporter for sending the email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // your email address
      pass: process.env.EMAIL_PASS, // your email password
    },
  });

  const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;

  // Setup email options
  const mailOptions = {
    to: user.email,
    subject: "Please Confirm Your Email",
    text: `Please confirm your email by clicking the link: ${confirmUrl}`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// Signup Controller
const signupUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await user.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    if (user) {
      // Send email confirmation link
      await sendConfirmationEmail(user);

      res.status(201).json({
        message:
          "User created successfully. Please check your email to confirm your account.",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signupUser,
};
