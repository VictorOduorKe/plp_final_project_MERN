import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPlan } from "../../context/FetchPlan";
import { hideConsoleLogInProduction } from "../../context/hideLogs";
// import { hideConsoleLogInProduction } from "./hideLogs"; --- IGNORE ---
const StudyPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  // ✅ Get user_id from localStorage
  const storedUser = localStorage.getItem("user");
  const user_id = storedUser ? JSON.parse(storedUser)?.id : null;

  // ✅ Fetch plan when component mounts
  useEffect(() => {
    const loadPlans = async () => {
      if (!user_id) return;
      try {
        const data = await fetchPlan(user_id); // ✅ this is the full plan object
        hideConsoleLogInProduction("Fetched Plan:", data);

        // Wrap in array for mapping
        if (data) {
          // Backend returns a Plan document with shape: { _id, subject_id, user_id, plan: {...} }
          // Normalize to merge top-level ids with inner plan content for rendering
          const normalized = { ...data.plan, _id: data._id };
          setPlans([normalized]);
        }
      } catch (error) {
        hideConsoleLogInProduction("Failed to load plans:", error);
      }
    };

    loadPlans();
  }, [user_id]);


  // ✅ Update progress function
  const updateProgress = (id) => {
    setPlans((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, progress: Math.min((p.progress || 0) + 10, 100) } : p
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
              key={plan._id}
              className="bg-white shadow-md rounded-lg p-6 border hover:shadow-lg transition"
            >
              {/* 🧠 Overview */}
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                📘 {plan.overview?.title}
              </h2>
              <p className="text-gray-600 italic mb-2">
                {plan.overview?.level}
              </p>
              <p className="text-gray-700 mb-4">
                {plan.overview?.description}
              </p>

              {/* 📅 Weekly Plan */}
              <h3 className="text-xl font-semibold text-violet-700 mb-3">
                📅 Weekly Plan
              </h3>
              <ul className="list-disc ml-6 mb-4 space-y-2">
                {plan.weekly_plan?.map((week, i) => (
                  <li key={i}>
                    <strong>Week {i + 1}:</strong> {week.topic} — {week.focus}
                  </li>
                ))}
              </ul>

              {/* 📚 Resources */}
              <h3 className="text-xl font-semibold text-violet-700 mb-2">📚 Resources</h3>
              <div className="mb-4">
                <p className="font-semibold">Textbooks:</p>
                <ul className="list-disc ml-6">
                {plan.resources?.textbooks?.map((book, i) => (
                  <li key={`${plan._id}-textbook-${i}`}>{book}</li>
                ))}
                </ul>

                <p className="font-semibold mt-2">Online Platforms:</p>
                <ul className="list-disc ml-6">
                {plan.resources?.online_platforms?.map((site, i) => (
                  <li key={`${plan._id}-platform-${i}`}>{site}</li>
                ))}
                </ul>
              </div>

              {/* 💡 Tips */}
              <h3 className="text-xl font-semibold text-violet-700 mb-2">💡 Tips</h3>
              <ul className="list-disc ml-6 mb-4">
                {plan.tips?.daily_study_habits?.map((tip, i) => (
                  <li key={`${plan._id}-tip-${i}`}><span>{tip}</span> <p></p></li>
                ))}
              </ul>
              {/* week and daily task*/}
              
              {/* 📊 Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{plan.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-violet-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${plan.progress || 0}%` }}
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
                  onClick={() => updateProgress(plan._id)}
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
