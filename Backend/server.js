import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth-routes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Setting up our Database connection 😍
const ConnectDb = async () => {
  mongoose.connection.on("connected", () =>
    console.log("Database Connected 👍"),
  );
  await mongoose.connect(`${process.env.MONGO_URL}`);
};

await ConnectDb();

// const allowedOrigins = [""];

app.use(express.json());
app.use(cookieParser());
// app.use(cors({origin: allowedOrigins, credentials: True}));

// API endpoint
app.use("/api/authentication", authRouter);

app.listen(PORT, () => console.log(`Server has started on PORT: ${PORT}🔦`));
