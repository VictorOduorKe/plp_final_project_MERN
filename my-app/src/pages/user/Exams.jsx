import { useEffect, useState } from "react";
import { fetchPracticeExams } from "../../context/FetchPlan";
import { submitAnswers } from "../../context/submitAnswers";

const Exams = () => {
  const [examsBySubject, setExamsBySubject] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user_id = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    const getExams = async () => {
      try {
        if (!user_id) return;
        setLoading(true);

        const data = await fetchPracticeExams(user_id);
        const allExams = data?.practice_exams || [];

        if (!data) console.log("No data received.");

        // ✅ Group exams by subject name
        const grouped = allExams.reduce((acc, exam) => {
          const subject = exam.subject || "Unknown Subject";
          if (!acc[subject]) acc[subject] = [];
          acc[subject].push(exam);
          return acc;
        }, {});

        setExamsBySubject(grouped);
      } catch (error) {
        console.error("❌ Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    getExams();
  }, [user_id]);

  const handleSelectOption = (examKey, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [examKey]: optionIndex,
    }));
  };

const handleSubmitSubject = async (subject) => {
  if (!user_id) return alert("User not found!");

  const subjectExams = examsBySubject[subject];
  if (!subjectExams || subjectExams.length === 0) {
    return alert("No questions for this subject.");
  }

  const subjectAnswers = subjectExams.map((exam, index) => {
    const examKey = `${subject}-${index}`;
    const selectedIndex = selectedAnswers[examKey];
    const selectedOption = exam.options[selectedIndex];

    return {
      question_id: exam.id || `temp-${index}`,
      question_text: exam.question,
      selected_option: selectedOption?.text || null,
      correct_answer: exam.options.find((opt) => opt.is_correct)?.text,
    };
  });

  try {
    setSubmitting(true);

    const res = await submitAnswers({
      user_id,
      subject_id: subjectExams[0].subject_id?.id || subjectExams[0].subject_id || null,
      exam_id: subjectExams[0].id || null,
      answers: subjectAnswers,
    });

    alert(`✅ ${subject} submitted!\nScore: ${res.correct_answers}/${res.total_questions}`);
    console.log(`📘 Submitted answers for ${subject}:`, res);
  } catch (error) {
    console.error("❌ Submission error:", error);
    alert(`❌ Failed to submit answers for ${subject}: ${error.message || "Server error"}`);
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-600 text-xl font-semibold">
        Loading practice exams...
      </div>
    );
  }

  const subjects = Object.keys(examsBySubject);

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          🧠 Practice Exams & Weekly Quizzes
        </h2>

        {subjects.length === 0 ? (
          <p className="text-gray-500 text-center">
            No practice exams available.
          </p>
        ) : (
          subjects.map((subject, subjIndex) => (
            <div
              key={subjIndex}
              className="mb-6 border rounded-xl overflow-hidden shadow-sm"
            >
              {/* Subject Header */}
              <div
                className="flex justify-between items-center px-5 py-3 bg-blue-100 cursor-pointer hover:bg-blue-200 transition"
                onClick={() =>
                  setExpandedSubject(
                    expandedSubject === subject ? null : subject
                  )
                }
              >
                <h3 className="text-xl font-semibold text-blue-700">
                  📘 {subject}
                </h3>
                <span className="text-sm text-gray-600">
                  {expandedSubject === subject ? "▲ Hide" : "▼ View"}
                </span>
              </div>

              {/* Collapsible Questions */}
              {expandedSubject === subject && (
                <div className="p-5 space-y-4 bg-gray-50">
                  {examsBySubject[subject].map((exam, index) => {
                    const examKey = `${subject}-${index}`;
                    return (
                      <div
                        key={examKey}
                        className="border border-gray-200 rounded-xl p-5 bg-white hover:bg-gray-50 transition"
                      >
                        <h4 className="font-semibold text-lg text-gray-800 mb-3">
                          {index + 1}. {exam.question}
                        </h4>

                        <div className="space-y-2">
                          {exam.options?.map((option, optIndex) => {
                            const isSelected =
                              selectedAnswers[examKey] === optIndex;
                            return (
                              <button
                                key={optIndex}
                                onClick={() =>
                                  handleSelectOption(examKey, optIndex)
                                }
                                className={`w-full text-left p-3 rounded-lg border transition ${
                                  isSelected
                                    ? "bg-blue-100 border-blue-500 text-blue-800"
                                    : "bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                                }`}
                              >
                                {option.text}
                              </button>
                            );
                          })}
                        </div>

                        <div className="text-sm text-gray-500 mt-3 flex justify-between">
                          <p>
                            <strong>Week:</strong> {exam.week}
                          </p>
                          <p>
                            <strong>Topic:</strong> {exam.topic}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* ✅ Submit button for this subject */}
                  <div className="mt-6 flex justify-center">
                    <button
                      className={`px-6 py-3 rounded-xl shadow text-white transition ${
                        submitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      disabled={submitting}
                      onClick={() => handleSubmitSubject(subject)}
                    >
                      {submitting
                        ? "Submitting..."
                        : `Submit ${subject} Answers`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Exams;
