const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    phone: { type: Number, required: true },
    account_number: { type: Number },
    method: {
      type: String,
      enum: ["mpesa", "bank-transfer", "credit-card"],
      default: "mpesa",
    },
    status: {
      type: String,
      enum: ["paid", "cancelled", "pending"],
      default: "pending",
    },
    reference: { type: String, unique: true },
    package: {
      type: String,
      enum: ["free", "basic", "premium", "pro"],
      required: true,
    },
    expiresAt: { type: Date } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
