import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, index: true },
  type: { type: String, enum: ["refresh", "blacklist"], default: "refresh" },
  expiresAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("Token", tokenSchema);
