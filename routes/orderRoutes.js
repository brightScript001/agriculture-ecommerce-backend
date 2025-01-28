const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  fetchOrders,
  fetchOrderById,
  updateOrderStatus,
  createOrder,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, fetchOrders);
router.get("/:id", authMiddleware, fetchOrderById);
router.put("/:id", authMiddleware, updateOrderStatus);

module.exports = router;
