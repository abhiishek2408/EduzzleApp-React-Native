// models/Quiz.js
import mongoose from "mongoose";

// Question Schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  answer: { type: String, required: true },
  explanation: { type: String },
  hint: { type: String },
  image: { type: String },
  tags: [{ type: String }],
  timeLimit: { type: Number },
  points: { type: Number, default: 1 },
});

// Level Schema
const levelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Easy", "Medium", "Hard"],
  },
  timeLimit: { type: Number, default: 60 },
  maxMarks: { type: Number },
  passingMarks: { type: Number },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
  instructions: { type: String },
  questions: [questionSchema],
  order: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

// quiz Schema
const quizSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  numberOfLevels: {
    type: Number,
    default: 3,
    validate: {
      validator: (val) => val === 3,
      message: "Exactly 3 levels are allowed.",
    },
  },
  levels: {
    type: [levelSchema],
    validate: {
      validator: (val) => {
        const requiredNames = ["Easy", "Medium", "Hard"];
        const levelNames = val.map((level) => level.name);
        const allValid = requiredNames.every((name) => levelNames.includes(name));
        return val.length === 3 && allValid && new Set(levelNames).size === 3;
      },
      message: "quiz must have exactly 3 levels named 'Easy', 'Medium', and 'Hard'.",
    },
  },
  author: { type: String },
  isActive: { type: Boolean, default: true },
  isFree: { type: Boolean, default: false },
  totalMarks: { type: Number },
  tags: [{ type: String }],
  allowedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Quiz", quizSchema);
