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
      text: `Welcome to Project X, Your Account has been created with Email: ${email} and Name: ${name}`,
    };

    await transporter.sendMail(emailOptions);

    //   Assig 🍪 with same time as thening user with cookies token i.e 5 days
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: `Successfully Signed up the User ✔️`,
    });
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

    return res.json({ success: true, message: "Successfully Logged In 👍" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Log Out user
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Successfully Logged Out 🤣" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    // Get the user ID and find user in database
    const { userId } = req.body;
    const user = await UserModel.findById(userId);

    // Check user exists
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Checking if users account is Verified
    if (user.isVerified) {
      return res.json({
        success: false,
        message: "Account is already verified ✔️",
      });
    }

    // Creating a six digit random otp and store it in users database
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000; //Means will expire in 5mins

    await user.save();

    // Sending Otp Through Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Account verification OTP`,
      text: `Your OTP is ${otp}. Verify your Account using this OTP . OTP will expire in 5 minutes`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: `OTP successfully sent to Email: ${user.email}`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
