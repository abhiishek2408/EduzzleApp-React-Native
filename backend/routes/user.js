import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
import User from "../models/User.js";

const router = express.Router();

// get profile (auth required)
router.get("/profile", authenticate, async (req, res) => {
  const u = req.user;
  res.json({ id: u._id, name: u.name, email: u.email, role: u.role, isVerified: u.isVerified });
});

// example admin-only route
router.get("/admin/users", authenticate, authorizeRoles("admin"), async (req, res) => {
  const users = await User.find().select("-password -otp -resetPasswordToken");
  res.json(users);
});

export default router;
