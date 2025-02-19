import express from "express";
import { body, validationResult } from "express-validator";
import Cart from "../models/cart.js";

const cartRouter = express.Router();

cartRouter.get("/user/:userId", async (req, res) => {
    try {
    const cart = await Cart.find({ customerId: req.params.userId })
                    .populate({
                        path: "products.productId",
                        populate: {
                            path: "user",
                            model: "User"
                        }
                    })
                    .populate("customerId");
      console.log(cart);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found", customerId: req.params.userId });
      }
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// GET all carts
cartRouter.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET cart by id
cartRouter.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create a new cart
cartRouter.post(
    "/",
    // Validate the request body to match our new schema
    body("customerId").notEmpty().withMessage("customerId is required"),
    body("products").isArray({ min: 1 }).withMessage("products must be a non-empty array"),
    body("products.*.productId")
      .notEmpty()
      .withMessage("productId is required for each product"),
    body("products.*.quantity")
      .isNumeric()
      .withMessage("quantity must be numeric"),
    body("totalAmount").isNumeric().withMessage("totalAmount must be numeric"),
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const { customerId, products, totalAmount } = req.body;
  
        // Check if a cart already exists for this customer
        let cart = await Cart.findOne({ customerId });
  
        if (cart) {
          // Merge products: if product exists, increment its quantity; otherwise, add it
          products.forEach((newProduct) => {
            const index = cart.products.findIndex(
              (p) => p.productId.toString() === newProduct.productId
            );
            if (index > -1) {
              // Increment by newProduct.quantity (defaults to 1 if not provided)
              cart.products[index].quantity += newProduct.quantity || 1;
            } else {
              cart.products.push(newProduct);
            }
          });
  
          // Update totalAmount by adding the new total to the existing total
          cart.totalAmount += totalAmount;
          cart = await cart.save();
        } else {
          // If no cart exists, create a new one using the provided data
          cart = await Cart.create({ customerId, products, totalAmount });
        }
        res.status(201).json(cart);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );

// PUT update a cart by id
cartRouter.put("/:id", async (req, res) => {
  try {
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.patch("/:cartId/product/:productId" , async (req, res) => {
    try { 
        const { cartId, productId } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cartId).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        const product = cart.products.find(p => p.productId._id.toString() === productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found in cart" });
        }
        product.quantity = quantity;
        cart.totalAmount = cart.products.reduce((total, p) => total + p.quantity * p.productId.price, 0);
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
// DELETE a cart by id
// DELETE a product from a cart by cartId and productId
cartRouter.delete("/:cartId/product/:productId", async (req, res) => {
    try {
      const { cartId, productId } = req.params;
      
      // Find the cart by ID
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
      
      // Filter out the product that needs to be removed
      const initialLength = cart.products.length;
      cart.products = cart.products.filter(
        (p) => p.productId.toString() !== productId
      );
      
      if (cart.products.length === initialLength) {
        return res.status(404).json({ error: "Product not found in cart" });
      }
      
      // update totalAmount
      cart.totalAmount -= cart.products
        .filter((p) => p.productId.toString() !== productId)
        .reduce((total, p) => total + p.quantity * p.productId.price, 0);
      
      const updatedCart = await cart.save();
      res.json({ message: "Product removed successfully", cart: updatedCart });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  cartRouter.get("/count/:customerId" , async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.params.customerId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        const totalItems = cart.products.length;
        res.json( totalItems );
    } catch (error) {
      res.status(500).json({ error: error.message });    
    }
    });

export default cartRouter;
