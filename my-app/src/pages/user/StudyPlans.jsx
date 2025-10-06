import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudyPlans = () => {
  const navigate = useNavigate();

  // 📊 Sample data (you’ll later fetch this from backend or generate dynamically)
  const [plans, setPlans] = useState([
    {
      id: 1,
      subject: "Mathematics",
      level: "Form 2",
      plan: "Study algebra and quadratic equations. Practice solving equations daily and complete 5 problems from the recommended book every evening.",
      progress: 65,
    },
    {
      id: 2,
      subject: "Biology",
      level: "Form 3",
      plan: "Revise cell structure and photosynthesis. Watch one video lesson per week and take notes for review before exams.",
      progress: 40,
    },
  ]);

  // 📈 Simulate updating progress
  const updateProgress = (id) => {
    setPlans(
      plans.map((p) =>
        p.id === id ? { ...p, progress: Math.min(p.progress + 10, 100) } : p
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-violet-700 mb-8">📊 Study Plans</h1>

      {plans.length === 0 ? (
        <p className="text-gray-500 text-lg">No study plans generated yet.</p>
      ) : (
        <div className="space-y-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white shadow-md rounded-lg p-6 border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-semibold text-gray-800">
                  📘 {plan.subject}
                </h2>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">
                  {plan.level}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{plan.plan}</p>

              {/* 📊 Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{plan.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-violet-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${plan.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* ⚡ Actions */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => navigate("/user/quizzes")}
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-semibold transition"
                >
                  🧠 Go to Quizzes
                </button>

                <button
                  onClick={() => navigate("/user/notes")}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  📚 View Notes
                </button>

                <button
                  onClick={() => updateProgress(plan.id)}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                >
                  ✅ Mark Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyPlans;
