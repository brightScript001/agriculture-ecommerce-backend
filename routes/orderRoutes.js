const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  fetchOrders,
  fetchOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router();

router.get("/", authMiddleware, fetchOrders);
router.get("/:id", authMiddleware, fetchOrderById);
router.put("/:id", authMiddleware, updateOrderStatus);

module.exports = router;
