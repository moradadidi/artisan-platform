import express from "express";
import { body, validationResult } from "express-validator";
import Review from "../models/review.js";

const reviewRouter = express.Router();

/** 
 * @route   GET /api/reviews
 * @desc    Get all reviews
 * @access  Public
 */
reviewRouter.get("/", async (req, res) => { 
    try {
        const reviews = await Review.find().populate("customerId").populate("productId");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

reviewRouter.post("/", async (req, res) => {
    try {
        const review = await Review.create(req.body);
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


reviewRouter.get("/:id", async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: "Review not found" });
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

reviewRouter.put("/:id", async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) return res.status(404).json({ error: "Review not found" });
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

reviewRouter.delete("/:id", async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ error: "Review not found" });
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

reviewRouter.get("/product/:productId", async (req, res) => {   
    try {
        const reviews = await Review.find({ productId: req.params.productId }).populate("customerId");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

reviewRouter.get("/artisan/:artisanId", async (req, res) => {   
    try {
        const reviews = await Review.find({ customerId: req.params.artisanId }).populate("customerId");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// router for artisan products reviews
reviewRouter.get("/artisan/:artisanId/products", async (req, res) => {
    try {
        const reviews = await Review.find().populate({
            path: "productId",
            match: { user: req.params.artisanId }
        }).populate("customerId");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default reviewRouter;