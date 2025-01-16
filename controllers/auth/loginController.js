const User = require("../../models/user");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Login Controller
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if the user exists and if the role matches
    if (!user || user.role !== role) {
      return res
        .status(404)
        .json({ message: "User not found or role mismatch" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Return the response with the user details and JWT token
    res.status(200).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user.id, user.role), // Send the role in the token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = loginUser;
