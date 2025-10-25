const Answer = require("../models/Answers");
const Plan = require("../models/Plan");
const Subject = require("../models/Subject");

// ✅ Save user answers and calculate score
exports.submitAnswers = async (req, res) => {
  try {
    const { user_id, subject_id, exam_id, answers } = req.body;

    if (!user_id || !subject_id || !exam_id || !answers || answers.length === 0) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Compute score
    let correctCount = 0;
    const answerDocs = answers.map((ans) => {
      const isCorrect = ans.selected_option === ans.correct_answer;
      if (isCorrect) correctCount += 1;

      return {
        user_id,
        subject_id,
        exam_id,
        question_id: ans.question_id,
        question_text: ans.question_text,
        selected_option: ans.selected_option,
        correct_answer: ans.correct_answer,
        is_correct: isCorrect,
        score: isCorrect ? 1 : 0,
      };
    });

    // Save all answers
    await Answer.insertMany(answerDocs);

    res.status(201).json({
      status: true,
      message: "Answers submitted successfully.",
      total_questions: answers.length,
      correct_answers: correctCount,
      total_score: correctCount,
    });
  } catch (error) {
    console.error("Error saving answers:", error);
    res.status(500).json({ error: "Failed to submit answers." });
  }
};

// ✅ Get total score by subject
exports.getSubjectScore = async (req, res) => {
  try {
    const { user_id, subject_id } = req.query;

    if (!user_id || !subject_id) {
      return res.status(400).json({ message: "user_id and subject_id are required" });
    }

    const results = await Answer.find({ user_id, subject_id });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No answers found for this subject." });
    }

    const totalQuestions = results.length;
    const correctAnswers = results.filter((a) => a.is_correct).length;

    res.json({
      status: true,
      subject_id,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      total_score: correctAnswers,
    });
  } catch (error) {
    console.error("Error fetching subject score:", error);
    res.status(500).json({ error: "Failed to fetch score." });
  }
};
