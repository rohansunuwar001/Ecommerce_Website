import mongoose from "mongoose";
import validator from "validator";

let createUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false, // Ensures the password is not returned in queries
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Define allowed roles
        default: "user", // Default role is "user"
    },
    isVerification: {
        type: Boolean,
        default: false, // Default to unverified
        required: [true, "Verification is required"],
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
});

// Export the schema
export default  createUserSchema;
