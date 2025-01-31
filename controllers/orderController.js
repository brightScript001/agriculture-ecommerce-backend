const mongoose = require("mongoose");
const Order = require("../models/order");

exports.fetchOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

exports.fetchOrderById = async (req, res) => {
  try {
    console.log("Received request params:", req.params);

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;
    order.updatedAt = Date.now();
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

exports.createOrder = async (req, res) => {
  const { customerName, orderDetails, shippingAddress, orderStatus } = req.body;

  try {
    if (!customerName || !orderDetails || !shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const totalOrderPrice = orderDetails.reduce(
      (sum, detail) => sum + detail.totalPrice,
      0
    );

    const newOrder = new Order({
      customerName,
      orderDetails,
      shippingAddress,
      orderStatus: orderStatus || "pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};
