
// routes/QuizAttemptRoutes.js
import express from "express";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/User.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const {
      userId,
      quizId,
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

    // Check if this is the first attempt for this quiz by this user
    const existingAttempt = await QuizAttempt.findOne({ userId, quizId });
    const isFirstAttempt = !existingAttempt;

    const attempt = new QuizAttempt({
      userId,
      quizId,
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

    // Award 3 coins only on first attempt of this quiz
    if (isFirstAttempt) {
      await User.findByIdAndUpdate(
        userId,
        { $inc: { coins: 3 } },
        { new: true }
      );
    }

    res.status(201).json({ 
      message: "Attempt saved successfully", 
      attempt,
      coinsAwarded: isFirstAttempt ? 3 : 0
    });
  } catch (error) {
    console.error("Error saving attempt:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Get all attempts for a quiz by a user
router.get("/quiz/:quizId/user/:userId", async (req, res) => {
  try {
    const { quizId, userId } = req.params;
    const attempts = await QuizAttempt.find({ quizId, userId }).sort({ startedAt: -1 });
    res.json({ attempts });
  } catch (error) {
    console.error("Error fetching attempts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
