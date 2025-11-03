const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const Plan = require('../models/Plan')
const Subject=require("../models/Subject")
const Quizes=require("../models/Quizes")
const PracticeAnswer = require("../models/PracticeAnswer");
const {hideConsoleLogInProduction}=require("../lib/helper")
//--get an existing plan
router.get('/', async (req, res) => {
    try {
        const { user_id, subject_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ message: "user_id is required" });
        }

        let existingPlan;
        if (subject_id) {
            existingPlan = await Plan.findOne({ user_id, subject_id });
        } else {
            // Fallback: return the most recent plan for the user if subject_id is not provided
            existingPlan = await Plan.findOne({ user_id }).sort({ createdAt: -1 });
        }

        if (existingPlan) {
            return res.json(existingPlan);
        }

        return res.status(404).json({ message: "No plan found" });
    } catch (error) {
        hideConsoleLogInProduction("Error fetching plan:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// Helper functions
function validateQuestionFormat(question, context) {
  const defaultQuestion = {
    question: `Question about ${context}`,
    options: [
      { text: "Correct answer", correct: true },
      { text: "Incorrect option A", correct: false },
      { text: "Incorrect option B", correct: false },
      { text: "Incorrect option C", correct: false }
    ],
    explanation: "This question tests understanding of key concepts.",
    points: 1,
    difficulty: "medium"
  };

  if (!question || !question.question || !question.options) {
    return defaultQuestion;
  }

  // Ensure exactly one correct answer
  const correctAnswers = question.options.filter(opt => opt.correct === true);
  if (correctAnswers.length !== 1) {
    question.options = question.options.map((opt, index) => ({
      ...opt,
      correct: index === 0
    }));
  }

  // Ensure we have exactly 4 options
  if (question.options.length !== 4) {
    question.options = defaultQuestion.options;
  }

  return {
    ...defaultQuestion,
    ...question,
    points: question.points || 1,
    difficulty: question.difficulty || "medium"
  };
}

function generateWeeklyQuiz(topic, subject, weekNumber) {
  return [
    {
      question: `What is the main focus of ${topic} in ${subject}?`,
      options: [
        { text: "Understanding fundamental concepts and principles", correct: true },
        { text: "Memorizing advanced formulas", correct: false },
        { text: "Learning historical background only", correct: false },
        { text: "Focusing on unrelated topics", correct: false }
      ],
      explanation: `This week focuses on building a strong foundation in ${topic}.`,
      points: 1,
      difficulty: "easy"
    },
    {
      question: `Which approach is most effective for learning ${topic}?`,
      options: [
        { text: "Regular practice with varied examples", correct: true },
        { text: "Cramming all material in one session", correct: false },
        { text: "Avoiding practice exercises", correct: false },
        { text: "Focusing only on theory", correct: false }
      ],
      explanation: "Consistent practice with different types of problems enhances understanding.",
      points: 2,
      difficulty: "medium"
    }
  ];
}

function generatePracticeExams(subject) {
  return [
    {
      exam_title: `Mid-Term ${subject.subject_name} Assessment`,
      duration: "60 minutes",
      instructions: "Answer all questions. Choose the best answer for each multiple choice question.",
      sections: [
        {
          section_title: "Multiple Choice Questions",
          description: "Select the best answer for each question.",
          questions: [
            {
              question: `What is the fundamental principle underlying ${subject.subject_name}?`,
              options: [
                { text: "The core concept that forms the basis of understanding", correct: true },
                { text: "A minor detail mentioned in the textbook", correct: false },
                { text: "An advanced application technique", correct: false },
                { text: "An unrelated scientific theory", correct: false }
              ],
              explanation: "Understanding fundamental principles is crucial for mastering any subject.",
              points: 3,
              difficulty: "medium"
            },
            {
              question: `Which approach is most effective for learning ${subject.subject_name}?`,
              options: [
                { text: "Regular practice with varied examples", correct: true },
                { text: "Cramming all material in one session", correct: false },
                { text: "Avoiding practice exercises", correct: false },
                { text: "Focusing only on theory", correct: false }
              ],
              explanation: "Consistent practice with different types of problems enhances understanding.",
              points: 2,
              difficulty: "easy"
            },
            {
              question: `What is the best way to prepare for ${subject.subject_name} exams?`,
              options: [
                { text: "Create a study schedule and stick to it", correct: true },
                { text: "Study only the night before", correct: false },
                { text: "Skip practice questions", correct: false },
                { text: "Focus only on memorization", correct: false }
              ],
              explanation: "A structured study plan with regular practice is the most effective approach.",
              points: 2,
              difficulty: "easy"
            }
          ]
        }
      ],
      passing_score: 70,
      total_points: 20
    },
    {
      exam_title: `Final ${subject.subject_name} Assessment`,
      duration: "90 minutes",
      instructions: "Answer all questions carefully. Choose the best answer for each multiple choice question.",
      sections: [
        {
          section_title: "Advanced Concepts",
          description: "Test your understanding of advanced topics.",
          questions: [
            {
              question: `What is the most important skill for mastering ${subject.subject_name}?`,
              options: [
                { text: "Critical thinking and problem-solving", correct: true },
                { text: "Memorizing facts and formulas", correct: false },
                { text: "Reading quickly", correct: false },
                { text: "Avoiding difficult topics", correct: false }
              ],
              explanation: "Critical thinking and problem-solving are essential for mastering any subject.",
              points: 4,
              difficulty: "hard"
            },
            {
              question: `How should you approach complex problems in ${subject.subject_name}?`,
              options: [
                { text: "Break them down into smaller parts", correct: true },
                { text: "Skip them entirely", correct: false },
                { text: "Guess randomly", correct: false },
                { text: "Copy from others", correct: false }
              ],
              explanation: "Breaking complex problems into manageable parts is a key problem-solving strategy.",
              points: 3,
              difficulty: "medium"
            }
          ]
        }
      ],
      passing_score: 75,
      total_points: 25
    }
  ];
}

function enhancePlanWithExams(planJSON, subject) {
  // Ensure weekly_quiz exists for each week
  if (planJSON.weekly_plan) {
    planJSON.weekly_plan.forEach((week, index) => {
      if (!week.weekly_quiz) {
        week.weekly_quiz = generateWeeklyQuiz(week.topic, subject.subject_name, index + 1);
      } else {
        week.weekly_quiz = week.weekly_quiz.map(question => 
          validateQuestionFormat(question, week.topic)
        );
      }
    });
  }

  // Ensure practice_exams exist
  if (!planJSON.practice_exams || planJSON.practice_exams.length === 0) {
    planJSON.practice_exams = generatePracticeExams(subject);
  } else {
    planJSON.practice_exams.forEach(exam => {
      if (exam.sections) {
        exam.sections.forEach(section => {
          if (section.questions) {
            section.questions = section.questions.map(question =>
              validateQuestionFormat(question, exam.exam_title)
            );
          }
        });
      }
    });
  }

  return planJSON;
}

function createEnhancedFallbackPlan(subject) {
  const weeklyPlan = Array.from({length: 8}, (_, weekIndex) => ({
    week: weekIndex + 1,
    topic: `Week ${weekIndex + 1}: ${subject.subject_name} Fundamentals`,
    daily_tasks: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => ({
      day,
      task: `Study ${subject.subject_name} concepts`,
      examples: ["Review basic principles", "Practice with examples", "Complete exercises"]
    })),
    key_learning_outcomes: ["Understand basic concepts", "Complete practice exercises"],
    weekly_quiz: generateWeeklyQuiz(`Week ${weekIndex + 1} Topics`, subject.subject_name, weekIndex + 1)
  }));

  return {
    overview: {
      summary: `Comprehensive study plan for ${subject.subject_name} with exam preparation`,
      level: `${subject.education_level} - ${subject.class_level}`,
      duration: "8 weeks"
    },
    weekly_plan: weeklyPlan,
    resources: {
      textbooks: [`${subject.subject_name} Textbook`],
      online_platforms: ["Khan Academy", "YouTube"],
      youtube_channels: ["Educational Channels"]
    },
    tips: {
      daily_study_habits: ["Study consistently", "Take breaks", "Review regularly"],
      exam_strategies: ["Practice past papers", "Time management"],
      mental_wellbeing_advice: ["Get enough sleep", "Stay hydrated"]
    },
    practice_exams: generatePracticeExams(subject)
  };
}

// Main route handler
router.post("/", async (req, res) => {
  try {
    const { subject_id, user_id } = req.body;

    console.log("🔍 Plan generation request received:", { subject_id, user_id });

    if (!subject_id || !user_id) {
      return res.status(400).json({ message: "subject_id and user_id are required" });
    }

    // 1️⃣ Get subject details
    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // 2️⃣ Check if plan already exists
    const existingPlan = await Plan.findOne({ subject_id, user_id });
    if (existingPlan) {
      console.log("📘 Plan already exists, returning existing plan");
      return res.status(200).json({ message: "Plan already exists", plan: existingPlan });
    }

    // 3️⃣ Validate Gemini API Key
    if (!process.env.GEMINI_API_KEY) {
      hideConsoleLogInProduction("❌ GEMINI_API_KEY is not configured");
      return res.status(500).json({ 
        error: "AI service configuration error",
        details: "GEMINI_API_KEY environment variable is missing" 
      });
    }

    // 4️⃣ Enhanced AI Prompt with Exam Questions
    const prompt = `
You are an expert education planner and examiner. 
Generate a detailed study plan for the subject "${subject.subject_name}" 
for a student in ${subject.education_level} - ${subject.class_level}.

The plan must be structured and include the following sections:

1. overview - A short summary of the plan's goals, level, and duration.
2. weekly_plan - An array of weeks (8-12 weeks). Each week must have:
   - week (number)
   - topic (main focus)
   - daily_tasks - 7 objects (one per study day) with:
       - "day" (Monday-Sunday)
       - "task" (main activity)
       - "examples" (5-10 short examples/exercises)
   - key_learning_outcomes - 3-5 bullet points
   - weekly_quiz - 5-10 multiple choice questions covering the week's topics
3. resources - Recommended textbooks, online platforms, YouTube channels.
4. tips - Daily study habits, exam strategies, mental wellbeing advice.
5. practice_exams - 2-3 full practice exams with comprehensive questions

IMPORTANT FORMAT FOR QUESTIONS:
- Each quiz question must be a multiple choice question with 4 options (A, B, C, D)
- Include the correct answer marked with "correct": true
- Questions should test understanding, application, and analysis
- Include "points" for each question (1 for easy, 2 for medium, 3 for hard)
- Include "difficulty" level (easy, medium, hard)

EXAMPLE QUESTION FORMAT:
{
  "question": "What is the capital of France?",
  "options": [
    {"text": "London", "correct": false},
    {"text": "Berlin", "correct": false},
    {"text": "Paris", "correct": true},
    {"text": "Madrid", "correct": false}
  ],
  "explanation": "Paris is the capital and most populous city of France.",
  "points": 1,
  "difficulty": "easy"
}

Return ONLY valid JSON, no additional text or markdown.`;

   hideConsoleLogInProduction("🤖 Calling Gemini API...");

    // 5️⃣ Call Gemini API
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });

    let aiResponse;
    try {
      aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8000,
        },
      });
     hideConsoleLogInProduction("✅ Gemini API call successful");
    } catch (aiError) {
      hideConsoleLogInProduction("❌ Gemini API Error:", aiError);
      return res.status(500).json({
        error: "AI Service Error",
        details: aiError.message
      });
    }

    // 6️⃣ Process AI Response
    const planText = aiResponse.text.trim();
    hideConsoleLogInProduction("📄 Raw AI Response received");

    let planJSON;
    try {
      const cleanedText = planText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();

      planJSON = JSON.parse(cleanedText);
      hideConsoleLogInProduction("✅ JSON parsing successful");
      
      // Validate and enhance the structure
      planJSON = enhancePlanWithExams(planJSON, subject);
      
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      planJSON = createEnhancedFallbackPlan(subject);
      hideConsoleLogInProduction("🔄 Using enhanced fallback plan");
    }

    // 7️⃣ Save Main Study Plan
    const newPlan = new Plan({
      subject_id,
      user_id,
      plan: planJSON,
      status: "todo",
    });

      await newPlan.save();
      console.log("💾 Study plan saved successfully");

    
    res.status(201).json({ 
      message: "Study plan created with quizzes and practice exams", 
      plan: newPlan,
    });

  } catch (error) {
    hideConsoleLogInProduction("🔥 Plan generation failed:", error);
    res.status(500).json({
      error: "Failed to generate study plan",
      details: error.message
    });
  }
});

