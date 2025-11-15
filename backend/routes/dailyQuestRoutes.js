// routes/dailyQuestRoutes.js
import express from "express";
import DailyQuest from "../models/DailyQuest.js";

const router = express.Router();

// Get current quest status for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let quest = await DailyQuest.findOne({ userId });

    if (!quest) {
      return res.json({
        quizzesAttemptedToday: 0,
        completedToday: false,
        streak: 0,
      });
    }

    // Check if we need to reset for a new day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastDate = quest.lastQuestDate ? new Date(quest.lastQuestDate) : null;
    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    if (!lastDate || lastDate.getTime() !== today.getTime()) {
      // New day - return reset values without modifying DB (will update on next quiz attempt)
      return res.json({
        quizzesAttemptedToday: 0,
        completedToday: false,
        streak: quest.streak || 0,
      });
    }

    res.json({
      quizzesAttemptedToday: quest.quizzesAttemptedToday || 0,
      completedToday: quest.completedToday || false,
      streak: quest.streak || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching daily quest status" });
  }
});

export default router;
