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
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 
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
  res.send("server started");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