// Route to get quizzes for a subject
router.get("/quizzes/:subject_id", async (req, res) => {
  try {
    const { subject_id } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const quizzes = await Quizes.find({ 
      subject_id, 
      user_id 
    }).sort({ createdAt: 1 });

    const weeklyQuizzes = quizzes.filter(q => q.quizes.type === "weekly_quiz");
    const practiceExams = quizzes.filter(q => q.quizes.type === "practice_exam");

    res.json({
      weekly_quizzes: weeklyQuizzes,
      practice_exams: practiceExams,
      total_quizzes: quizzes.length
    });

  } catch (error) {
    hideConsoleLogInProduction("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// Route to get all practice exams for a user (across all subjects)
// ✅ Fetch quizzes by subject for a user
// 🔹 Fetch all quizzes by user_id
router.get("/quizzes", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const quizzes = await Quizes.find({ user_id }).sort({ createdAt: 1 });
    const weeklyQuizzes = quizzes.filter(q => q.quizes.type === "weekly_quiz");
    const practiceExams = quizzes.filter(q => q.quizes.type === "practice_exam");

    res.json({
      weekly_quizzes: weeklyQuizzes,
      practice_exams: practiceExams,
      total_quizzes: quizzes.length,
    });
  } catch (error) {
    hideConsoleLogInProduction("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// 🔹 Fetch only practice exams
router.get("/practice-exams", async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    // Fetch all plans for this user
   // const plans = await Plan.find({ user_id });
const plans = await Plan.find({ user_id }).populate("subject_id", "subject_name");

    if (!plans || plans.length === 0) {
      return res.status(404).json({ message: "No plans found for this user." });
    }

    // Combine weekly quizzes from all subjects
    const allExams = plans.flatMap((plan) => {
      const weeklyPlan = plan?.plan?.weekly_plan || [];
      return weeklyPlan.flatMap((week) =>
        (week.weekly_quiz || []).map((quiz) => ({
          ...quiz,
          week: week.week,
          topic: week.topic,
        subject: plan.subject_id?.subject_name || "Unknown Subject",
        }))
      );
    });
    res.json({
      status: true,
      total_exams: allExams.length,
      total_subjects: plans.length,
      practice_exams: allExams,
      subject_id: plans.map(p => p.subject_id),
    });
  } catch (error) {
    hideConsoleLogInProduction("Error fetching practice exams:", error);
    res.status(500).json({ error: "Failed to fetch practice exams" });
  }
});

///  route to save quizes based on subject
// Save submitted answers
router.post("/submit", async (req, res) => {
  try {
    const { user_id, subject_id, answers } = req.body;

    if (!user_id || !subject_id || !answers?.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optional: remove old answers to allow resubmission
    await PracticeAnswer.deleteMany({ user_id, subject_id });

    const savedAnswers = await PracticeAnswer.insertMany(
      answers.map((ans) => ({
        ...ans,
        user_id,
        subject_id,
      }))
    );

    res.status(201).json({
      message: "✅ Answers submitted successfully!",
      total_submitted: savedAnswers.length,
    });
  } catch (error) {
    hideConsoleLogInProduction("❌ Error saving answers:", error);
    res.status(500).json({ error: "Failed to submit answers" });
  }
});


module.exports = router;
