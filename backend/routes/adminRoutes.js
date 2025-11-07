const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { protect, authorizeRoles } = require("../middleware/authMiddleware.js");
const { hideConsoleLogInProduction } = require("../lib/helper")
// ✅ Admin: Get all users
router.get("/admin/users", protect, authorizeRoles("admin"), async (req, res) => {
  
  try {

    const users = await User.find().select("-password"); // Hide password
    res.status(200).json(users);
  } catch (error) {
    hideConsoleLogInProduction("Error fetching users:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

// ✅ Admin: Delete a user
router.delete("/admin/users/:id", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log("Deleting user:", user);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    hideConsoleLogInProduction("Error deleting user:", error);
    res.status(500).json({ message: "Server error deleting user" });
  }
});

// ✅ Admin: Toggle user status (active / blocked)
router.patch("/admin/users/:id/status", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "active" ? "blocked" : "active";
    await user.save();

    res.status(200).json({ message: `User status updated to ${user.status}`, user });
  } catch (error) {
    hideConsoleLogInProduction("Error updating user status:", error);
    res.status(500).json({ message: "Server error updating user status" });
  }
});

module.exports = router;
