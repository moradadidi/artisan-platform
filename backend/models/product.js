import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    images: {
      type: [String], // Now supports multiple image URLs
      default: ["https://via.placeholder.com/150"], // Default placeholder image
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      default: "No description provided",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    countInStock: {
      type: Number,
      default: 0,
      min: [0, "Stock count cannot be negative"],
    },
    rating: {
      type: Number,
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
      default: 3,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: [0, "Number of reviews cannot be negative"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
