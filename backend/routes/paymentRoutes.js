import express from "express";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

/* =========================
   CREATE RAZORPAY ORDER
========================= */
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { planId, discountCode } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    let finalPrice = plan.price;
    if (discountCode && plan.discountCodes?.length > 0) {
      const found = plan.discountCodes.find((dc) => dc.code === discountCode);
      if (found) {
        finalPrice = plan.price - (plan.price * found.percentage) / 100;
      }
    }

    const order = await razorpay.orders.create({
      amount: Math.round(finalPrice * 100), // INR → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      userId: req.user.id,
      planId,
      razorpay_order_id: order.id,
      amount: finalPrice,
      status: "created",
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[CREATE ORDER ERROR]", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   VERIFY PAYMENT & ACTIVATE SUBSCRIPTION
========================= */
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // 🔐 Signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ✅ Update payment
    await Payment.findOneAndUpdate(
      { razorpay_order_id },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
      }
    );

    // ✅ Activate subscription INSIDE USER
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    await User.findByIdAndUpdate(req.user.id, {
      subscription: {
        planId,
        startDate,
        endDate,
        isActive: true,
      },
    });

    res.json({
      success: true,
      message: "Payment verified & subscription activated",
    });
  } catch (err) {
    console.error("[VERIFY PAYMENT ERROR]", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
