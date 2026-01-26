import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 4000;

// Setting up our Database connection 😍
const ConnectDb = async () => {
  mongoose.connection.on("connected", () =>
    console.log("Database Connected 👍"),
  );
  await mongoose.connect(`${process.env.MONGO_URL}/projectX-1`);
};

await ConnectDb();

// const allowedOrigins = [""];

app.use(express.json());
app.use(cookieParser());
// app.use(cors({origin: allowedOrigins, credentials: True}));

app.listen(PORT, () => console.log(`Server has started on PORT: ${PORT}🔦`));
