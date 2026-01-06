import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
  
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Access token missing");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decoded._id).select("-password"); 

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

  req.user = user;

  next();

  } catch (error) {
    // Catch JWT errors and rethrow as ApiError
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Token expired"));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token"));
    }

    next(error);
  }
};

// middleware/authMiddleware.js
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

