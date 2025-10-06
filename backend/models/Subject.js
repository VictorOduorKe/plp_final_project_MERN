const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema({
  subject_name: {
    type: String,
    required: true,
  },
  education_level: {
    type: String,
    enum: ["Primary", "Junior", "Senior", "College", "University"], // ✅ matches frontend
    required: true,
  },
  class_level: {
    type: String,
    enum: [
      "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
      "Grade 7", "Grade 8", "Grade 9",
      "Grade 10", "Grade 11", "Grade 12",
      "Certificate Level", "Diploma Level", "Higher Diploma",
      "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Postgraduate"
    ],
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }
});

module.exports = mongoose.model("Subject", SubjectSchema);
