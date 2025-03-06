import express from "express";
import { User } from "../models/user.js";
import Order from "../models/order.js"; 
import ArtisanReview from "../models/artisanReview.js";
const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user stats: completed orders, average rating, total sales
usersRouter.get("/stats/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Use the correct field "customerId" from Order schema
    const completedOrders = await Order.countDocuments({ customerId: userId, status: "pending" });

    // Average rating from reviews
    const reviews = await ArtisanReview.find({ artisanId: userId });
    const averageRating = reviews.length > 0 
      ? reviews.reduce((acc, review) => acc + review.rating, 0) 
      : 0;
    // Total sales: use "totalAmount" field from Order schema
    const totalSales = await Order.aggregate([
      { $match: { customerId: userId, status: "pending" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    
    res.json({
      completedOrders,
      averageRating: averageRating / reviews.length,
      totalSales: totalSales[0] ? totalSales[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default usersRouter;
