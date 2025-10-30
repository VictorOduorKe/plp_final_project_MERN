const express = require("express");
const router = express.Router();

// POST /auth/logout
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // ✅ important — cookie path must match
      maxAge: 0,
    });

    console.log("User logged out");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error during logout" });
  }
});
module.exports = router;