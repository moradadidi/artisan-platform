import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinaryConfig.js";
import Product from "../models/product.js";
import { verifyToken } from "../middleware/auth.js";

const productRouter = express.Router();

// ✅ Setup Multer for Cloudinary (Multiple Files Upload)
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage });

// ✅ GET all products
productRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find().populate("user");
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ GET a single product
productRouter.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("user");
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ CREATE a new product with multiple image uploads
productRouter.post("/", verifyToken, upload.array("images", 5), async (req, res) => {
    try {
        const { name, category, price, user, description, countInStock, rating } = req.body;

        if (!name || !category || !price || !user) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Get uploaded images
        const imageUrls = req.files.map(file => file.path);

        const product = new Product({
            name,
            category,
            price,
            user,
            images: imageUrls.length > 0 ? imageUrls : ["https://via.placeholder.com/150"],
            description: description || "No description provided",
            countInStock: countInStock || 0,
            rating: rating || 3,
            tags: req.body.tags ? req.body.tags.split(",") : [],
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ UPDATE a product (Supports Updating Multiple Images)
productRouter.put("/:id", verifyToken, upload.array("images", 5), async (req, res) => {
    try {
        let updatedData = { ...req.body };

        // If new images are uploaded, update the images field
        if (req.files.length > 0) {
            updatedData.images = req.files.map(file => file.path);
        }
        if (req.body.tags) {
            updatedData.tags = req.body.tags.split(",");
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
            runValidators: true,
        }).populate("user");

        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ DELETE a product
productRouter.delete("/:id", verifyToken, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ GET products by user
productRouter.get("/user/:userId", verifyToken, async (req, res) => {
    try {
        

        const products = await Product.find({ user: req.params.userId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default productRouter;
