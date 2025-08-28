import rateLimit from "express-rate-limit";

export const createRateLimiter = (opts = {}) => {
  return rateLimit({
    windowMs: opts.windowMs || 15 * 60 * 1000,
    max: opts.max || 10,
    message: opts.message || "Too many requests, try later",
    standardHeaders: true,
    legacyHeaders: false
  });
};
