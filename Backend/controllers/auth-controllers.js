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

    //   Assign 🍪 with same time as thening user with cookies token i.e 5 days
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: `Successfully Signed up the User ✔️`,
      name: name,
      userId: user._id
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
    return res.json({
      success: true,
      message: "Successfully Logged In 👍",
      name: user.name,
      isVerified: user.isVerified
    });
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

//Sending OTP for Account Verification
export const sendVerifyOtp = async (req, res) => {
  try {
    // Get the user ID and find user in database
    const { userId } = req.body;
    const user = await UserModel.findById(userId);

    // Check user exists
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // if (otp === '123456') {
    //   user.isVerified = true;
    //   user.verifyOtp = "";
    //   user.verifyOtpExpireAt = 0;
    //   await user.save();
    //   return res.json({ success: true, message: "Account verified via bypass" });
    // }


    // // Check if OTP matches (the original logic continues below)
    // if (user.verifyOtp == "" || user.verifyOtp !== otp) {
    //   return res.json({ success: false, message: "Invalid OTP ❌" });
    // }



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

// Verifying the Users Email with the sent OTP
export const verifyEmail = async (req, res) => {
  try {
    // Getting the userId and otp
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details 😤" });
    }

    // Get the user from Database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found ❌" });
    }

    // Check if OTP matches
    if (user.verifyOtp == "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP ❌" });
    }

    // Check if OTP has expired
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "Otp Has Already Expired ❌",
      });
    }

    // Verify the Account and reset the respective details
    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Account successfully verified",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Sending OTP for password reset
export const sendResetOtp = async (req, res) => {
  try {
    // Get Users email from browser
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    // Get the User Based on the Email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: `User with email ${email} not found ❌`,
      });
    }

    // Creating the 6-digit otp and storing in database
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    // Sending OTP thro Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset Otp",
      text: `Your OTP for Resetting your password is ${otp}. Use this Otp to proceed with resetting your password, Otp will expire in 5 minutes`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Otp successfully sent to Email 😊",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Resetting the Users password
export const passwordReset = async (req, res) => {
  try {
    // Getting the email otp and new password from the browser
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "Missing Details 😤" });
    }

    // Fetching user from Database
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Checking Otp correctness
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid Otp" });
    }

    // Checking Otp Expiring date
    if (user.resetOtpExpiredAt < Date.now()) {
      return res.json({ success: false, message: "Otp expired" });
    }

    // hashing and salting the new Password and saving to Database and resetting to default the corresponding elements
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Password Reset Success 👍" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
