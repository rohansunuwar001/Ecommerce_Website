import ErrorHandler from "../utils/errorhandler.js";

export const errorMiddleware = (err, req, res, next) => {
    // Default status code and message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Handle specific error types

    // Handle invalid MongoDB ObjectId
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map((value) => value.message)
            .join(", ");
        err = new ErrorHandler(message, 400);
    }

    // Add more specific error handlers as needed...

    // Send the error response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
