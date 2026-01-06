import { ApiError } from "../utils/ApiError.js";

export const validateRegister = (req,res,next) => {

    const {name, email, password} = req.body;

    if (!name || !email || !password) {
    throw new ApiError(400, "All fieldddds are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  req.body.name = name;
  req.body.email = email;
  req.body.password = password;

next();

};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  req.body.email = email.trim().toLowerCase();
  next();
};


