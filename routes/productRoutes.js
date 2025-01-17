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
router.get("/products", getProducts);
router.get("/products/:id", getProductsById);
router.get("/products/seller/:_id", getProductsBySeller);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
module.exports = router;
