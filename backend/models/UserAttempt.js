// models/UserAttempt.js
import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema({
  userId: String,
  puzzleId: String,
  score: Number,
  result: String,
  levelWise: [
    {
      levelName: String,
      score: Number,
      maxMarks: Number,
      passed: Boolean,
    },
  ],
  answers: [
    {
      question: String,
      selected: String,
      correct: String,
      isCorrect: Boolean,
      points: Number,
      earned: Number,
      levelName: String,
    },
  ],
  date: { type: Date, default: Date.now },
});

export default mongoose.model('UserAttempt', attemptSchema);
