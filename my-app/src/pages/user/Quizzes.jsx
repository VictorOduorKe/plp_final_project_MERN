import { useState } from "react";

const Quizzes = () => {
  // 📚 Sample quizzes — you’ll later fetch these from your backend or Gemini
  const [quizzes] = useState([
    {
      id: 1,
      subject: "Mathematics",
      question: "What is the solution to the equation 2x + 5 = 15?",
      options: ["x = 10", "x = 5", "x = 7.5", "x = 20"],
      correct: "x = 5",
    },
    {
      id: 2,
      subject: "Biology",
      question: "Which organelle is responsible for photosynthesis?",
      options: ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"],
      correct: "Chloroplast",
    },
    {
      id: 3,
      subject: "Physics",
      question: "What is the SI unit of force?",
      options: ["Joule", "Pascal", "Newton", "Watt"],
      correct: "Newton",
    },
  ]);

  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  // 📊 Handle answer selection
  const handleAnswer = (quizId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [quizId]: answer,
    }));
  };

  // ✅ Check score
  const checkScore = () => {
    let total = 0;
    quizzes.forEach((q) => {
      if (answers[q.id] === q.correct) total++;
    });
    setScore(total);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-violet-700 mb-6">🧠 Quizzes</h1>

      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="bg-white p-6 shadow-md rounded-lg mb-6 border hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            📘 {quiz.subject}
          </h2>
          <p className="text-gray-700 text-lg mb-4">{quiz.question}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quiz.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition ${
                  answers[quiz.id] === option
                    ? "bg-violet-100 border-violet-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name={`quiz-${quiz.id}`}
                  value={option}
                  checked={answers[quiz.id] === option}
                  onChange={() => handleAnswer(quiz.id, option)}
                  className="text-violet-600 focus:ring-violet-500"
                />
                <span className="text-gray-800">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center mt-8">
        <button
          onClick={checkScore}
          className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-lg rounded-lg transition"
        >
          ✅ Submit & Check Score
        </button>

        {score !== null && (
          <div className="mt-6 text-xl font-semibold text-gray-800">
            📊 Your Score:{" "}
            <span className="text-violet-700">
              {score} / {quizzes.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
