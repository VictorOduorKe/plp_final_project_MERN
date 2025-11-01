// AddSubject.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { generatePlan } from "../../context/GeneratePlan";
import { hideConsoleLogInProduction } from "../../context/hideLogs";
// import { hideConsoleLogInProduction } from "./hideLogs"; --- IGNORE ---

const CLASS_LEVELS = {
  Primary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
  Junior: ["Grade 7", "Grade 8", "Grade 9"],
  Senior: ["Grade 10", "Grade 11", "Grade 12"],
  College: ["Certificate Level", "Diploma Level", "Higher Diploma"],
  University: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Postgraduate"],
};

const AddSubject = () => {
  const [subject, setSubject] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user_id = storedUser ? JSON.parse(storedUser)?.id : null;

  useEffect(() => {
    if (!user_id) return;

    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/subjects`,
          {
            params: { user_id },
            withCredentials: true
          }
        );


        // 🔍 Mark whether each subject already has a plan
        const subjectsWithPlanStatus = await Promise.all(
          res.data.map(async (subject) => {
            try {
              const planCheck = await axios.get(
                `${import.meta.env.VITE_API_URL}/plan?user_id=${user_id}&subject_id=${subject._id}`,
                {
                  
                  withCredentials: true
                }
              );
              return {
                ...subject,
                hasPlan: planCheck.data ? true : false,
              };
            } catch (error) {
              return {
                ...subject,
                hasPlan: false,
              };
            }
          })
        );

        setSubjects(subjectsWithPlanStatus);
      } catch (err) {
        hideConsoleLogInProduction("Error loading subjects:", err);
      }
    };

    fetchSubjects();
  }, [user_id]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !educationLevel || !classLevel) {
      toast.error("All fields are required");
      return;
    }
    if (!user_id) {
      toast.error("You must be logged in to add a subject");
      return;
    }

    const newSubject = {
      subject_name: subject,
      education_level: educationLevel,
      class_level: classLevel,
      user_id,
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/subject`,
        newSubject,
        {
          withCredentials: true
        }
      );

      const createdSubject = res.data;
      
      // Add the new subject without a plan initially
      setSubjects([...subjects, { ...createdSubject, hasPlan: false }]);
      setSubject("");
      setEducationLevel("");
      setClassLevel("");
      toast.success("Subject added successfully!");

      // ❌ REMOVED: Automatic plan generation
      // Now users will need to click the "Generate Study Plan" button manually

    } catch (err) {
      hideConsoleLogInProduction("Error adding subject:", err);
      toast.error(err.response?.data?.message || "Failed to add subject");
    }
  };

  const handleGeneratePlan = async (subjectId) => {
    if (!user_id) {
      toast.error("You must be logged in to generate a plan");
      return;
    }

    setLoading(true);
    try {
      const plan = await generatePlan(user_id, subjectId);
      if (plan) {
        toast.success("📚 Study plan generated successfully!");
        // Update the subject's plan status
        setSubjects(subjects.map(subj =>
          subj._id === subjectId ? { ...subj, hasPlan: true } : subj
        ));
      } else {
        toast.error("Failed to generate study plan");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate study plan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/subjects/${id}`,
        {
          withCredentials: true
        }
      );
      setSubjects(subjects.filter((s) => s._id !== id));
      toast.info("Subject deleted");
    } catch (err) {
      hideConsoleLogInProduction("Error deleting subject:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-violet-700 mb-6">➕ Add a Subject</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-10">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Subject Name</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Mathematics"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Education Level</label>
          <select
            value={educationLevel}
            onChange={(e) => {
              setEducationLevel(e.target.value);
              setClassLevel("");
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Select Education Level</option>
            {Object.keys(CLASS_LEVELS).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {educationLevel && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Class Level</label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select Class Level</option>
              {CLASS_LEVELS[educationLevel].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded-lg transition"
        >
          Add Subject
        </button>
      </form>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">📘 Added Subjects</h2>

        {subjects.length === 0 ? (
          <p className="text-gray-500">No subjects added yet.</p>
        ) : (
          <ul className="space-y-4">
            {subjects.map((s) => (
              <li
                key={s._id}
                className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{s.subject_name}</p>
                  <p className="text-sm text-gray-500">
                    {s.education_level} - {s.class_level}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                  >
                    Delete
                  </button>

                  {/* ✅ Conditional Buttons */}
                  {s.hasPlan ? (
                    <>
                      <button
                        onClick={() => navigate(`/user/plan/${s._id}`)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        📘 View Plan
                      </button>
                      <button 
                        onClick={() => navigate(`/user/todays-study-plan/${s._id}`)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                      >
                        View Activity
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleGeneratePlan(s._id)}
                      disabled={loading}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-lg transition"
                    >
                      {loading ? "Generating..." : "⚙️ Generate Study Plan"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddSubject;