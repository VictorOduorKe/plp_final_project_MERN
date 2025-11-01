// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken=require("../lib/jwt.lib").generateToken;
const verifyToken=require("../lib/jwt.lib").verifyToken;
const router = express.Router();
const {hideConsoleLogInProduction}=require("../lib/helper")
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    hideConsoleLogInProduction("Login attempt:", req.body, Date());

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    
    // 4️⃣ Generate JWT
    /*const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );*/

    const token = generateToken(res, { id: user._id, role: user.role }, "12h");

    hideConsoleLogInProduction('Cookie being set:', {
      token: token.slice(0, 10) + '...',
      cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: '.onrender.com',
        path: '/'
      }
    });

    // 5️⃣ Return token and user info
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        first_name: user.first_name,
        second_name: user.second_name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    hideConsoleLogInProduction("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
