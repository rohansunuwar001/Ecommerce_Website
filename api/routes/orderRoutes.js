import { Router } from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";
import { createOrder, deleteOrder, getAllOrders, getSingleOrder, myOrders, updateOrder } from "../controller/orderController.js";

const OrderRouter = Router();
OrderRouter.route("/order/new").post(isAuthenticated, createOrder);
OrderRouter.route("/order/:id").get(isAuthenticated,getSingleOrder);
OrderRouter.route("/orders/me").get(isAuthenticated,myOrders);
OrderRouter.route("/admin/orders").get(isAuthenticated,authorizeRoles("admin"),getAllOrders);
OrderRouter.route("/admin/order/:id").put(isAuthenticated,authorizeRoles("admin"),updateOrder).delete(isAuthenticated,authorizeRoles("admin"),deleteOrder);


export default OrderRouter;