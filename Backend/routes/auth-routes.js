import express from "express";
import {
  login,
  logout,
  register,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
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

// Verifying the Account
authRouter.post("/verify-account", verifyEmail);

// Sending Password Reset Otp
authRouter.post("/send-reset-password-otp", userAuth, sendResetOtp);

export default authRouter;
