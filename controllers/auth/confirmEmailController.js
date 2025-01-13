const crypto = require("crypto");
const User = require("../../models/user");

const confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const existingUser = await User.findOne({
      emailConfirmedToken: hashedToken,
      emailConfirmedTokenExpires: { $gt: Date.now() },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    existingUser.emailConfirmed = true;
    existingUser.emailConfirmedToken = undefined;
    existingUser.emailConfirmedTokenExpires = undefined;
    await existingUser.save();

    res.status(200).json({ message: "Email successfully confirmed" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while confirming email" });
  }
};

module.exports = { confirmEmail };
