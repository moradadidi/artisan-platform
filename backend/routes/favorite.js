import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinaryConfig.js";
import Favorite from "../models/favorite.js";
import { verifyToken } from "../middleware/auth.js";

const favoriteRouter = express.Router();

favoriteRouter.get("/:userId", verifyToken, async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.params.userId }).populate({
            path: "product",
            populate: {
            path: "user",
            model: "User"
            }
        });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

favoriteRouter.post("/", verifyToken, async (req, res) => {
    try {
        const { product } = req.body;

        if (!product) {
            return res.status(400).json({ error: "Product is required" });
        }

        const favorite = new Favorite({
            user: req.user._id,
            product,
        });

        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


favoriteRouter.delete("/:id", verifyToken, async (req, res) => {
    try {
        const favorite = await Favorite.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!favorite) {
            return res.status(404).json({ error: "Favorite not found" });
        }
        res.json(favorite);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default favoriteRouter;