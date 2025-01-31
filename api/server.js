import dotenv from "dotenv";
import connectDB from "./database/connect.js";
import { port } from "./utils/constant.js";
import app from "./app.js"
import mongoose from "mongoose";


// Load environment variables
dotenv.config();

// Handle uncaught exceptions (e.g., synchronous code errors)
process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to an uncaught exception.");
    process.exit(1);
});


// Connect to the database
connectDB();

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running smoothly!" });
});


// Start the server
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to an unhandled promise rejection.");

    server.close(() => {
        process.exit(1);
    });
});

// Handle Mongoose connection errors
mongoose.connection.on("error", (err) => {
    console.error(`Mongoose Connection Error: ${err.message} `)
}
)

// Graceful Shutdown on SIGTERM
process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Closing server.");
    try {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (err) {
        console.error(`Error closing database: ${err.message}`);
    }
    server.close(() => {
        console.log("Server closed.");
        process.exit(0);
    });
});