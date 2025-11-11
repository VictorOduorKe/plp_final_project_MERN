const Services = () => {
  return (
    <section className="min-h-screen bg-slate-800 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-4xl font-bold text-violet-400 mb-4">
          Our Services
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-16">
          Empower your learning with our AI-powered tools designed to create personalized study plans, track your progress, and help you achieve your academic goals efficiently.
        </p>

        {/* Service Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-slate-900 shadow-lg rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-slate-700">
            <h3 className="text-xl font-semibold text-violet-400 mb-2">
              AI Study Planner
            </h3>
            <p className="text-gray-300">
              Get a custom study plan tailored to your subjects, goals, and timeline — created instantly by AI to keep you focused and on track.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 shadow-lg rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-slate-700">
            <h3 className="text-xl font-semibold text-violet-400 mb-2">
              Smart Quiz Generator
            </h3>
            <p className="text-gray-300">
              Generate topic-based quizzes and get instant feedback to test your knowledge and identify weak areas quickly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 shadow-lg rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-slate-700">
            <h3 className="text-xl font-semibold text-violet-400 mb-2">
              Progress Tracking
            </h3>
            <p className="text-gray-300">
              Visualize your learning journey with progress charts, completion stats, and personalized insights to stay motivated.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900 shadow-lg rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-slate-700">
            <h3 className="text-xl font-semibold text-violet-400 mb-2">
              Smart Notes
            </h3>
            <p className="text-gray-300">
              Generate concise, topic-focused notes automatically — saving you time and helping you grasp key concepts faster.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-900 shadow-lg rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-slate-700">
            <h3 className="text-xl font-semibold text-violet-400 mb-2">
              AI Assistant
            </h3>
            <p className="text-gray-300">
              Ask any study-related question and get clear, accurate answers from our AI tutor — available 24/7 to support your learning.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-900 shadow-lg rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-slate-700">
            <h3 className="text-xl font-semibold text-violet-400 mb-2">
              Personalized Goals
            </h3>
            <p className="text-gray-300">
              Set and track academic goals, receive AI-powered tips, and get reminders to stay disciplined and focused on success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
