import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["1 Month", "3 Months", "6 Months", "1 Year"],
    required: true,
  },
  durationInDays: { type: Number, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },

  // 🟣 multiple discount codes allowed
  discountCodes: [
    {
      code: { type: String, trim: true },
      percentage: { type: Number, default: 0 },
    }
  ]
});

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
