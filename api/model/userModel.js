import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import createUserSchema from "../schema/userdata.js";
import { secretKey } from "../utils/constant.js";

createUserSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})

// JWT TOKEN
createUserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, secretKey, {
        expiresIn: "2d"
    });
};

// Compare Password

createUserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


// Generating Password Reset Token

createUserSchema.methods.getResetPasswordToken = function () {
    // Generate a random token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash the token and set it to resetPasswordToken field in the schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set the token expiry time to 15 minutes from now
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    // Return the plain token (not hashed) to the user for use in the reset link
    return resetToken;
};


const createUserModel = mongoose.model("User", createUserSchema);

export default createUserModel;