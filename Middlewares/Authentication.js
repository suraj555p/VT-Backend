import jwt from "jsonwebtoken";
import { User } from "../Models/User.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","");

    console.log("Cookies:", token);


    if (!token) {
      return res.status(400).json({
        message: "Unauthorized request!",
      });
    }

    const decodedToken = jwt.verify(token, process.env.TOKEN);

    const user = await User.findById(decodedToken?.userId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid access token!",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token!",
    });
  }
};
