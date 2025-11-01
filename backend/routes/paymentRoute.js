const express = require("express");
const Payment = require("../models/Payment");
const router = express.Router();
const crypto = require("crypto");
const axios = require("axios");
const { parse } = require("path");
const {hideConsoleLogInProduction}=require("../lib/helper");
router.post("/", async (req, res) => {
  try {
    const { user_id, phone, account_number, method, email, package } = req.body;

    if (!user_id || !phone || !email || !package) {
      return res.status(400).json({ message: "user_id, phone, email and package are required" });
    }

    // ✅ Block duplicate pending payments
    const existingPending = await Payment.findOne({ user_id, status: "pending" });
    if (existingPending) {
      return res.status(400).json({ message: "User already has a pending payment kindly contact for support" });
    }

    // ✅ Define amount server-side based on package
    let amount = 0;
    const pkg = package.toLowerCase().trim();
    if (pkg === "basic") amount = 500;
    else if (pkg === "premium") amount = 1200;
    else if (pkg === "pro") amount = 4000;
    else {
      return res.status(400).json({ message: "Invalid package selected" });
    }

    // ✅ Initiate payment with Paystack
    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Paystack uses kobo (1 NGN = 100 kobo)
        callback_url: "http://localhost:5173/user/payment-success",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { reference, authorization_url } = paystackRes.data.data;

    // ✅ Save payment to DB
    const payment = await Payment.create({
      user_id,
      amount,
      phone,
      account_number: account_number || "",
      method: method || "mpesa",
      status: "pending",
      reference,
      package: pkg,
    });

    return res.status(201).json({
      message: "Payment initiated successfully.",
      authorization_url,
      reference,
      payment,
    });
  } catch (error) {
    hideConsoleLogInProduction("Error creating payment:", error.response?.data || error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// 2. Webhook endpoint
router.post("/webhook", express.json({ type: "*/*" }), async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    // ✅ Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;
    const data = event.data;

    // ✅ Only handle successful payments
    if (event.event === "charge.success") {
      // ⚠️ Don't limit to "pending" — just find by reference
      let payment = await Payment.findOne({ reference: data.reference });

      if (!payment) {
        hideConsoleLogInProduction("❌ Payment not found for reference:", data.reference);
        return res.status(404).json({ message: "Payment record not found" });
      }

      // ✅ Normalize and calculate duration
      const pkg = payment.package?.toLowerCase().trim();
      let durationDays = 0;

      if (pkg === "basic") durationDays = 30;
      else if (pkg === "pro") durationDays = 90;
      else if (pkg === "premium") durationDays = 365;

      // 🛠️ Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      hideConsoleLogInProduction(`✅ Package: ${pkg}, Duration: ${durationDays} days, Expires: ${expiresAt}`);

      // ✅ Update all payment fields securely
      payment.status = "paid";
      payment.amount = payment.amount || (pkg === "basic" ? 500 : pkg === "pro" ? 4000 : 1200);
      payment.expiresAt = expiresAt;

      await payment.save();

      hideConsoleLogInProduction("✅ Payment updated successfully:", payment._id);

      return res.status(200).json({ message: "Payment confirmed", payment });
    }

    // If it's another event, acknowledge it but ignore
    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// 3. Payment status check
router.get("/status/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;
   hideConsoleLogInProduction(user_id)
    const payment = await Payment.findOne({ user_id, status:"paid" }).sort({ createdAt: -1 });
    
    if (!payment) {
       return res.status(200).json({ package: "free", message: "No active plan found",user_id });
    }

    // 🛠️ handle missing expiresAt gracefully
    if (!payment.expiresAt) {
      return res.status(200).json({
        package: payment.package,
        expired: false,
        message: `Your ${payment.package} plan is active (expiry date not set)`,
      });
    }

    const now = new Date();
    const isExpired = payment.expiresAt < now;

    if (isExpired) {
      return res.status(200).json({
        package: "free",
        expired: true,
        message: `Your ${payment.package} plan expired on ${payment.expiresAt.toDateString()}`,
      });
    }

    res.status(200).json({
      package: payment.package,
      expiresAt: payment.expiresAt,
      expired: false,
      message: `Your ${payment.package} plan is active until ${payment.expiresAt.toDateString()}`,
    });
  } catch (error) {
    hideConsoleLogInProduction("Status check error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// 4. Verify payment by reference
router.get("/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    // ✅ 1. Verify with Paystack
    const verifyRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = verifyRes.data.data;

    // ✅ 2. Only proceed if payment was successful
    if (data.status === "success") {
      // 🧠 Fetch existing payment record from your DB
      const payment = await Payment.findOne({ reference });
      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }

      // 🧠 Calculate expected amount and expiry based on package
      const pkg = payment.package?.toLowerCase().trim();
      let durationDays = 0;
      let expectedAmount = 0;

      if (pkg === "basic") {
        durationDays = 30;
        expectedAmount = 500 * 100; // amount in kobo
      } else if (pkg === "pro") {
        durationDays = 90;
        expectedAmount = 4000 * 100;
      } else if (pkg === "premium") {
        durationDays = 365;
        expectedAmount = 1200 * 100;
      } else {
        return res.status(400).json({ message: "Invalid package type" });
      }

      // ✅ 3. Double-check amount paid vs expected
      if (data.amount !== expectedAmount) {
        return res.status(400).json({
          message: "❌ Payment amount mismatch. Possible tampering detected.",
          expected: expectedAmount,
          received: data.amount,
        });
      }

      // 🧠 Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      // ✅ 4. Update payment record with status and expiry
      const updatedPayment = await Payment.findOneAndUpdate(
        { reference },
        {
          status: "paid",
          expiresAt,
        },
        { new: true }
      );

      return res.status(200).json({
        message: "✅ Payment verified successfully",
        payment: updatedPayment,
        expiresAt: updatedPayment.expiresAt,
      });
    }

    // ❌ If not successful
    return res.status(400).json({ message: "Payment not successful" });
  } catch (error) {
    hideConsoleLogInProduction(
      "Verification error:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
});


module.exports = router;
