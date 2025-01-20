const express = require("express");
const {
  createProduct,
  getProducts,
  getProductsById,
  getProductsBySeller,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductsById);
router.get("/seller/:_id", getProductsBySeller);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
module.exports = router;
