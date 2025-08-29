// routes/attemptRoutes.js
import express from "express";
import UserAttempt from "../models/UserAttempt.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// ✅ Get user stats
router.get("/my-stats", authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all attempts for this user
    const attempts = await UserAttempt.find({ userId });

    // Count attempts
    const attemptCount = attempts.length;

    // Sum scores
    const totalPoints = attempts.reduce((sum, att) => sum + (att.score || 0), 0);

    // Find highest level passed (if you want rank logic)
    let highestLevel = "None";
    attempts.forEach((att) => {
      att.levelWise?.forEach((lvl) => {
        if (lvl.passed) highestLevel = lvl.levelName;
      });
    });

    res.json({
      success: true,
      attemptCount,
      totalPoints,
      highestLevel,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

export default router;
