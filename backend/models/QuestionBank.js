// models/QuestionBank.js
import mongoose from "mongoose";

const questionBankSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    explanation: { type: String },
    image: { type: String },
    category: { type: String, index: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy", index: true },
    tags: [{ type: String, index: true }],
    timeLimit: { type: Number, default: 30 },
    points: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("QuestionBank", questionBankSchema);
