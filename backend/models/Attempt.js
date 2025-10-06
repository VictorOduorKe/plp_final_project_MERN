const mongoose = require("mongoose");


const attemptSchema = new mongoose.Schema(
    {
        quiz_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quizes",
            required: true,
        },
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
        answers: { type: JSON, required: true },
        scores: { type: Number, required: true },
        status: {
            type: String,
            enum: ["failed", "passed", "pending"],
            default: "pending"
        }
    },
    { timestamps: true }
);

const Attempt = mongoose.model("Attempt", attemptSchema);

module.exports = Attempt;