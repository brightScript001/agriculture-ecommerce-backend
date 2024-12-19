const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    imageSrc: { type: String, required: true },
    discount: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    quantityLeft: { type: Number, required: true },
    description: { type: String },
    rating: { type: Number, default: 0 },
    location: { type: String },
    quantity: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
