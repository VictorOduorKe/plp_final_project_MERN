const express = require("express");
const router = express.Router();
const { submitAnswers, getSubjectScore } = require("../controllers/answerController");

// POST — Submit answers and auto-calculate score
router.post("/submit", submitAnswers);

// GET — Get total score by subject
router.get("/score", getSubjectScore);

module.exports = router;
