// models/PuzzleAttempt.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Puzzle.questions" },
  selectedOption: { type: String, required: true },
  correctOption: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number }, // in seconds
  pointsEarned: { type: Number, default: 0 },
});

// Per Level Attempt Schema
const levelAttemptSchema = new mongoose.Schema({
  levelName: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  startedAt: { type: Date },
  endedAt: { type: Date },
  timeTaken: { type: Number }, // auto-calculate from above
  totalQuestions: { type: Number },
  correctAnswers: { type: Number },
  wrongAnswers: { type: Number },
  unanswered: { type: Number },
  score: { type: Number },
  passed: { type: Boolean },
  answers: [answerSchema],
});

// Puzzle Attempt Schema (per user per attempt)
const puzzleAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  puzzle: { type: mongoose.Schema.Types.ObjectId, ref: "Puzzle", required: true },

  // Support for multiple retakes
  attemptNumber: { type: Number, default: 1 },

  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  totalTimeTaken: { type: Number }, // seconds
  totalScore: { type: Number },
  result: { type: String, enum: ["Passed", "Failed"] },

  levelAttempts: [levelAttemptSchema],

  // Optional fields
  feedback: { type: String, default: "" },
  rating: { type: Number, min: 0, max: 5, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("PuzzleAttempt", puzzleAttemptSchema);
