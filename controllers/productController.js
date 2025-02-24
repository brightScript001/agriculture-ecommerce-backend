const Product = require("../models/product");
const multer = require("multer");

const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.createProduct = [
  upload.single("imageSrc"),
  async (req, res) => {
    try {
      console.log("Received file:", req.file);
      const {
        productName,
        description,
        costPerKg,
        productClass,
        numberOfProducts,
      } = req.body;

      const sellerId = req.user.id;
      const product = new Product({
        productName,
        description,
        costPerKg,
        productClass,
        numberOfProducts,
        sellerId,
        imageSrc: req.file.path,
      });

      const savedProduct = await product.save();
      res.status(201).json(savedProduct);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to create product", error: err.message });
    }
  },
];

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

exports.getProductsById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: err.message });
  }
};

exports.getProductsBySeller = async (req, res) => {
  try {
    const { _id: sellerId } = req.params;
    const products = await Product.find({ sellerId });
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

exports.updateProduct = [
  upload.single("imageSrc"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        imageSrc: req.file ? req.file.path : req.body.imageSrc,
      };

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });

      res.json(updatedProduct);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Failed to update product", error: err.message });
    }
  },
];

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
};

exports.getProductByClass = async (req, res) => {
  try {
    const { productClass } = req.params;

    if (!productClass) {
      return res.status(400).json({ message: "Product class is required" });
    }
    const products = await Product.find({ productClass });

    if (!products.length) {
      return res
        .status(404)
        .json({ message: `No products found for ${productClass}` });
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed  to fetch products", error: error.message });
  }
};
