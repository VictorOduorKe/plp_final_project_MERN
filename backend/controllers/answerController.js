const Answer = require("../models/Answers");
const Plan = require("../models/Plan");
const Subject = require("../models/Subject");
const Quiz = require("../models/Quizes");
const mongoose = require("mongoose");
// ✅ Save user answers and calculate score
exports.submitAnswers = async (req, res) => {
  try {
    const { user_id, subject_id, exam_id, answers } = req.body;

    // Basic validation
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ message: "Valid User ID is required." });
    }
    if (!subject_id) {
      return res.status(400).json({ message: "Subject ID is required." });
    }
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Valid answers array is required." });
    }

    // Validate each answer has required fields
    const invalidAnswers = answers.filter(a => !a.question_text);
    if (invalidAnswers.length > 0) {
      return res.status(400).json({ 
        message: "Some answers are missing required fields.",
        invalidCount: invalidAnswers.length
      });
    }
    
    // Check if there are any answered questions
    const answeredQuestions = answers.filter(a => a.selected_option && a.selected_option !== "Not answered");
    if (answeredQuestions.length === 0) {
      return res.status(400).json({ 
        message: "Please answer at least one question before submitting.",
      });
    }

    // Compute score - fetch correct answers from Quizes model when missing
    let correctCount = 0;
    // Only include valid ObjectId strings when querying the Quizes collection
    const allQuestionIds = answers.map((a) => a.question_id).filter(Boolean);
    const questionIds = allQuestionIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    const invalidQuestionIds = allQuestionIds.filter((id) => id && !mongoose.Types.ObjectId.isValid(id));
    if (invalidQuestionIds.length > 0) {
      console.warn('Skipping invalid question_ids (not ObjectId):', invalidQuestionIds);
    }
    const quizCorrectMap = {};
    if (questionIds.length > 0) {
      // fetch quizzes in one query
      const quizDocs = await Quiz.find({ _id: { $in: questionIds } }).lean();
      quizDocs.forEach((q) => {
        // Determine correct answer from options or a correct_answer field
        const correctOpt = Array.isArray(q.options) ? q.options.find(o => o.is_correct) : null;
        quizCorrectMap[q._id.toString()] = (correctOpt && correctOpt.text) || q.correct_answer || 'Not provided';
      });
    }

    // If some answers are embedded in Plan documents (practice exams or weekly_quiz),
    // build a map from question_text -> correct option text so we can grade those too.
    const planCorrectMap = {};
    try {
      // Only attempt plan lookup if subject_id is a valid ObjectId
      if (subject_id && mongoose.Types.ObjectId.isValid(subject_id)) {
        const plans = await Plan.find({ subject_id }).lean();
        plans.forEach((p) => {
          const content = p.plan || {};
          // weekly_plan -> weekly_quiz
          if (Array.isArray(content.weekly_plan)) {
            content.weekly_plan.forEach(wk => {
              if (Array.isArray(wk.weekly_quiz)) {
                wk.weekly_quiz.forEach(q => {
                  const correctOpt = Array.isArray(q.options) ? q.options.find(o => o.correct || o.is_correct) : null;
                  if (q.question) planCorrectMap[(q.question || '').trim().toLowerCase()] = (correctOpt && correctOpt.text) || q.correct_answer || 'Not provided';
                });
              }
            });
          }

          // practice_exams -> sections -> questions
          if (Array.isArray(content.practice_exams)) {
            content.practice_exams.forEach(exam => {
              if (Array.isArray(exam.sections)) {
                exam.sections.forEach(section => {
                  if (Array.isArray(section.questions)) {
                    section.questions.forEach(q => {
                      const correctOpt = Array.isArray(q.options) ? q.options.find(o => o.correct || o.is_correct) : null;
                      if (q.question) planCorrectMap[(q.question || '').trim().toLowerCase()] = (correctOpt && correctOpt.text) || q.correct_answer || 'Not provided';
                    });
                  }
                });
              }
            });
          }
        });
      }
    } catch (e) {
      console.warn('Failed to build planCorrectMap:', e.message || e);
    }

    const answerDocs = answers.map((ans) => {
      // resolve correct answer: prefer submitted value, then quiz map by id, then plan map by question_text
      let correct_answer = 'Not provided';
      if (ans.correct_answer && ans.correct_answer !== 'Not provided') {
        correct_answer = ans.correct_answer;
      } else if (ans.question_id && quizCorrectMap[ans.question_id]) {
        correct_answer = quizCorrectMap[ans.question_id];
      } else if (ans.question_text) {
        const key = (ans.question_text || '').trim().toLowerCase();
        if (planCorrectMap[key]) correct_answer = planCorrectMap[key];
      }
      const hasAnswer = ans.selected_option && ans.selected_option !== 'Not answered';
      const isCorrect = hasAnswer && correct_answer && ans.selected_option === correct_answer;
      if (isCorrect) correctCount += 1;

      // Log answer details for debugging
      console.log('Answer validation:', {
        question: ans.question_text,
        selected: ans.selected_option,
        correct: correct_answer,
        isCorrect,
        hasAnswer
      });

      return {
        user_id,
        subject_id,
        exam_id,
        question_id: ans.question_id,
        question_text: ans.question_text,
        selected_option: ans.selected_option,
        correct_answer,
        is_correct: isCorrect,
        score: isCorrect ? 1 : 0,
      };
    });

    // Save all answers using upsert so re-submissions update previous answers
    if (answerDocs.length > 0) {
      const bulkOps = answerDocs.map((doc) => ({
        updateOne: {
          filter: {
            user_id: doc.user_id,
            subject_id: doc.subject_id,
            question_id: doc.question_id,
          },
          update: { $set: doc },
          upsert: true,
        },
      }));

      await Answer.bulkWrite(bulkOps);
    }

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
