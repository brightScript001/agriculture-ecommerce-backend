const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("AuthHeader:", authHeader);

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No token provided. Authorization denied." });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Malformed token. Authorization denied." });
  }
  console.log("Token:", token);
  try {
    const decoded = jwt.verify(`${token}`, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    console.error("Error verifying token:", err.message);
    res.status(401).json({ message: "Token is invalid or expired." });
  }
};

module.exports = authMiddleware;
