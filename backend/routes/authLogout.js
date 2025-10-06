const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  try {
    // Clear JWT cookie (if you were using cookies)
    res.clearCookie("token", { httpOnly: true, sameSite: "strict", secure: false });

    console.log("User logged out");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error during logout" });
  }
});

module.exports = router;
