import Order from "../model/orderModel.js";
import createProductModel from "../model/productModel.js";
import ErrorHandler from "../utils/errorhandler.js";

export const createOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        const order = await Order.create(
            {
                shippingInfo,
                orderItems,
                paymentInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paidAt: Date.now(),
                user: req.user._id
            }
        );

        res.status(200).json({
            success: true,
            message: "Order Placed Successfully",
            order
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
}
// Get Single order
export let getSingleOrder = async (req, res, next) => {
    try {
        // Fetch the order and populate user details
        const order = await Order.findById(req.params.id).populate("user", "name email");

        // Check if the order exists
        if (!order) {
            return next(new ErrorHandler("Order not found with this id", 404));
        }

        res.status(200).json({
            success: true,
            message: "Order found successfully",
            order,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
};

// get logged in user orders
export let myOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({
            success: true,
            message: "Your Order found Successfully",
            orders
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
}

// gets all order -admin

export let getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find();

        let totalAmount = 0;
        // for total amount of order
        orders.forEach((order) => {
            totalAmount += order.totalPrice;
        }
        )

        res.status(200).json({
            success: true,
            message: "All order found successfully",
            orders, totalAmount
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
}

// update order status
export let updateOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order.orderStatus === "Delivered") {
            return next(new ErrorHandler("You have already delivered this order", 200));
        }

        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        }
        )

        if (req.body.orderStatus === "Delivered") {
            order.deliveredAt = Date.now();
        }
        await Order.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            userFindAndModify: false
          });
        res.status(200).json({
            success: true,
            message: "Order Update Successfully",
            order
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
}
// update stock function
async function updateStock(id, quantity) {
    const product = await createProductModel.findById(id);
    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
}




// delete order

export let deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return next(new ErrorHandler("Order not found with this Id", 404));
        }
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Order remove Successfully"
        })
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
}
