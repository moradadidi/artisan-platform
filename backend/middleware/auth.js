// middleware/auth.js
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token to the request object
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};
