const express = require("express");
const {
  createProduct,
  getProducts,
  getProductsById,
  getProductsBySeller,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const router = express.Router();

router.post("/products", createProduct);
router.get("/products", getProducts);
router.get("/products/:id", getProductsById);
router.get("/products/seller/:sellerId", getProductsBySeller);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
module.exports = router;
