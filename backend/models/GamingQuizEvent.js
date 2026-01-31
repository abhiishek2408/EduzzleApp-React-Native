// models/GamingQuizEvent.js
import mongoose from "mongoose";

// Embedded question schema (similar to Quiz question schema)
const eventQuestionSchema = new mongoose.Schema(
  {
    question: { type: String }, // optional alias
    text: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true }, // stored server-side; not returned to client
    explanation: { type: String },
    image: { type: String },
    timeLimit: { type: Number, default: 30 },
  },
  { _id: false }
);

const gamingQuizEventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },

    // Scheduling
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    status: { type: String, enum: ["scheduled", "live", "completed"], default: "scheduled", index: true },

    // Participation
    allowMultipleAttempts: { type: Boolean, default: false }, // default once per event
    maxParticipants: { type: Number },

    // Embedded questions for the event
    randomizeQuestions: { type: Boolean, default: true },
    totalQuestions: { type: Number, required: true },
    questions: [eventQuestionSchema],

    // Computed duration (sum of question time limits)
    durationSec: { type: Number, default: 0 },

    // Scoring rules
    scoring: {
      correct: { type: Number, default: 10 },
      wrong: { type: Number, default: 0 },
    },

    // Admin
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

gamingQuizEventSchema.index({ title: 1, startTime: 1 }, { unique: false });

// Auto-calculate duration from question time limits
gamingQuizEventSchema.pre("validate", function (next) {
  const qs = Array.isArray(this.questions) ? this.questions : [];
  this.durationSec = qs.reduce((sum, q) => sum + (Number(q.timeLimit) || 0), 0);
  next();
});

export default mongoose.model("GamingQuizEvent", gamingQuizEventSchema);
