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
      streak = await Streak.create({ userId, currentStreak: 0, longestStreak: 0 });
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

// Update daily login streak (called when user opens app)
router.post("/daily-login/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const streak = await Streak.updateDailyLoginStreak(userId);
    
    res.json({
      success: true,
      message: "Daily login streak updated",
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastCompletedDate: streak.lastCompletedDate,
        milestonesAchieved: streak.milestonesAchieved,
      },
    });
  } catch (error) {
    console.error("Error updating daily login streak:", error);
    res.status(500).json({ success: false, message: "Failed to update streak" });
  }
});



// Reset streak (admin or testing purposes)
 

export default router;
