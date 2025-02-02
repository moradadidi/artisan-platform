import express from "express";
import { User } from "../models/user.js";

const usersRouter = express.Router();   


usersRouter.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default usersRouter;