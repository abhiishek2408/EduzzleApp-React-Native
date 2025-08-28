// const express = require('express');
// const router = express.Router();
// const Puzzle = require('../models/Puzzle');

// // POST /api/puzzles/create
// router.post('/create', async (req, res) => {
//   try {
//     const puzzle = new Puzzle(req.body);
//     await puzzle.save();
//     res.status(201).json({ message: 'Puzzle created successfully', puzzle });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to create puzzle', error: err });
//   }
// });

// module.exports = router;


// routes/puzzle.js
import express from "express";
import Puzzle from "../models/Puzzle.js";
import UserAttempt from "../models/UserAttempt.js";

const router = express.Router();

// 📌 Create a new puzzle (must have exactly 3 levels: Easy, Medium, Hard)
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
          "Puzzle must include exactly 3 levels named: Easy, Medium, and Hard.",
      });
    }

    const puzzle = new Puzzle({
      name,
      description,
      category,
      numberOfLevels: 3,
      levels,
      author,
    });

    await puzzle.save();
    res.status(201).json({ message: "Puzzle created successfully", puzzle });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create puzzle", error: err.message });
  }
});

// 📌 Get all puzzles
router.get("/", async (req, res) => {
  try {
    const puzzles = await Puzzle.find();
    res.json(puzzles);
  } catch (err) {
    console.error("Failed to fetch puzzles:", err);
    res.status(500).json({ message: "Failed to fetch puzzles", error: err });
  }
});

// 📌 Add question to a specific level (Easy/Medium/Hard)
router.post("/:puzzleId/levels/:levelName/add-question", async (req, res) => {
  const { puzzleId, levelName } = req.params;
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
    const puzzle = await Puzzle.findById(puzzleId);
    if (!puzzle) return res.status(404).json({ message: "Puzzle not found" });

    const level = puzzle.levels.find(
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

    await puzzle.save();
    res.status(200).json({ message: "Question added successfully", level });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding question", error });
  }
});

// 📌 Get puzzle by ID
router.get("/:id", async (req, res) => {
  try {
    const puzzle = await Puzzle.findById(req.params.id);
    if (!puzzle) {
      return res.status(404).json({ message: "Puzzle not found" });
    }
    res.json(puzzle);
  } catch (error) {
    console.error("Error fetching puzzle by ID:", error);
    res.status(500).json({ message: "Error fetching puzzle", error });
  }
});

export default router;
