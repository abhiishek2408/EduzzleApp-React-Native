// routes/streakRoutes.js
import express from "express";
import Streak from "../models/Streak.js";
import User from "../models/User.js";

const router = express.Router();

// Get user's current streak
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let streak = await Streak.findOne({ userId });
    
    if (!streak) {
      streak = await Streak.create({ userId });
    }
    
    res.json({
      success: true,
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastCompletedDate: streak.lastCompletedDate,
        milestonesAchieved: streak.milestonesAchieved,
      },
    });
  } catch (error) {
    console.error("Error fetching streak:", error);
    res.status(500).json({ success: false, message: "Failed to fetch streak" });
  }
});



export default router;
