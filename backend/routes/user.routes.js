import {Router } from 'express';
import { registerUser,loginUser, getProfile, logoutUser } from '../controllers/user.controller.js';
import { validateRegister, validateLogin } from '../middlewares/validateUser.middleware.js';
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.get("/profile", verifyJWT, getProfile);
router.post("/logout",logoutUser);



export default router

