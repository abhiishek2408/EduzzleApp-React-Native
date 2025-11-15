// models/Streak.js
import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date },
  
  // Track milestone achievements
  milestonesAchieved: [{
    days: { type: Number }, // 3, 7, 15, 30
    achievedAt: { type: Date },
    badgeName: { type: String }, // Bronze, Silver, Gold, Diamond
  }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

streakSchema.index({ userId: 1 });

export default mongoose.model("Streak", streakSchema);
