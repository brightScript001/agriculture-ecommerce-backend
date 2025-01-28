const mongoose = require("mongoose");

const orderDetailScheme = new mongoose.Schema({
  item: { type: String, required: true },
  quantityInKg: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  orderId: { type: String, required: true },
  orderDetails: { type: [orderDetailScheme], required: true },
  shippingAddress: { type: String, required: true },
  dateOfOrder: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    enum: [
      "pending",
      "approved",
      "disputed",
      "shipped",
      "delivered",
      "settled",
    ],
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
