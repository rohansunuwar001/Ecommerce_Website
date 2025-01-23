import { json } from "express";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.js";
import productRouter from "./routes/productRoutes.js";
import UserRouter from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import OrderRouter from "./routes/orderRoutes.js";

const app = express();
app.use(cors());
app.use(json());
app.use(cookieParser());

// Routes

app.use('/api/v1', productRouter);
app.use("/api/v1", UserRouter);
app.use("/api/v1",OrderRouter);


// MiddleWare for Errors
app.use(errorMiddleware);

export default app;
