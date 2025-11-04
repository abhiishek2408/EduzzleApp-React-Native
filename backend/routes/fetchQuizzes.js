// routes/fetchPuzzles.js
import express from "express";
import Puzzle from "../models/Quiz.js";

const router = express.Router();

// search puzzles by name or tags
router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: "Search query required" });
  }

  try {
    const puzzles = await Puzzle.find({
      isActive: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }).select(
      "name description category numberOfLevels totalMarks tags levels.name isFree"
    );

    res.status(200).json(puzzles);
  } catch (err) {
    console.error("Error searching puzzles:", err);
    res.status(500).json({ message: "Error searching puzzles", error: err });
  }
});

//you can search quizzes by li




router.get("/all", async (req, res) => {
  const userId = req.query.userId; // Example: /api/puzzles/all?userId=abc123

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const puzzles = await Puzzle.find({
      isActive: true,
      $or: [
        { isFree: true }, // ✅ Free puzzles available for all users
        { allowedUsers: { $exists: false } },
        { allowedUsers: { $size: 0 } },
        { allowedUsers: userId },
      ],
    }).select(
      "name description category numberOfLevels totalMarks tags levels.name isFree"
    );

    res.status(200).json(puzzles);
  } catch (err) {
    console.error("Error fetching puzzles for user:", err);
    res.status(500).json({ message: "Error fetching puzzles", error: err });
  }
});


// ✅ GET: Fetch full puzzle by ID (detailed view for test attempt)
router.get("/by-id/:id", async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) return res.status(404).json({ message: "Puzzle not found" });
    res.status(200).json(puzzle);
  } catch (err) {
    console.error("Error fetching puzzle by ID:", err);
    res.status(500).json({ message: "Error fetching puzzle", error: err });
  }
});

export default router;
