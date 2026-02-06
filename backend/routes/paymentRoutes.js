import express from "express";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// route-specific rate limiters
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // create-order: allow up to 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6, // verify: stricter to prevent brute-force/replay attempts
  standardHeaders: true,
  legacyHeaders: false,
});

/* =========================
   CREATE RAZORPAY ORDER
========================= */
router.post("/create-order", paymentLimiter, authMiddleware, async (req, res) => {
  try {
    const { planId, discountCode } = req.body;

    // Basic input validation
    if (!planId || !mongoose.Types.ObjectId.isValid(planId)) {
      return res.status(400).json({ success: false, message: "Invalid or missing planId" });
    }
    if (discountCode && typeof discountCode !== 'string') {
      return res.status(400).json({ success: false, message: "Invalid discountCode" });
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    let finalPrice = plan.price;
    if (discountCode && plan.discountCodes?.length > 0) {
      const found = plan.discountCodes.find((dc) => dc.code === discountCode);
      if (found) {
        finalPrice = plan.price - (plan.price * found.percentage) / 100;
      }
    }

    // generate a short-lived server nonce to mitigate replay attacks
    const nonce = crypto.randomBytes(16).toString('hex');
    const nonceExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes (shorter)

    // include nonce in Razorpay order notes to stronger bind order <-> nonce
    const order = await razorpay.orders.create({
      amount: Math.round(finalPrice * 100), // INR → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { nonce },
    });

    await Payment.create({
      userId: req.user.id,
      planId,
      razorpay_order_id: order.id,
      amount: finalPrice,
      status: "created",
      nonce,
      nonceExpires,
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      nonce,
      nonceExpires,
    });
  } catch (err) {
    console.error("[CREATE ORDER ERROR]", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   VERIFY PAYMENT & ACTIVATE SUBSCRIPTION
========================= */
router.post("/verify", verifyLimiter, authMiddleware, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    // Basic validation of inputs
    const idRegex = /^[A-Za-z0-9_\-]{10,60}$/;
    const sigRegex = /^[A-Fa-f0-9]{16,256}$/;

    if (!razorpay_order_id || !idRegex.test(String(razorpay_order_id)))
      return res.status(400).json({ message: "Invalid razorpay_order_id" });
    if (!razorpay_payment_id || !idRegex.test(String(razorpay_payment_id)))
      return res.status(400).json({ message: "Invalid razorpay_payment_id" });
    if (!razorpay_signature || !sigRegex.test(String(razorpay_signature)))
      return res.status(400).json({ message: "Invalid razorpay_signature" });
    if (!planId || !mongoose.Types.ObjectId.isValid(planId))
      return res.status(400).json({ message: "Invalid planId" });

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // Ensure we have a matching payment record that belongs to the requester
    const paymentRecord = await Payment.findOne({ razorpay_order_id });
    if (!paymentRecord) return res.status(404).json({ message: "Order record not found" });
    if (String(paymentRecord.userId) !== String(req.user.id)) {
      console.warn("Payment verify attempt from non-owner", { order: razorpay_order_id, user: req.user.id });
      return res.status(403).json({ message: "Not authorized for this order" });
    }
    if (paymentRecord.status === 'success') {
      return res.status(400).json({ message: "Order already verified" });
    }

    // nonce validation to mitigate replay attacks
    const { nonce } = req.body;
    if (!nonce || typeof nonce !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid nonce' });
    }
    if (!paymentRecord.nonce || paymentRecord.nonce !== nonce) {
      console.warn('Nonce mismatch for order', { order: razorpay_order_id });
      return res.status(400).json({ message: 'Invalid nonce' });
    }
    if (paymentRecord.nonceExpires && new Date(paymentRecord.nonceExpires) < new Date()) {
      console.warn('Expired nonce used for order', { order: razorpay_order_id });
      return res.status(400).json({ message: 'Nonce expired' });
    }

    // 🔐 Signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    // timing-safe compare
    const signaturesMatch = expectedSignature === String(razorpay_signature);
    if (!signaturesMatch) {
      console.warn("Signature mismatch on payment verify", { order: razorpay_order_id });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ✅ Update payment (only if it was in created state) and clear nonce
    await Payment.findOneAndUpdate(
      { razorpay_order_id, status: { $ne: 'success' } },
      {
        razorpay_payment_id,
        razorpay_signature,
        status: "success",
        nonce: null,
        nonceExpires: null,
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

/* =========================
   RAZORPAY WEBHOOK ENDPOINT
   - Verifies signature from `x-razorpay-signature`
   - Validates embedded `notes.nonce` against Payment record
   - Updates payment & activates subscription when appropriate
========================= */
router.post(
  "/webhook",
  // use raw body for signature verification
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["x-razorpay-signature"];
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!signature || !secret) {
        return res.status(400).send("Missing signature or secret");
      }

      const expected = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
      // timing-safe compare
      if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature)))) {
        console.warn("Webhook signature mismatch");
        return res.status(400).send("Invalid signature");
      }

      const payload = JSON.parse(req.body.toString());
      const event = payload.event;
      const entity = payload.payload && (payload.payload.payment || payload.payload.order);

      // normalize to payment entity when present
      const paymentEntity = payload.payload?.payment?.entity || payload.payload?.order?.entity || null;
      const razorpayPaymentId = paymentEntity?.id || (paymentEntity && paymentEntity.payment_id) || null;
      const razorpayOrderId = paymentEntity?.order_id || paymentEntity?.receipt || null;

      // Try to read notes.nonce from either payment or order entity
      const notes = paymentEntity?.notes || (payload.payload?.order?.entity?.notes) || {};
      const incomingNonce = notes?.nonce;

      // only handle captured payments for now
      if (event !== "payment.captured" && event !== "order.paid" && event !== "payment.authorized") {
        return res.status(200).json({ ok: true, message: "ignored" });
      }

      if (!razorpayOrderId) {
        console.warn("Webhook missing order id");
        return res.status(400).send("Missing order id");
      }

      const paymentRecord = await Payment.findOne({ razorpay_order_id: razorpayOrderId });
      if (!paymentRecord) {
        console.warn("Webhook for unknown order", { order: razorpayOrderId });
        return res.status(404).send("Order not found");
      }

      // validate nonce if present on our record
      if (paymentRecord.nonce) {
        if (!incomingNonce || incomingNonce !== paymentRecord.nonce) {
          console.warn("Webhook nonce mismatch", { order: razorpayOrderId });
          return res.status(400).send("Invalid nonce");
        }
        if (paymentRecord.nonceExpires && new Date(paymentRecord.nonceExpires) < new Date()) {
          console.warn("Webhook used expired nonce", { order: razorpayOrderId });
          return res.status(400).send("Nonce expired");
        }
      }

      if (paymentRecord.status === "success") {
        return res.status(200).json({ ok: true, message: "already processed" });
      }

      // Mark payment success and clear nonce
      await Payment.findOneAndUpdate(
        { razorpay_order_id: razorpayOrderId },
        {
          razorpay_payment_id: razorpayPaymentId || paymentRecord.razorpay_payment_id,
          status: "success",
          nonce: null,
          nonceExpires: null,
        }
      );

      // Activate subscription for the user
      const plan = await SubscriptionPlan.findById(paymentRecord.planId);
      if (plan) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.durationInDays);
        await User.findByIdAndUpdate(paymentRecord.userId, {
          subscription: {
            planId: plan._id,
            startDate,
            endDate,
            isActive: true,
          },
        });
      }

      res.status(200).json({ ok: true });
    } catch (err) {
      console.error("[WEBHOOK ERROR]", err);
      res.status(500).send("webhook error");
    }
  }
);

export default router;
