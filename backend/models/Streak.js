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

// Milestone configuration (coins awarded when reaching these streak days)
const MILESTONES = [
  { days: 3, coins: 5 },
  { days: 5, coins: 10 },
  { days: 10, coins: 15 },
];

// Static method to update daily login streak
streakSchema.statics.updateDailyLoginStreak = async function(userId) {
  const User = mongoose.model("User");

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  let streak = await this.findOne({ userId });
  if (!streak) {
    // First time opening app - create streak with day 1
    streak = await this.create({ 
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastCompletedDate: now
    });
    return streak;
  }

  // Already updated today? return as-is
  if (streak.lastCompletedDate) {
    const lastDate = new Date(streak.lastCompletedDate);
    lastDate.setHours(0, 0, 0, 0);
    if (lastDate.getTime() === today.getTime()) {
      return streak;
    }
  }

  // Check if streak continues or breaks
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const last = streak.lastCompletedDate ? new Date(streak.lastCompletedDate) : null;
  if (last) last.setHours(0, 0, 0, 0);

  if (last && last.getTime() === yesterday.getTime()) {
    // Consecutive day - increment streak
    streak.currentStreak += 1;
  } else {
    // Streak broken - reset to 1
    streak.currentStreak = 1;
  }

  // Update longest streak if current exceeds it
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  streak.lastCompletedDate = now;
  streak.updatedAt = now;

  await streak.save();
  return streak;
};

// Post-save hook to automatically award coins when a milestone is reached
streakSchema.post("save", async function(doc) {
  try {
    const User = mongoose.model("User");
    const milestone = MILESTONES.find((m) => m.days === doc.currentStreak);
    if (!milestone) return;

    const alreadyAchieved = (doc.milestonesAchieved || []).some((m) => m.days === milestone.days);
    if (alreadyAchieved) return;

    // Credit coins and record achievement without triggering save loop
    await Promise.all([
      User.findByIdAndUpdate(doc.userId, { $inc: { coins: milestone.coins } }),
      mongoose.model("Streak").updateOne(
        { _id: doc._id },
        { $push: { milestonesAchieved: { days: milestone.days, achievedAt: new Date(), coinsAwarded: milestone.coins } } }
      ),
    ]);
  } catch (e) {
    console.error("Error in Streak post-save milestone award:", e);
  }
});
 
export default mongoose.model("Streak", streakSchema);
    
