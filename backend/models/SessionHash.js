// models/SessionHash.js
const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    hash_token: {
      type: String,
      required: true
    },
    expires_at: {
      type: Date,
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SessionToken", SessionSchema);
