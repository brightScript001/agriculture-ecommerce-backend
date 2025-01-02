const crypto = require("crypto");
const user = require("../../models/user");

const confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Hash the token from the request
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by hashed token and check if it matches
    const user = await user.findOne({
      emailConfirmedToken: hashedToken,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Confirm the user's email
    user.emailConfirmed = true;
    user.emailConfirmedToken = undefined; // Remove the token
    await user.save();

    res.status(200).json({ message: "Email successfully confirmed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { confirmEmail };
