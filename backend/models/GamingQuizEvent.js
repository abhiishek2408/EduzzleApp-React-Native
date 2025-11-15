// models/GamingQuizEvent.js
import mongoose from "mongoose";

// Embedded question schema (similar to Quiz question schema)
const eventQuestionSchema = new mongoose.Schema({
  question: { type: String }, // optional alias
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true }, // stored server-side; not returned to client
  explanation: { type: String },
  image: { type: String },
  tags: [{ type: String }],
  timeLimit: { type: Number, default: 30 },
  points: { type: Number, default: 10 },
});

const rewardsSchema = new mongoose.Schema({
  placement: { type: Number, required: true }, // 1, 2, 3, ...
  coins: { type: Number, default: 0 },
  badge: { type: String },
});

const gamingQuizEventSchema = new mongoose.Schema(
  {
    // Basic info
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },

    // Scheduling
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    status: { type: String, enum: ["scheduled", "live", "completed", "disabled"], default: "scheduled", index: true },

    // Participation
    entryCostCoins: { type: Number, default: 0 },
    allowMultipleAttempts: { type: Boolean, default: false }, // default once per event
    maxParticipants: { type: Number },

    // Mode and timing
    mode: { type: String, enum: ["solo", "team", "live"], default: "solo" },
    totalTimerSec: { type: Number },
    perQuestionTimerSec: { type: Number, default: 30 },

    // Embedded questions for the event
    randomizeQuestions: { type: Boolean, default: true },
    totalQuestions: { type: Number, required: true },
    questions: [eventQuestionSchema],

    // Scoring rules
    scoring: {
      correct: { type: Number, default: 10 },
      wrong: { type: Number, default: 0 },
      streakBonus: { type: Number, default: 5 }, // every N correct in a row grants bonus
      streakEvery: { type: Number, default: 5 },
    },

    // Rewards
    rewards: [rewardsSchema],

    // Admin
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

gamingQuizEventSchema.index({ title: 1, startTime: 1 }, { unique: false });

export default mongoose.model("GamingQuizEvent", gamingQuizEventSchema);
