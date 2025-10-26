import express from "express";
import QuizAttempt from "../models/QuizAttempt.js";

const router = express.Router();

// Get stats for a user by user ID (from frontend)
router.get("/stats/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Find all attempts for this user
    const attempts = await QuizAttempt.find({ user: userId });

    const attemptCount = attempts.length;

    // Sum totalScore across all attempts
    const totalPoints = attempts.reduce((sum, att) => sum + (att.totalScore || 0), 0);

    // Find highest level passed
    let highestLevel = "None";
    const levelOrder = { Easy: 1, Medium: 2, Hard: 3 }; // to compare levels

    attempts.forEach((att) => {
      att.levelAttempts?.forEach((lvl) => {
        if (lvl.passed) {
          if (
            highestLevel === "None" ||
            levelOrder[lvl.levelName] > levelOrder[highestLevel]
          ) {
            highestLevel = lvl.levelName;
          }
        }
      });
    });

    res.json({ success: true, attemptCount, totalPoints, highestLevel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});



// Get all quiz IDs attempted by a user
router.get("/attempted-puzzles/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch only quiz IDs for this user
    const attempts = await QuizAttempt.find({ user: userId }).select("puzzle -_id");

    const attemptedPuzzleIds = attempts.map((att) => att.puzzle.toString());

    res.json({ success: true, attemptedPuzzleIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
});


export default router;
