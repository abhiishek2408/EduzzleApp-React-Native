// models/Streak.js
import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  
  // Track milestone achievements (coins only)
  milestonesAchieved: [{
    days: { type: Number }, // 3, 5, 10
    achievedAt: { type: Date },
    coinsAwarded: { type: Number },
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

streakSchema.index({ userId: 1 });

export default mongoose.model("Streak", streakSchema);
