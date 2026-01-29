import jwt from "jsonwebtoken";
import { use } from "react";

const userAuth = async (req, res, next) => {
  try {
    // Get the users token from the cookies
    const { token } = req.cookies;

    if (!token) {
      return res.json({
        status: false,
        message: "Not authorised try login again ❌",
      });
    }

    //   Use the token to split with our secret string to get the users details i.e id
    const decodedToken = jwt.verify(token, process.env.SECRET_STR);

    if (!decodedToken.id) {
      return res.json({
        success: false,
        message: "Not authorised try login again ❌",
      });
    }

    //   Creating a req.body just incase it doesnt exist
    if (!req.body) req.body = {};

    //   Saving the userId to the req.body for future access
    req.body.userId = decodedToken.id;

    next();
  } catch (error) {
    return req.json({ success: false, message: error.message });
  }
};

export default userAuth;
