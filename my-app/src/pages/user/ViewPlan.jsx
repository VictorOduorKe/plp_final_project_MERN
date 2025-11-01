import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { hideConsoleLogInProduction } from "../../context/hideLogs";
// import { hideConsoleLogInProduction } from "./hideLogs"; --- IGNORE ---

const ViewPlan = () => {
  const { subjectId } = useParams();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null); // ✅ track which week card is open

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/plan`,
          { params: { user_id, subject_id: subjectId } }
        );
        setPlanData(res.data);
      } catch (err) {
        hideConsoleLogInProduction("Failed to load plan:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user_id && subjectId) fetchPlan();
  }, [user_id, subjectId]);

  if (loading) return <p className="text-center mt-10">Loading plan...</p>;
  if (!planData || !planData.plan)
    return <p className="text-center mt-10 text-red-500">No plan found.</p>;

  const plan = planData.plan;

  const renderResource = (item) => {
    if (!item && item !== 0) return null;
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      // display common book properties safely
      const parts = [];
      if (item.title) parts.push(item.title);
      if (item.author) parts.push(`by ${item.author}`);
      if (item.publisher) parts.push(`(${item.publisher})`);
      if (item.notes) parts.push(`- ${item.notes}`);
      return parts.join(" ");
    }
    return String(item);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-4 text-violet-700 text-center">
        📘 {planData.subject_id?.subject_name || "Study"} Plan
      </h1>

      {/* 📄 Overview */}
      <div className="mb-8 bg-blue-50 p-5 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-2">📄 Overview</h2>
        <p className="text-gray-700 whitespace-pre-line">{plan.overview?.description}</p>
        <p className="mt-2 text-sm text-gray-500">
          Level: {plan.overview?.level} | Duration: {plan.overview?.duration}
        </p>
      </div>

      {/* 📆 Weekly Plan as Cards */}
      <h2 className="text-2xl font-semibold mb-6 text-center">📆 Weekly Breakdown</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan.weekly_plan?.map((week, i) => (
          <div
            key={i}
            onClick={() => setSelectedWeek(selectedWeek === i ? null : i)}
            className={`p-5 border rounded-2xl shadow-sm cursor-pointer transition hover:shadow-lg ${
              selectedWeek === i ? "bg-violet-50" : "bg-white"
            }`}
          >
            <h3 className="text-xl font-semibold text-violet-700 mb-2">
              📅 Week {i + 1}
            </h3>
            <p className="font-medium text-gray-700">{week.topic}</p>
            <p className="text-sm text-gray-500 mt-1">
              {week.daily_tasks?.length || 0} daily tasks
            </p>

            {/* Expand details when clicked */}
            {selectedWeek === i && (
              <div className="mt-4 border-t pt-3 space-y-3 text-sm">
                <h4 className="font-semibold text-gray-800">📌 Daily Tasks</h4>
                <ul className="list-disc ml-5">
                  {week.daily_tasks?.map((task, idx) => (
                    <li key={idx} className="mb-2">
                      <strong>Day {idx + 1}:</strong> {task.task}
                      {task.examples?.length > 0 && (
                        <ul className="list-decimal ml-5 text-gray-600 mt-1">
                          {task.examples.map((ex, exIdx) => (
                            <li key={exIdx}>{ex}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>

                {week.key_learning_outcomes && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mt-4">🎯 Key Learning Outcomes</h4>
                    <ul className="list-disc ml-5">
                      {week.key_learning_outcomes.map((outcome, idx) => (
                        <li key={idx}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 📚 Resources */}
      <div className="mt-12 bg-green-50 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">📚 Recommended Resources</h2>

        {plan.resources?.textbooks && (
          <>
            <h3 className="text-lg font-semibold">📘 Textbooks</h3>
            <ul className="list-disc ml-6 mb-4">
              {plan.resources.textbooks.map((book, i) => (
                <li key={i}>{renderResource(book)}</li>
              ))}
            </ul>
          </>
        )}

        {plan.resources?.online_platforms && (
          <>
            <h3 className="text-lg font-semibold">💻 Online Platforms</h3>
            <ul className="list-disc ml-6 mb-4">
              {plan.resources.online_platforms.map((p, i) => (
                <li key={i}>{renderResource(p)}</li>
              ))}
            </ul>
          </>
        )}

        {plan.resources?.youtube_channels && (
          <>
            <h3 className="text-lg font-semibold">📺 YouTube Channels</h3>
            <ul className="list-disc ml-6">
              {plan.resources.youtube_channels.map((channel, i) => (
                <li key={i}>{renderResource(channel)}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 💡 Tips */}
      <div className="mt-12 bg-yellow-50 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">💡 Study Tips</h2>

        {plan.tips?.daily_study_habits && (
          <>
            <h3 className="text-lg font-semibold mb-2">📅 Daily Study Habits</h3>
            <ul className="list-disc ml-6 mb-4">
              {plan.tips.daily_study_habits.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </>
        )}

        {plan.tips?.exam_strategies && (
          <>
            <h3 className="text-lg font-semibold mb-2">🧠 Exam Strategies</h3>
            <ul className="list-disc ml-6 mb-4">
              {plan.tips.exam_strategies.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </>
        )}

        {plan.tips?.mental_wellbeing && (
          <>
            <h3 className="text-lg font-semibold mb-2">🧘 Mental Wellbeing</h3>
            <ul className="list-disc ml-6">
              {plan.tips.mental_wellbeing.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewPlan;
