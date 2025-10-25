// models/PracticeAnswer.js
const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  text: String,
  isCorrect: { type: Boolean, default: false }, // optional (if you want to verify correctness)
});

const AnswerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    question_id: {
      type: String, // or ObjectId if stored in DB
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    selected_option: {
      type: String,
      required: true,
    },
    is_correct: {
      type: Boolean,
      default: false,
    },
    week: String,
    topic: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PracticeAnswer", AnswerSchema);
