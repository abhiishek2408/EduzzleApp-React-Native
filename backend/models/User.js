import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "librarian", "admin"], default: "user" },
  coins: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  otp: {
    code: String,
    expiresAt: Date
  },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: Date,

  // ✅ new field for profile picture
  profilePic: {
    type: String,
    default: "https://t4.ftcdn.net/jpg/04/31/64/75/360_F_431647519_usrbQ8Z983hTYe8zgA7t1XVc5fEtqcpa.jpg"
  },

    // 🧩 Friend system
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],


  subscription: {
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan" },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: false },
},



}, { timestamps: true });

// Hash password before saving (optimized with 8 rounds for faster response)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(8); // Reduced from 10 to 8 for better performance
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Account lock check
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

export default mongoose.model("User", userSchema);

