import express from "express";
import bcrypt from "bcryptjs";
import { User, validateData } from "../models/user.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinaryConfig.js";
const userRouter = express.Router();


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "profilePictures", // Folder where profile pictures will be stored
      allowed_formats: ["jpg", "png", "jpeg"],
    },
  });
  
  const upload = multer({ storage });
  
  userRouter.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ imageUrl: req.file.path }); // Cloudinary returns the image URL
  });

  
// Register a new user
userRouter.post("/", async (req, res) => {
    try {
        // Validate request data
        const { error } = validateData(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).json({ error: "User with given email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: req.body.isAdmin || false,
            role: req.body.role || "user",
            profilePicture: req.body.profilePicture || "./default.png",
        });

        // Save user to database
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.put("/:id", upload.single("profilePicture"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    if (req.body.address) user.address = req.body.address;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.role) user.role = req.body.role;
    if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    if (req.file) {
      user.profilePicture = req.file.path;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default userRouter;
