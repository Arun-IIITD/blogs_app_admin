import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";

dotenv.config();

const app = express();

/* =========================
   MIDDLEWARES
========================= */
//https://blogs-app-admin.vercel.app/
const allowedOrigins = [
  "http://localhost:3000",
  "https://blogs-app-admin.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
  res.send("server started arun");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Servers running on port ${PORT}`);
});
