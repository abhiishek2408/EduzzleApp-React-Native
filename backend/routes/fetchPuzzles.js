// routes/fetchPuzzles.js
import express from "express";
import Puzzle from "../models/Puzzle.js";

const router = express.Router();

// ✅ GET: Fetch puzzles allowed for a specific user
router.get("/all", async (req, res) => {
  const userId = req.query.userId; // Example: pass ?userId=abc123

  if (!userId) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    const puzzles = await Puzzle.find({
      isActive: true,
      $or: [
        { allowedUsers: { $exists: false } },
        { allowedUsers: { $size: 0 } },
        { allowedUsers: userId },
      ],
    }).select(
      "name description category numberOfLevels totalMarks tags levels.name"
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
