import Product, {
  find,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
} from "../models/product";
import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const createProduct = [
  upload.single("imageSrc"),
  async (req, res) => {
    try {
      console.log("Authenticated User:", req.user);
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

export async function getProducts(req, res) {
  try {
    const products = await find();
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
}

export async function getProductsById(req, res) {
  try {
    const { id } = req.params;
    const product = await findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: err.message });
  }
}

export async function getProductsBySeller(req, res) {
  try {
    const { _id: sellerId } = req.params;
    const products = await find({ sellerId });
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
}

export const updateProduct = [
  upload.single("imageSrc"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        imageSrc: req.file ? req.file.path : req.body.imageSrc,
      };

      const updatedProduct = await findByIdAndUpdate(id, updateData, {
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

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const deletedProduct = await findByIdAndDelete(id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete product", error: err.message });
  }
}
