import {Link} from "react-router-dom"
const Home = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* 🌟 Hero Section */}
      <div className="max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          Your Personal <span className="text-violet-400">AI Study Planner</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-8">
          Generate personalized study plans, short notes, quizzes, and more — all powered by AI and tailored to your level and goals.
        </p>

        {/* 📚 Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="px-8 py-3 bg-violet-500 hover:bg-violet-600 transition duration-300 rounded-full font-semibold">
            Get Started
          </Link>
          <button className="px-8 py-3 border border-violet-500 text-violet-400 hover:bg-violet-500 hover:text-white transition duration-300 rounded-full font-semibold">
            Learn More
          </button>
        </div>
      </div>

      {/* 🤖 AI Illustration or Feature Section */}
      <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 bg-slate-800 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition">
          <h3 className="text-2xl font-bold mb-3 text-violet-400">Smart Study Plans</h3>
          <p className="text-slate-300">
            Get tailored daily, weekly, or monthly study schedules based on your level, subjects, and available time.
          </p>
        </div>

        <div className="p-6 bg-slate-800 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition">
          <h3 className="text-2xl font-bold mb-3 text-violet-400">AI Short Notes</h3>
          <p className="text-slate-300">
            Receive easy-to-understand summaries and key points for any topic, created by AI for fast revision.
          </p>
        </div>

        <div className="p-6 bg-slate-800 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition">
          <h3 className="text-2xl font-bold mb-3 text-violet-400"> Quizzes & Answers</h3>
          <p className="text-slate-300">
            Test your knowledge with automatically generated quizzes — complete with correct answers and explanations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Home;
