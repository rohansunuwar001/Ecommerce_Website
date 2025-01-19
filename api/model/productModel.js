import mongoose from "mongoose";
import productSchema from "../schema/productSchema.js";

const createProductModel = mongoose.model("productModel",productSchema);
export default createProductModel;