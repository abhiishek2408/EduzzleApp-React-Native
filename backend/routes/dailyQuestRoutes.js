// routes/dailyQuestRoutes.js
import express from "express";
import DailyQuest from "../models/DailyQuest.js";

const router = express.Router();

// Get current quest status for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const quest = await DailyQuest.findOne({ userId, date: today });

    if (!quest) {
      return res.json({
        quizzesAttempted: 0,
        completed: false,
        currentStreak: 0,
      });
    }

    res.json({
      quizzesAttempted: quest.quizzesAttempted,
      completed: quest.completed,
      currentStreak: quest.currentStreak,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching daily quest status" });
  }
});

export default router;
