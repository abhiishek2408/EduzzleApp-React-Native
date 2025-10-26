import express from "express";
import mongoose from "mongoose";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import User from "../models/User.js";
import authenticate from "../middlewares/auth.js";

const router = express.Router();

/* ======================================================
   🟣 1️⃣  CREATE SUBSCRIPTION PLAN (Admin only)
   ====================================================== */
router.post("/create", async (req, res) => {
  try {
    const { name, durationInDays, price, discountPercentage } = req.body;

    const plan = new SubscriptionPlan({
      name,
      durationInDays,
      price,
      discountPercentage: discountPercentage || 0,
      discountCodes: []
    });

    await plan.save();
    res.status(201).json({ message: "Subscription plan created", plan });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟣 2️⃣  GET ALL SUBSCRIPTION PLANS
   ====================================================== */
router.get("/plans", async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟣 3️⃣  AVAIL SUBSCRIPTION (with discount option)
   ====================================================== */
router.post("/avail", authenticate, async (req, res) => {
  try {
    const { planId, discountCode } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Base price
    let finalPrice = plan.price;
    let discountApplied = null;

    // Apply discount if valid
    if (discountCode && plan.discountCodes?.length > 0) {
      const found = plan.discountCodes.find(dc => dc.code === discountCode);
      if (found) {
        discountApplied = found.code;
        finalPrice = plan.price - (plan.price * found.percentage / 100);
      }
    }

    // Simulated payment success
    const paymentSuccess = true;
    if (!paymentSuccess) return res.status(400).json({ message: "Payment failed" });

    // Set start and end dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    user.subscription = {
      planId: plan._id,
      planName: plan.name,
      startDate,
      endDate,
      isActive: true,
      paymentStatus: "paid",
      finalPrice,
      discountApplied
    };

    await user.save();

    res.json({
      message: "Subscription activated successfully!",
      plan: plan.name,
      finalPrice,
      discountApplied,
      startDate,
      endDate
    });

  } catch (error) {
    console.error("Error availing subscription:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟣 4️⃣  ADD DISCOUNT CODE TO A PLAN (Admin)
   ====================================================== */
router.post("/add-discount/:planId", async (req, res) => {
  try {
    const { planId } = req.params;
    const { code, percentage } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    plan.discountCodes.push({ code, percentage });
    await plan.save();

    res.json({ message: "Discount code added", plan });
  } catch (error) {
    console.error("Error adding discount:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟣 5️⃣  GET USER SUBSCRIPTION INFO
   ====================================================== */
router.get("/my-subscription", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("subscription.planId");
    if (!user.subscription) return res.status(404).json({ message: "No subscription found" });
    res.json(user.subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟣 6️⃣  AUTO-EXPIRE OLD SUBSCRIPTIONS (Cron-friendly)
   ====================================================== */
router.put("/expire", async (req, res) => {
  try {
    const now = new Date();
    const expired = await User.updateMany(
      { "subscription.endDate": { $lte: now }, "subscription.isActive": true },
      { $set: { "subscription.isActive": false } }
    );

    res.json({ message: "Expired subscriptions updated", count: expired.modifiedCount });
  } catch (error) {
    console.error("Error expiring subscriptions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   🟣 7️⃣  RENEW SUBSCRIPTION PLAN
   ====================================================== */
router.post("/renew", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, discountCode } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (!user.subscription?.isActive) {
      return res.status(400).json({ message: "No active subscription found. Please subscribe first." });
    }

    let finalPrice = plan.price;
    let discountApplied = null;

    if (discountCode && plan.discountCodes?.length > 0) {
      const found = plan.discountCodes.find(dc => dc.code === discountCode);
      if (found) {
        discountApplied = found.code;
        finalPrice -= (plan.price * found.percentage) / 100;
      }
    }

    const paymentSuccess = true;
    if (!paymentSuccess) return res.status(400).json({ message: "Payment failed" });

    const currentEnd = new Date(user.subscription.endDate);
    const newEndDate = new Date(currentEnd);
    newEndDate.setDate(newEndDate.getDate() + plan.durationInDays);

    user.subscription = {
      planId: plan._id,
      planName: plan.name,
      startDate: new Date(),
      endDate: newEndDate,
      isActive: true,
      paymentStatus: "paid",
      finalPrice,
      discountApplied,
      renewedOn: new Date()
    };

    await user.save();

    res.json({
      message: "Subscription renewed successfully!",
      plan: plan.name,
      newEndDate,
      finalPrice,
      discountApplied
    });

  } catch (error) {
    console.error("Error renewing subscription:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
