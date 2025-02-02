import express from "express";
import bcrypt from "bcryptjs";
import { User, validateData } from "../models/user.js";

const userRouter = express.Router();

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
        });

        // Save user to database
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default userRouter;
