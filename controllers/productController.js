const Product = require("../models/product");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create a new product
exports.createProduct = [
  upload.single("imageSrc"),
  async (req, res) => {
    try {
      const {
        productName,
        description,
        costPerKg,
        productClass,
        numberOfProducts,
      } = req.body;

      const sellerId = req.user._id;

      const product = new Product({
        productName,
        description,
        costPerKg,
        productClass,
        numberOfProducts,
        sellerId, // Attach sellerId
        imageSrc: req.file ? req.file.path : null,
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

// Fetch all products
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

// Fetch product by ID
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

// Fetch products by sellerId
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

// Update product
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

// Delete product
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
