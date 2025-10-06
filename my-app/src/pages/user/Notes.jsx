import { useState } from "react";

const Notes = () => {
  const [search, setSearch] = useState("");

  // 📘 Sample notes – later you’ll fetch these from your backend or Gemini
  const notes = [
    {
      id: 1,
      subject: "Mathematics",
      level: "Form 1",
      summary:
        "Algebra involves using letters to represent numbers and writing expressions that follow arithmetic rules.",
    },
    {
      id: 2,
      subject: "Biology",
      level: "Form 2",
      summary:
        "Photosynthesis is the process by which plants convert sunlight into chemical energy using chlorophyll.",
    },
    {
      id: 3,
      subject: "Physics",
      level: "Form 3",
      summary:
        "Newton’s First Law states that an object will remain at rest or in uniform motion unless acted upon by a force.",
    },
    {
      id: 4,
      subject: "Chemistry",
      level: "Form 4",
      summary:
        "Acids are substances that release hydrogen ions (H⁺) in solution, while bases release hydroxide ions (OH⁻).",
    },
  ];

  // 🔍 Filter notes based on search
  const filteredNotes = notes.filter(
    (note) =>
      note.subject.toLowerCase().includes(search.toLowerCase()) ||
      note.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-violet-700 mb-6">📚 Study Notes</h1>

      {/* 🔍 Search input */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by subject or level..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* 📝 Notes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white border rounded-xl p-6 shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-semibold text-violet-700 mb-2">
              {note.subject}
            </h2>
            <p className="text-gray-500 text-sm mb-3">Level: {note.level}</p>
            <p className="text-gray-800 mb-4">{note.summary}</p>

            <div className="flex gap-3">
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition">
                📄 View Full Notes
              </button>
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition">
                ⬇️ Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <p className="text-center text-gray-500 text-lg mt-10">
          No notes found for your search.
        </p>
      )}
    </div>
  );
};

export default Notes;
