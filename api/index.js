import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/connect.js";

import productRouter from "./routes/productRoutes.js";
import createUserRoutes from "./routes/userRoutes.js";
import { errorMiddleware } from "./middleware/error.js";

// Load environment variables
dotenv.config();

// Handle uncaught exceptions (e.g., synchronous code errors)
process.on("uncaughtException", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to an uncaught exception.");
    process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running smoothly!" });
});

// Routes
app.use('/login', createUserRoutes);
app.use('/product', productRouter);

// Error Middleware (should come last)
app.use(errorMiddleware);


// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error(`Error: ${err.message}`);
    console.error("Shutting down the server due to an unhandled promise rejection.");

    server.close(() => {
        process.exit(1);
    });
});

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
