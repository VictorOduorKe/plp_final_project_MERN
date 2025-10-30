// backend/routes/subjectRoutes.js
const express = require("express");
const Subject = require("../models/Subject.js");
const Payments=require('../models/Payment.js')
const Plan =require("../models/Plan.js")
const router = express.Router();
const {protect,authorizeRoles}=require('../middleware/authMiddleware.js');
const verifyToken=require("../lib/jwt.lib").verifyToken;
// ✅ Get subjects by user ID
router.get("/subjects", protect, async (req, res) => {
  try {
    const { user_id } = req.query;
    console.log('Fetching subjects for user:', user_id);
    
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Verify the authenticated user is requesting their own subjects
    if (user_id !== req.user.id.toString()) {
      console.log('User ID mismatch:', { requestedId: user_id, authenticatedId: req.user.id });
      return res.status(403).json({ message: "Not authorized to access these subjects" });
    }

    const subjects = await Subject.find({ user_id });
    console.log('Subjects found:', subjects.length);
    res.json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add a new subject
router.post("/subject", protect, authorizeRoles("user", "admin"), async (req, res) => {
  try {
    const { subject_name, education_level, class_level, user_id } = req.body;

    // Validate required fields
    if (!subject_name || !education_level || !class_level || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Count number of subjects the user already has
    const totalSubjects = await Subject.countDocuments({ user_id });

    // ✅ Check if user has a payment
    const paymentExists = await Payments.exists({ user_id, status: "paid" });

    // ✅ Restrict free users to 2 subjects max
    if (!paymentExists && totalSubjects >= 2) {
      return res.status(403).json({
        message: "You have reached the free subject limit. Please upgrade to add more subjects."
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
    return res.status(201).json(savedSubject);

  } catch (err) {
    console.error("❌ Error adding subject:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get subjects by user ID
router.get("/subjects", protect, async (req, res) => {
  try {
    const { user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const subjects = await Subject.find({ user_id });
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
