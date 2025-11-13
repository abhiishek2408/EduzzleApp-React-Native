// models/Badge.js
import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  name: {
    type: String,
    enum: ["Bronze", "Silver", "Gold", "Diamond"],
    required: true,
  },

  streakDays: { type: Number, required: true },
  rewardCoins: { type: Number, default: 0 },
  unlockedAt: { type: Date, default: Date.now },
  claimed: { type: Boolean, default: false },
});

export default mongoose.model("Badge", badgeSchema);
