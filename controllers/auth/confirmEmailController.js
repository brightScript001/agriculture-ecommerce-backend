const crypto = require("crypto");
const User = require("../../models/user");

const confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Hash the token from the request
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by hashed token and check if it matches and is not expired
    const existingUser = await User.findOne({
      emailConfirmedToken: hashedToken,
      emailConfirmedTokenExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Confirm the user's email
    existingUser.emailConfirmed = true;
    existingUser.emailConfirmedToken = undefined; // Remove the token
    existingUser.emailConfirmedTokenExpires = undefined; // Remove the expiry field
    await existingUser.save();

    res.status(200).json({ message: "Email successfully confirmed" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "An error occurred while confirming email" });
  }
};

module.exports = { confirmEmail };
