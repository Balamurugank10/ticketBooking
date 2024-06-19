import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from "./routes/user-routes";
import adminRouter from "./routes/admin-routes";
import movieRouter from "./routes/movie-routes";
import bookingsRouter from "./routes/booking-routes";

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};

// Use the CORS middleware with options
app.use(cors(corsOptions));

// Route middleware
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingsRouter);

// MongoDB connection
mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.iw5deb5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
)
.then(() => {
    app.listen(5000,"0.0.0.0", () => console.log("Connected to Database and server is running on port 5000"));
})
.catch((error) => {
    console.error("Error connecting to the database", error);
});
