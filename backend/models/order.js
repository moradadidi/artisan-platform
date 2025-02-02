import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: function () {
        return `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      }, // Auto-generate unique order numbers
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer ID is required"],
      index: true, // Index for faster queries
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Price is required"],
          min: [0, "Price must be a positive number"],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount must be positive"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "shipped", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// **Middleware to auto-calculate totalAmount before saving**
orderSchema.pre("save", function (next) {
  this.totalAmount = this.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
