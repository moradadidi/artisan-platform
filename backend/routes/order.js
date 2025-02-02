import express from "express";
import { body, validationResult } from "express-validator";
import Order from "../models/order.js";

const orderRouter = express.Router();

/**
 * @route   GET /api/orders
 * @desc    Get all orders with optional filtering and pagination
 * @access  Public
 */
orderRouter.get("/", async (req, res) => {
    try {
        const { status, customerId, page = 1, limit = 10 } = req.query;
        const filter = {};
        
        if (status) filter.status = status;
        if (customerId) filter.customerId = customerId;

        const orders = await Order.find(filter)
            .populate("customerId", "name email")  // Populate user details
            .populate("products.productId", "name price")  // Populate product details
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ orderDate: -1 });

        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get a single order by ID
 * @access  Public
 */
orderRouter.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customerId", "name email")
            .populate("products.productId", "name price");

        if (!order) return res.status(404).json({ success: false, error: "Order not found" });

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Public
 */
orderRouter.post(
    "/",
    [
        body("customerId").notEmpty().withMessage("Customer ID is required"),
        body("products").isArray({ min: 1 }).withMessage("At least one product is required"),
        body("products.*.productId").notEmpty().withMessage("Product ID is required"),
        body("products.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
        body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const { customerId, products, shippingAddress } = req.body;
            
            // Calculate totalAmount dynamically
            const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const order = new Order({
                customerId,
                products,
                totalAmount,
                shippingAddress,
            });

            await order.save();
            res.status(201).json({ success: true, order });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

/**
 * @route   PUT /api/orders/:id
 * @desc    Update an order
 * @access  Public
 */
orderRouter.put(
    "/:id",
    [
        body("products").optional().isArray({ min: 1 }).withMessage("At least one product is required"),
        body("products.*.productId").optional().notEmpty().withMessage("Product ID is required"),
        body("products.*.quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
        body("status").optional().isIn(["pending", "completed", "shipped", "cancelled"]).withMessage("Invalid status"),
        body("paymentStatus").optional().isIn(["paid", "pending", "failed"]).withMessage("Invalid payment status"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const order = await Order.findById(req.params.id);
            if (!order) return res.status(404).json({ success: false, error: "Order not found" });

            const { products, status, paymentStatus, shippingAddress } = req.body;

            if (products) {
                order.products = products;
                order.totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
            }
            if (status) order.status = status;
            if (paymentStatus) order.paymentStatus = paymentStatus;
            if (shippingAddress) order.shippingAddress = shippingAddress;

            await order.save();
            res.json({ success: true, order });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Delete an order
 * @access  Public
 */
orderRouter.delete("/:id", async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, error: "Order not found" });

        res.json({ success: true, message: "Order deleted successfully", order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default orderRouter;
