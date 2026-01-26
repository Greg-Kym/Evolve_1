import express from "express";
import { login, logout, register } from "../controllers/auth-controllers.js";

const authRouter = express.Router();

// Sign Up User
authRouter.post("/register", register);

// Sign in User
authRouter.post("/login", login);

// Log Out user
authRouter.post("/logout", logout);

export default authRouter;
