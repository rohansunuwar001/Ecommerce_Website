import ErrorHandler from "../utils/errorhandler.js";

export const errorMiddleware = (err, req, res, next) => {
    // Default status code and message
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Modular error handlers
    handleSpecificErrors(err);

    // Send the error response
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

// Separate function to handle specific errors
const handleSpecificErrors = (err) => {
    switch (err.name) {
        case "CastError":
            handleCastError(err);
            break;

        case "ValidationError":
            handleValidationError(err);
            break;

        // Add other specific error handlers here as needed...
    }
};

// Handle invalid MongoDB ObjectId
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}. Resource not found.`;
    err.message = message;
    err.statusCode = 400;
};

// Handle Mongoose validation errors
const handleValidationError = (err) => {
    const message = Object.values(err.errors)
        .map((value) => value.message)
        .join(", ");
    err.message = message;
    err.statusCode = 400;
};
