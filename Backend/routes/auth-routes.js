import express from "express";
import { login, register } from "../controllers/auth-controllers.js";

const authRouter = express.Router();

// Sign Up User
authRouter.post("/register", register);

// Sign in User
authRouter.post("/login", login);

export default authRouter;
