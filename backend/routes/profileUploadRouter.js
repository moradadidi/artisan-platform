import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinaryConfig.js";
import { User } from "../models/user.js";

const router = express.Router();

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilePictures", // Folder where profile pictures will be stored
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

router.post("/:id", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Update user's profile picture URL
    user.profilePicture = req.file.path;
    await user.save();

    res.json({ message: "Profile picture updated successfully", imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
