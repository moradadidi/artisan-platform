// verifyRouter.js
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

const verifyRouter = express.Router();

verifyRouter.get("/", async (req, res) => {
  try {
    const { token } = req.query;  // use a query parameter
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
    // Verify token using JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }
    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified." });
    }
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Email verification error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Server error verifying email" });
  }
});

export default verifyRouter;
