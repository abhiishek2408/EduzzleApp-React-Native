import crypto from "crypto";

export const randomId = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export const hashToken = async (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
