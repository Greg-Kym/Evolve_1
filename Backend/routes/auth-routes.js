import express from "express";
import {
  login,
  logout,
  register,
  sendVerifyOtp,
} from "../controllers/auth-controllers.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

// Sign Up User
authRouter.post("/register", register);

// Sign in User
authRouter.post("/login", login);

// Log Out user
authRouter.post("/logout", logout);

// Sending the OTP to the users Email
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);

export default authRouter;
