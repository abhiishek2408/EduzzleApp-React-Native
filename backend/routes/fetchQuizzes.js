// routes/fetchQuizzes.js
import express from "express";
import Quiz from "../models/Quiz.js";

const router = express.Router();

// search quizzes by name or tags
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "Search query required" });
  }

  try {
    const quizzes = await Quiz.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).select(
      "name description category numberOfLevels totalMarks tags levels.name isFree"
    );

    res.status(200).json(quizzes);
  } catch (err) {
    console.error("Error searching quizzes:", err);
    res.status(500).json({ message: "Error searching quizzes", error: err });
  }
});

//you can search quizzes by level
router.get("/search/level", async (req, res) => {
  const level = req.query.level;
  if (!level) {
    return res.status(400).json({ message: "Level query required" });
  }

  try {
    const quizzes = await Quiz.find({
      isActive: true,
      "levels.name": { $regex: level, $options: "i" },
    }).select(
      "name description category numberOfLevels totalMarks tags levels.name isFree"
    );

    res.status(200).json(quizzes);
  } catch (err) {
    console.error("Error searching quizzes by level:", err);
    res.status(500).json({ message: "Error searching quizzes by level", error: err });
  }
});


router.get("/all", async (req, res) => {
  const userId = req.query.userId; 

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const quizzes = await Quiz.find({
      isActive: true,
      $or: [
        { isFree: true }, 
        { allowedUsers: { $exists: false } },
        { allowedUsers: { $size: 0 } },
        { allowedUsers: { $in: [new mongoose.Types.ObjectId(userId)] } },
      ],
    }).select(
      "name description category numberOfLevels totalMarks tags levels.name isFree"
    );

    res.status(200).json(quizzes);
  } catch (err) {
    console.error("Error fetching quizzes for user:", err);
    res.status(500).json({ message: "Error fetching quizzes", error: err });
  }
});


router.get("/all-free-quizzes", async (req, res) => {
  try {
    const freeQuizzes = await Quiz.find({
      isActive: true,
      isFree: true,
    }).select(
      "name description category numberOfLevels totalMarks tags levels.name isFree"
    );

    res.status(200).json(freeQuizzes);
  } catch (err) {
    console.error("Error fetching free quizzes:", err);
    res.status(500).json({ message: "Error fetching free quizzes", error: err.message });
  }
});


// ✅ GET: Fetch full quiz by ID (detailed view for test attempt)
router.get("/by-id/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json(quiz);
  } catch (err) {
    console.error("Error fetching quiz by ID:", err);
    res.status(500).json({ message: "Error fetching quiz", error: err });
  }
});

export default router;
