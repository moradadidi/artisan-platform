import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User, validateData } from "../models/user.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinaryConfig.js";
import transporter from "../config/email.js";

dotenv.config(); // Load .env variables

const userRouter = express.Router();

// Configure Cloudinary + Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilePictures",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// ------------------
// Route: Verify Email (GET)
// ------------------
userRouter.get("/verify-email/:token", async (req, res) => {
  try {
    const token = decodeURIComponent(req.params.token);
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }
    if (user.isVerified) {
      return res.redirect("http://localhost:5173/login?msg=Email+already+verified");
    }
    user.isVerified = true;
    await user.save();
    return res.redirect("http://localhost:5173/login?msg=Email+verified+successfully");
  } catch (error) {
    console.error("Email verification error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Server error verifying email" });
  }
});

// ------------------
// Route: Upload Profile Picture (POST)
// ------------------
userRouter.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ imageUrl: req.file.path });
});

// ------------------
// Route: Register User (POST)
// ------------------
userRouter.post("/", async (req, res) => {
  try {
    const { error } = validateData(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ error: "User with given email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create the user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      isAdmin: req.body.isAdmin || false,
      role: req.body.role || "user",
      profilePicture: req.body.profilePicture || "./default.png",
      isVerified: false,
    });
    const savedUser = await newUser.save();

    // Generate a JWT token valid for 1 day (for email verification)
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const encodedToken = encodeURIComponent(token);
    // Construct verification link
    const verificationUrl = `https://rarely.onrender.com/api/register/verify-email/${encodedToken}`;

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: savedUser.email,
      subject: "Please verify your email",
      html: `
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Verify Your Email</title>
            <style>
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #eaeaea;
                font-family: Arial, sans-serif;
                background-color: #fafafa;
                color: #333;
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
              }
              .btn {
                background-color: #28a745;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 20px;
                border-radius: 4px;
                display: inline-block;
                margin: 20px 0;
              }
              .footer {
                font-size: 0.9em;
                color: #777;
                text-align: center;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Hello ${savedUser.name},</h2>
              </div>
              <p>Thank you for registering! Please verify your email by clicking the link below:</p>
              <p><a href="${verificationUrl}" class="btn">Verify Email</a></p>
              <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
              <p><a href="${verificationUrl}">${verificationUrl}</a></p>
              <div class="footer">
                <p>This link will expire in 24 hours.</p>
                <p>Thank you, <br>The Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error in registration route:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ------------------
// Route: Forgot Password (POST)
// ------------------
userRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const user = await User.findOne({ email });
    // For security, always return success even if user is not found
    if (!user) {
      return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
    }
    // Generate a reset token valid for 1 hour
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const encodedResetToken = encodeURIComponent(resetToken);
    // This link is for GET route (see below) which redirects to your front-end form
    const resetUrl = `https://rarely.onrender.com/api/register/reset-password?token=${encodedResetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Reset Your Password</title>
            <style>
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #eaeaea;
                font-family: Arial, sans-serif;
                background-color: #fafafa;
                color: #333;
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
              }
              .btn {
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 20px;
                border-radius: 4px;
                display: inline-block;
                margin: 20px 0;
              }
              .footer {
                font-size: 0.9em;
                color: #777;
                text-align: center;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Password Reset</h2>
              </div>
              <p>You have requested to reset your password. Click the link below to reset your password:</p>
              <p><a href="${resetUrl}" class="btn">Reset Password</a></p>
              <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              <div class="footer">
                <p>This link will expire in 1 hour.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ error: "Server error processing password reset request" });
  }
});

// ------------------
// Route: Reset Password (GET) - Redirect to front-end form
// ------------------
userRouter.get("/reset-password", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send("Invalid or missing token.");
    }
    // Instead of showing an HTML form here, redirect to your front-end page
    // e.g. "http://localhost:5173/reset-password?token=..."
    return res.redirect(`http://localhost:5173/reset-password?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error("Reset password (GET) error:", error);
    return res.status(500).send("Server error");
  }
});

// ------------------
// Route: Reset Password (POST) - Actually update the password
// ------------------
userRouter.post("/reset-password", async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "Invalid token" });
    }
    // Hash the new password and update user
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Server error resetting password" });
  }
});

// ------------------
// Route: Update User (PUT /:id)
// ------------------
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

    if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;
    

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    if (req.file) {
      user.profilePicture = req.file.path;
    }

    const updatedUser = await user.save();
    return res.json(updatedUser);
  } catch (error) {
    console.error("User update error:", error);
    return res.status(500).json({ error: error.message });
  }
});

export default userRouter;
