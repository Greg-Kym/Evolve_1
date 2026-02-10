import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({
        success: false, // Changed 'status' to 'success' for consistency
        message: "Not authorised try login again ❌",
      });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_STR);

    if (!decodedToken.id) {
      return res.json({
        success: false,
        message: "Not authorised try login again ❌",
      });
    }

    // Attach userId directly to the request object
    req.body.userId = decodedToken.id;

    next();
  } catch (error) {
    // FIXED: Changed 'req.json' to 'res.json'
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;