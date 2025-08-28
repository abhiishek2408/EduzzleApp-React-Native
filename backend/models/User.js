import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ["user", "librarian", "admin"], default: "user" },
  isVerified: { type: Boolean, default: false },
  otp: {
    code: String,        // hashed OTP
    expiresAt: Date
  },
  resetPasswordToken: String, // hashed
  resetPasswordExpires: Date,
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, { timestamps: true });

// password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

export default mongoose.model("User", userSchema);
