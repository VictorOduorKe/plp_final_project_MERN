const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject_id: {
      type: String,  // Changed to String to handle both ObjectId and subject names
      required: true,
    },
    exam_id: {
      type: String,  // Changed to String to handle both ObjectId and practice exam IDs
      required: true,
    },
    question_id: {
      type: String, // could also be ObjectId if you store questions separately
      required: true,
    },
    question_text: {
      type: String,
      required: true,
    },
    selected_option: {
      type: String,
      required: true,
    },
    correct_answer: {
      type: String,
      required: true,
      default: 'Not provided', // Provide a default value
    },
    is_correct: {
      type: Boolean,
      required: true,
    },
    score: {
      type: Number,
      default: 0, // could be 1 for correct, 0 for wrong
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Answer", answerSchema);
