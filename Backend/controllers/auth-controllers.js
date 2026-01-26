import mongoose from "mongoose";
import UserModel from "../models/user-model.js";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import bcrypt from "bcrypt";

// Register User With send Welcome Email
export const register = async (req, res) => {
  try {
    // Get name email and password from the browser body
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    //   Hashing and Salting the password so that we and hackers like Anderson and Victor dont see it 🔐
    const hashedPassword = await bcrypt.hash(password, 10);

    //   Saving the user in our MongoDb Database
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    //   Generating a token for the user for access for 5 days😍
    const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, {
      expiresIn: "5d",
    });

    //   Sending a Warm Welcome Email to the users email ❤️
    const emailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Welcome To Project X 1st Project`,
      text: `Welcom to Project X, Your Account has been created with Email: ${email} and Name: ${name}`,
    };

    await transporter.sendMail(emailOptions);

    //   Assigning user with cookies 🍪 with same time as the token i.e 5 days
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: `Successfully Signed up the User ✔️` });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    // Getting the email and password from the browser
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password are required 😂",
      });
    }

    // Get user from our DataBase by the given email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User Not found Please Sign Up 😊",
      });
    }

    // Comparing Users Password With Database password if is True 🔐
    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
      return res.json({ success: false, message: "Incorrect Password 😤" });
    }

    // Providing a Token and Cookie 🍪 for 5 days access ✔️
    const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, {
      expiresIn: "5d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Successfully Logged In 👍" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
