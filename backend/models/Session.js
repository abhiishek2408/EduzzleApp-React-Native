import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jti: { type: String, required: true, unique: true }, // refresh token identifier
  refreshHash: { type: String, required: true },
  ua: { type: String },
  ip: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, default: null },
});

export default mongoose.model("Session", sessionSchema);
