import mongoose from "mongoose";
import createUserSchema from "../schema/userdata.js";

let createUserModel = mongoose.model("userModel",createUserSchema);

export default createUserModel;