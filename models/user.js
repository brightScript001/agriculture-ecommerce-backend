const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
  },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["buyer", "seller"], required: true },
  emailConfirmed: { type: Boolean, default: false },
  emailConfirmedToken: { type: String },
  emailConfirmedTokenExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate email confirmation token
userSchema.methods.generateEmailConfirmToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.emailConfirmedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.emailConfirmedTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24-hour expiry
  return token;
};

// Generate a new verification token for resending email
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24-hour expiry
  return token;
};

module.exports = mongoose.model("User", userSchema);
