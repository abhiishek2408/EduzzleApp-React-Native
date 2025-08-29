import express from "express";
import UserAttempt from "../models/UserAttempt.js";

const router = express.Router();

// ✅ Get stats for any user by ID (frontend sends the ID)
router.get("/stats/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find all attempts of this user
    const attempts = await UserAttempt.find({ userId });

    const attemptCount = attempts.length;
    const totalPoints = attempts.reduce((sum, att) => sum + (att.score || 0), 0);

    let highestLevel = "None";
    attempts.forEach((att) => {
      att.levelWise?.forEach((lvl) => {
        if (lvl.passed) highestLevel = lvl.levelName;
      });
    });

    res.json({ success: true, attemptCount, totalPoints, highestLevel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});

export default router;
