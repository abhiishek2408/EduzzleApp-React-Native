// models/GamingQuizEventAttempt.js
import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  selectedOption: { type: String },
  isCorrect: { type: Boolean },
  timeTakenSec: { type: Number },
});

const gamingQuizEventAttemptSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "GamingQuizEvent", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },

    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    durationSec: { type: Number },

    score: { type: Number, default: 0, index: true },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    answers: [answerSchema],

    // Anti-cheat
    disqualified: { type: Boolean, default: false },
    reason: { type: String },
    ip: { type: String },
    deviceInfo: { type: String },
  },
  { timestamps: true }
);

gamingQuizEventAttemptSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export default mongoose.model("GamingQuizEventAttempt", gamingQuizEventAttemptSchema);
