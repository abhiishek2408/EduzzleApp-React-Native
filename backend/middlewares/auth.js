import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password -otp -resetPasswordToken");
    if (!user) {
      return res.status(403).json({ message: "User not found or unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Auth Error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;



