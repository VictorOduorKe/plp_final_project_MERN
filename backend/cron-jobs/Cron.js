const cron = require("node-cron");
const Payment = require("../models/Payment");

// Runs daily at midnight
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  await Payment.updateMany(
    { status: "paid", expiresAt: { $lt: now } },
    { status: "cancelled" }
  );
  console.log("✅ Expired plans cancelled automatically");
});
