import User from "../models/User.js";

/**
 * ✅ Middleware to verify if user has an active premium subscription
 */
export const checkSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id; // set by authenticate middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check active subscription
    if (!user.subscription || !user.subscription.isActive) {
      return res.status(403).json({
        message: "Access denied. You need an active premium subscription.",
      });
    }

    // check expiry (in case cron missed)
    const now = new Date();
    if (user.subscription.endDate && user.subscription.endDate <= now) {
      user.subscription.isActive = false;
      await user.save();

      return res.status(403).json({
        message: "Your subscription has expired. Please renew to continue.",
      });
    }

    // if everything is fine
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while checking subscription" });
  }
};
