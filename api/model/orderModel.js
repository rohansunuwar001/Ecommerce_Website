import mongoose from "mongoose";
import orderSchema from "../schema/orderSchema.js";

const Order = mongoose.model("OrderDetails",orderSchema);

export default Order;