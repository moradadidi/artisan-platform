import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi"; // Added missing import

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    profilePicture : {
        type: String ,
        required: false
    },
    phoneNumber : {
        type: String,
        required: false
    }, 
    address : {
        type: String,
        required: false
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
});

// Method to generate authentication token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual field for 'id'
userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

const User = mongoose.model("User", userSchema);

// Validation function
const validateData = (data) => {
    const schema = Joi.object({
        name: Joi.string().required().label("User Name"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
        isAdmin: Joi.boolean().default(false)
    });
    return schema.validate(data);
};

// Use ES module export
export { User, validateData };
