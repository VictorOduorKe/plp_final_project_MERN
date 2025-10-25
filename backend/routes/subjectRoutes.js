// backend/routes/subjectRoutes.js
const express = require("express");
const Subject = require("../models/Subject.js");
const Payments=require('../models/Payment.js')
const Plan =require("../models/Plan.js")
const router = express.Router();
const {protect,authorizeRoles}=require('../middleware/authMiddleware.js')

// ✅ Add a new subject
// ✅ Add a new subject
router.post("/subject", protect, authorizeRoles("user", "admin"), async (req, res) => {
  try {
    const { subject_name, education_level, class_level, user_id } = req.body;

    // Check for missing fields
    if (!subject_name || !education_level || !class_level || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if payment exists
    const checkPayment = await Payments.aggregate([
      {
        $match: {
          user_id: user_id,
          status: "paid"
        }
      }
    ]);

    // ✅ Count number of subjects for the user
    const countNumberOfSubjects = await Subject.aggregate([
      { $match: { user_id: user_id } },
      { $count: "totalSubjects" }
    ]);

    const totalSubjects = countNumberOfSubjects.length > 0 ? countNumberOfSubjects[0].totalSubjects : 0;

    // ✅ Restrict user if unpaid and already has 2+ subjects
    if (totalSubjects >= 2 && checkPayment.length === 0) {
      return res.status(403).json({
        message: "You are not allowed to add more subjects without payment."
      });
    }

    // ✅ Save new subject
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
// ✅ Delete a subject
router.delete("/subjects/:id", protect, authorizeRoles("user", "admin"), async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the subject
    await Subject.findByIdAndDelete(id);

    // Delete all plans linked to that subject
    await Plan.deleteMany({ subject_id: id });

    res.status(200).json({ message: "Subject and related plans deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting subject:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
