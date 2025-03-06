import express from "express";
import ArtisanReview from "../models/artisanReview.js";
const artisanReviewRouter = express.Router();

// GET all artisan reviews
artisanReviewRouter.get("/", async (req, res) => {
  try {
    const reviews = await ArtisanReview.find()
      .populate("customerId")
      .populate("artisanId");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new artisan review
artisanReviewRouter.post("/", async (req, res) => {
  try {
    const review = await ArtisanReview.create(req.body);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET a single artisan review by its ID
artisanReviewRouter.get("/:id", async (req, res) => {
  try {
    const review = await ArtisanReview.findById(req.params.id)
      .populate("customerId")
      .populate("artisanId");
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT (update) an artisan review by its ID
artisanReviewRouter.put("/:id", async (req, res) => {
  try {
    const review = await ArtisanReview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE an artisan review by its ID
artisanReviewRouter.delete("/:id", async (req, res) => {
  try {
    const review = await ArtisanReview.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all reviews for a specific artisan by artisanId
artisanReviewRouter.get("/artisan/:artisanId", async (req, res) => {
  try {
    const reviews = await ArtisanReview.find({ artisanId: req.params.artisanId })
      .populate("customerId");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default artisanReviewRouter;
