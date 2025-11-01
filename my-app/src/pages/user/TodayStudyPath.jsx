import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPlanBySubject } from "../../context/fetchPlanBySubject"; // ✅ use the new one
import { hideConsoleLogInProduction } from "../../context/hideLogs";
// import { hideConsoleLogInProduction } from "./hideLogs"; --- IGNORE ---

const TodayStudyPath = () => {
  const { subjectId } = useParams(); // ✅ comes from URL
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.id;
  const [plan, setPlan] = useState(null);
  const [todayTask, setTodayTask] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [studyDayIndex, setStudyDayIndex] = useState(0);

  useEffect(() => {
    if (!user_id || !subjectId) return;

    const loadPlan = async () => {
      try {
        const data = await fetchPlanBySubject(user_id, subjectId);
        
        // Handle case where no plan is found
        if (!data || data.message === "No plan found") {
          console.warn("No study plan found");
          setPlan(null);
          setCurrentWeek(null);
          setTodayTask(null);
          return;
        }

        setPlan(data);

        // Make sure we have a plan with weekly_plan before proceeding
        if (!data.plan || !data.plan.weekly_plan || !Array.isArray(data.plan.weekly_plan)) {
          setPlan(null);
          setCurrentWeek(null);
          setTodayTask(null);
          return;
        }

        const createdDate = new Date(data.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

        const weekIndex = Math.floor(diffDays / 7);
        const dayIndex = diffDays % 7;

        if (weekIndex >= data.plan.weekly_plan.length) {
          setPlan(null);
          setCurrentWeek(null);
          setTodayTask(null);
          return;
        }

        const thisWeek = data.plan.weekly_plan[weekIndex];
        setCurrentWeek(thisWeek);
        setStudyDayIndex(dayIndex);

        const task = thisWeek.daily_tasks[dayIndex];
        setTodayTask(task);
      } catch (error) {
        hideConsoleLogInProduction("Failed to load plan:", error);
      }
    };

    loadPlan();
  }, [user_id, subjectId]);

  if (!plan) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">No Study Plan Found</h2>
        <p className="text-gray-600">
          There is no study plan generated for this subject yet. 
          Please generate a plan first to see your daily tasks.
        </p>
      </div>
    );
  }

  if (!currentWeek || !todayTask) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Study Plan Complete</h2>
        <p className="text-gray-600">
          You have completed all the tasks in your current study plan! 🎓
        </p>
      </div>
    );
  }

  // Ensure plan is valid and has the expected structure
  if (!plan.plan || !plan.plan.weekly_plan) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Invalid Plan Structure</h2>
        <p className="text-gray-600">
          The study plan appears to be corrupted or in an invalid format.
          Please try regenerating the plan.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-violet-700 mb-4">
        📆 Week {currentWeek.week}: {currentWeek.topic}
      </h2>

      <p className="text-sm text-gray-500 mb-2">Day {studyDayIndex + 1} of this week</p>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-indigo-600">📘 Today's Task</h3>
        <p className="mt-2 text-gray-700">{todayTask.task}</p>
      </div>
   
      <div className="mb-4">
        <h3 className="text-lg font-semibold">🎯 Key Learning Outcomes</h3>
        <ul className="list-disc ml-6 mt-2 text-gray-700">
          {currentWeek.key_learning_outcomes.map((outcome, idx) => (
            <li key={idx}>{outcome}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
  <h3 className="text-lg font-semibold">Example Questions</h3>
  <ol type="1" className="ml-6 mt-2 text-gray-700 list-decimal">
    {todayTask.examples.map((example, idx) => (
      <li key={idx}>{example}</li>
    ))}
  </ol>
</div>
      <div>
        <h3 className="text-lg font-semibold">📚 Recommended Resources</h3>
        <ul className="list-disc ml-6 mt-2 text-gray-700">
          {plan.plan.resources.textbooks?.map((book, idx) => {
            if (typeof book === "string") return <li key={idx}>{book}</li>;
            if (typeof book === "object") {
              const parts = [];
              if (book.title) parts.push(book.title);
              if (book.author) parts.push(`by ${book.author}`);
              if (book.publisher) parts.push(`(${book.publisher})`);
              if (book.notes) parts.push(`- ${book.notes}`);
              return <li key={idx}>{parts.join(" ")}</li>;
            }
            return <li key={idx}>{String(book)}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default TodayStudyPath;
