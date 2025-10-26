// routes/puzzleAttemptRoutes.js
import express from "express";
import PuzzleAttempt from "../models/QuizAttempt.js";

const router = express.Router();

// POST /api/puzzle-attempts/
router.post("/", async (req, res) => {
  try {
    const {
      user,
      puzzle,
      attemptNumber = 1,
      startedAt,
      endedAt,
      totalTimeTaken,
      totalScore,
      result,
      levelAttempts,
      feedback,
      rating,
    } = req.body;

    const attempt = new PuzzleAttempt({
      user,
      puzzle,
      attemptNumber,
      startedAt,
      endedAt,
      totalTimeTaken,
      totalScore,
      result,
      levelAttempts,
      feedback: feedback || "",          // fallback to empty string
      rating:   typeof rating === "number" ? rating : 0,
    });

    await attempt.save();
    res.status(201).json({ message: "Attempt saved successfully", attempt });
  } catch (error) {
    console.error("Error saving attempt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
