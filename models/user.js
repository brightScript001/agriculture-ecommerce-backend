const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); // for generating token

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["buyer", "seller"], required: true },
  emailConfirmed: { type: Boolean, default: false },
  emailConfirmedToken: { type: String },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Generate email confirmation token
userSchema.methods.generateEmailConfirmToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
};

// hash and store token
this.emailConfirmedToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
return token;

module.exports = mongoose.model("User", userSchema);
