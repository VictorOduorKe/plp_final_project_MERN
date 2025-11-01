const express = require("express");
const User = require("../models/User");
const OTP = require("../models/Otp");
const bcrypt = require("bcrypt");
const router = express.Router();
const { hideConsoleLogInProduction } = require("../lib/helper")
router.post("/register", async (req, res) => {
  try {
    const { first_name, second_name, phone_number, email, password, confirmPassword} = req.body;

    // ✅ 1. Validate required fields
    if (!first_name || !second_name || !phone_number || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ 2. Password match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // ✅ 3. Password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must include uppercase, lowercase, number, special character, and be 8+ chars long",
      });
    }

    // ✅ 4. Phone format
    const phoneRegex = /^(?:07|01)\d{8}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // ✅ 5. Email exists?
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ 6. Find OTP record
    /*const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ error: "OTP not found or not requested" });
    }*/

    // ✅ 7. Check expiration
    /*if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    // ✅ 8. Verify OTP
    const isOtpValid = await bcrypt.compare(otp.toString(), otpRecord.otp_hash);
    if (!isOtpValid) {
      return res.status(400).json({ error: "Invalid OTP. Registration stopped." });
    }*/

    // ✅ 9. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      first_name,
      second_name,
      phone_number,
      email,
      password: hashedPassword
    });

    // ✅ 10. Delete OTP after success
    /*await OTP.deleteOne({ email });*/

    return res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        id: newUser._id,
        first_name: newUser.first_name,
        second_name: newUser.second_name,
        email: newUser.email,
      },
    });

  } catch (error) {
    hideConsoleLogInProduction("❌ Registration error:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
});

module.exports = router;
