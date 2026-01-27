// routes/QuizRoutes.js
import express from "express";
import Quiz from "../models/Quiz.js";


const router = express.Router();

// 📌 Create a new quiz (must have exactly 3 levels: Easy, Medium, Hard)
router.post("/create", async (req, res) => {
  try {
    const { name, description, category, author, levels } = req.body;

    // Validate: exactly 3 levels with names Easy, Medium, Hard
    const validLevelNames = ["Easy", "Medium", "Hard"];
    const inputLevelNames = levels.map((l) => l.name);
    const uniqueLevelNames = new Set(inputLevelNames);

    if (
      levels.length !== 3 ||
      !validLevelNames.every((name) => inputLevelNames.includes(name)) ||
      uniqueLevelNames.size !== 3
    ) {
      return res.status(400).json({
        message:
          "Quiz must include exactly 3 levels named: Easy, Medium, and Hard.",
      });
    }

    const quiz = new Quiz({
      name,
      description,
      category,
      numberOfLevels: 3,
      levels,
      author,
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create quiz", error: err.message });
  }
});

// 📌 Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error("Failed to fetch quizzes:", err);
    res.status(500).json({ message: "Failed to fetch quizzes", error: err });
  }
});

// 📌 Add question to a specific level (Easy/Medium/Hard)
router.post("/:puzzleId/levels/:levelName/add-question", async (req, res) => {
  const { quizId, levelName } = req.params;
  const {
    question,
    options,
    answer,
    explanation,
    hint,
    image,
    tags,
    timeLimit,
    points,
  } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const level = quiz.levels.find(
      (lvl) => lvl.name.toLowerCase() === levelName.toLowerCase()
    );
    if (!level) return res.status(404).json({ message: "Level not found" });

    // Push question object
    level.questions.push({
      question,
      options,
      answer,
      explanation,
      hint,
      image,
      tags,
      timeLimit,
      points,
    });

    await quiz.save();
    res.status(200).json({ message: "Question added successfully", level });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding question", error });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz by ID:", error);
    res.status(500).json({ message: "Error fetching quiz", error });
  }
});

export default router;
