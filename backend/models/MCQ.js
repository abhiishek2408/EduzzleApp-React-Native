const mongoose = require('mongoose');


const MCQSchema = new mongoose.Schema({
  question: {
    text: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    latex: { type: String }, // Optional LaTeX for math
  },
  options: [
    {
      text: { type: String, required: true },
      image: { type: String },
      latex: { type: String },
      isCorrect: { type: Boolean }, // Optional for multi-correct
    }
  ],
  answer: { type: String, required: true }, // Could be index, value, or array for multi-correct
  solution: {
    text: { type: String },
    images: [{ type: String }],
    latex: { type: String },
    video: { type: String }, // Optional video explanation
  },
  subject: { type: String, required: true },
  course: { type: String, required: true },
  syllabus: { type: String, required: true },
  category: { type: String, required: true },
  topic: { type: String, required: true },
  tags: [{ type: String }],
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  explanation: { type: String },
  author: { type: String },
  isActive: { type: Boolean, default: true },
  stats: {
    attempts: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    wrong: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('MCQ', MCQSchema);
