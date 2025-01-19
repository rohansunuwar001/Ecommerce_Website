class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message); // Call the parent Error class constructor
        this.statusCode = statusCode; // Set the custom status code

        // Capture the stack trace for this error instance
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;
