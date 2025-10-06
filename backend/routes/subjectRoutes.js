// backend/routes/subjectRoutes.js
const express = require("express");
const Subject = require("../models/Subject.js");
const router = express.Router();
const {protect,authorizeRoles}=require('../middleware/authMiddleware.js')

// ✅ Add a new subject
router.post("/subject",protect, authorizeRoles("user", "admin"), async (req, res) => {
  try {
    const { subject_name, education_level, class_level, user_id } = req.body;

    if (!subject_name || !education_level || !class_level || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newSubject = new Subject({
      subject_name,
      education_level,
      class_level,
      user_id,
    });

    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (err) {
    console.error("❌ Error adding subject:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all subjects for a specific user
router.get("/subjects", protect, authorizeRoles("user", "admin"), async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const subjects = await Subject.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(subjects);
  } catch (err) {
    console.error("❌ Error fetching subjects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a subject
router.delete("/subjects/:id", protect, authorizeRoles("user", "admin"), async (req, res) => {
  try {
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting subject:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
