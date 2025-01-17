const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  costPerKg: { type: Number, required: true },
  productClass: { type: String, required: true },
  numberOfProducts: { type: Number, required: true },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageSrc: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
