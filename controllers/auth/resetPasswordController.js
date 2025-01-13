const crypto = require("crypto");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with the matching token and check if the token has expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure the token has not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear reset token after successful reset
    user.resetPasswordExpires = undefined; // Clear expiration time

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPasswordController:", error);
    res.status(500).json({
      message:
        "An error occurred while resetting the password. Please try again.",
    });
  }
};

module.exports = resetPasswordController;
