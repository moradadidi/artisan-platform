import express from "express";
import Product from "../models/product.js";
import { verifyToken } from "../middleware/auth.js";
const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products); // Returns an array
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ POST create a new product
productRouter.post("/", verifyToken, async (req, res) => {
    try {
        const { name, category, price, user, image, description, countInStock, rating } = req.body;
        if (!name || !category || !price || !user) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const product = new Product({
            name,
            category,
            price,
            user,
            image: image || "https://via.placeholder.com/150",
            description: description || "No description provided",
            countInStock: countInStock || 0,
            rating: rating || 3
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ GET product by ID
productRouter.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ PUT update a product
productRouter.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
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


productRouter.get("/user/:userId", verifyToken, async (req, res) => {
    try {
        if (req.user._id !== req.params.userId && !req.user.isAdmin) {
            return res.status(403).json({ message: "Access Denied" });
        }

        const products = await Product.find({ user: req.params.userId });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default productRouter;
