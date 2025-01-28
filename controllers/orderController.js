import { find, findById } from "../models/order";

export async function fetchOrders(req, res) {
  try {
    const orders = await find()
      .populated("user")
      .populate("products.productId");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
}

export async function fetchOrderById(req, res) {
  try {
    const order = await findById(req.params.id)
      .populate("user")
      .populate("products.productId");
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  try {
    const order = await findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    order.updateAt = Date.now();
    await order.save();

    res
      .status(200)
      .json({ success: true, message: " Order status updated", data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
}
