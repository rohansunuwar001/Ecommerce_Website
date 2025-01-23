import mongoose from "mongoose";
import productSchema from "../schema/productSchema.js";

const createProductModel = mongoose.model("products",productSchema);
export default createProductModel;