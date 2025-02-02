import express from "express";
import Product from "../models/product.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.post("/", async (req, res) => {
    try {
      console.log("Received Data:", req.body); // Debugging: Log the request body
  
      const { name, category, price, user } = req.body;
      if (!name || !category || !price || !user) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  

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

productRouter.put("/:id", async (req, res) => {
    const { name, image, category, description, price, countInStock, rating } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        product.name = name;
        product.image = image;
        product.category = category;
        product.description = description;
        product.price = price;
        product.countInStock = countInStock;
        product.rating = rating;
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

productRouter.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




export default productRouter;
