import express from "express";
import Joi from "joi";
import { User } from "../models/user.js";

const authRouter = express.Router();



// User login route
authRouter.post("/", async (req, res) => {
    try {
        // Validate request data
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: "User with given email does not exist" });
        }

        // Check if password is correct
        const validPassword = await user.matchPassword(req.body.password);
        if (!validPassword) {   
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate auth token
        const token = user.generateAuthToken();
        res.status(200).json({ token: token, message: "Logged in successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Validation function
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(data);
};

export default authRouter;
