import express from "express";
import crypto from "crypto";
import validator from "validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import { createRateLimiter } from "../middlewares/rateLimiter.js";
import authenticate from "../middlewares/auth.js";

const router = express.Router();
const OTP_EXPIRES_MIN = Number(process.env.OTP_EXPIRES_MIN || 10);
const RESET_TOKEN_EXPIRES_MIN = Number(process.env.RESET_TOKEN_EXPIRES_MIN || 60);

// helper to create jwt
const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });


router.post("/register", createRateLimiter({ max: 6 }), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // --- validation, existing user check etc. ---

    // Generate OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // --- Create user instance ---
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "user",
      isVerified: false,
      otp: {
        code: crypto.createHash("sha256").update(rawOtp).digest("hex"),
        expiresAt: new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000),
      },
    });

    const html = `
      <p>Hello ${name},</p>
      <p>Your verification OTP is: <strong>${rawOtp}</strong></p>
      <p>It expires in ${OTP_EXPIRES_MIN} minutes.</p>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email - OTP",
        html,
      });
      console.log("✅ OTP email sent successfully to:", user.email);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    await user.save();
    return res.status(201).json({
      message: "Registered successfully. Check your email for OTP.",
      userId: user._id,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
});



router.post("/login", createRateLimiter({ max: 20 }), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

      console.log("🟢 User fetched from DB:", user); // debug
    console.log("🖼️ profilePic value:", user?.profilePic); // debug

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check if account is locked
    if (user.isLocked()) {
      return res.status(403).json({ message: "Account locked. Try again later." });
    }

    // check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 5) {
        // lock account for 15 minutes
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        user.failedLoginAttempts = 0;
      }

      await user.save();
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // require verified email
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please check your email for OTP." });
    }

    // reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // issue JWT token
    const token = signToken(user);

    // --- RETURN USER OBJECT HERE ---
    return res.json({ message: "Logged in successfully", token, role: user.role, user: {_id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic || null, subscription: user.subscription || null } });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
});


/**
 * Verify OTP
 */
router.post("/verify-otp", createRateLimiter({ max: 12 }), async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) return res.status(400).json({ message: "userId and otp required" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Invalid user" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });
    if (!user.otp || !user.otp.code) return res.status(400).json({ message: "OTP not found. Re-register or request new OTP." });

    if (user.otp.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    const hashed = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashed !== user.otp.code) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    // send back a token
    const token = signToken(user);
    return res.json({ message: "Email verified", token, role: user.role, user: {_id: user._id, name: user.name, email: user.email, role: user.role, profilePic: user.profilePic || null } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Resend OTP
 */
router.post("/resend-otp", createRateLimiter({ max: 6 }), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) return res.status(400).json({ message: "Valid email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "No account with that email" });
    if (user.isVerified) return res.status(400).json({ message: "Already verified" });

    const rawOtp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");
    user.otp = { code: hashedOtp, expiresAt: new Date(Date.now() + OTP_EXPIRES_MIN * 60 * 1000) };
    await user.save();

    const html = `<p>Your verification OTP: <strong>${rawOtp}</strong></p><p>It expires in ${OTP_EXPIRES_MIN} minutes.</p>`;
    await sendEmail({ to: user.email, subject: "Resent OTP", html });

    return res.json({ message: "OTP resent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});






/**
 * Forgot Password: create reset token and email link
 */
router.post("/forgot-password", createRateLimiter({ max: 6 }), async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !validator.isEmail(email)) return res.status(400).json({ message: "Valid email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "No account with that email" });

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_MIN * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}&id=${user._id}`;
    const html = `<p>To reset your password, click: <a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in ${RESET_TOKEN_EXPIRES_MIN} minutes.</p>`;
    await sendEmail({ to: user.email, subject: "Password reset", html });

    return res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * Reset password via token
 */
router.post("/reset-password", createRateLimiter({ max: 8 }), async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;
    if (!userId || !token || !newPassword) return res.status(400).json({ message: "Missing data" });

    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});



router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("subscription.planId", "name price durationInDays") // optional: populate plan details
      .select("-password -otp -resetPasswordToken -resetPasswordExpires -failedLoginAttempts -lockUntil");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (error) {
    console.error("❌ Error in /api/user/me:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
