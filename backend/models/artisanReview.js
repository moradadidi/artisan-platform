// models/ArtisanReview.ts
import mongoose from "mongoose";

const artisanReviewSchema = new mongoose.Schema(
  {
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "Artisan" if you have a dedicated Artisan model
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const ArtisanReview = mongoose.model("ArtisanReview", artisanReviewSchema);
export default ArtisanReview;
