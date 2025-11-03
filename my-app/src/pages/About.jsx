const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto text-center">
        {/* 🧠 Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          About <span className="text-violet-400">AI Study Planner</span>
        </h1>
        <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto">
          We built AI Study Planner to help students learn smarter, not harder. 
          Whether you're in high school, college, or self-learning online, our platform creates 
          tailored study schedules, notes, and quizzes using the power of artificial intelligence.
        </p>
      </div>

      {/* 📘 Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mt-10">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition">
          <h2 className="text-3xl font-bold text-violet-400 mb-4"> Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            To revolutionize how students approach learning by leveraging AI to simplify planning, 
            accelerate understanding, and improve academic performance.  
            We believe that personalized study experiences help learners reach their full potential.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-violet-500/30 transition">
          <h2 className="text-3xl font-bold text-violet-400 mb-4"> Our Vision</h2>
          <p className="text-slate-300 leading-relaxed">
            A world where every student has a digital mentor — available 24/7 — to guide them 
            through their learning journey with custom-made plans, real-time feedback, and engaging content.
          </p>
        </div>
      </div>

      {/* 🤖 How It Works */}
      <div className="max-w-4xl mx-auto mt-20 text-center">
        <h2 className="text-4xl font-bold text-violet-400 mb-6">⚙️ How It Works</h2>
        <p className="text-lg text-slate-300 mb-10">
          Using advanced natural language processing and curriculum mapping, our AI tailors every plan to your level, 
          schedule, and goals in three simple steps:
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-slate-800 rounded-2xl hover:shadow-violet-500/30 transition">
            <h3 className="text-2xl font-semibold mb-3 text-violet-400">1️⃣ Input Your Details</h3>
            <p className="text-slate-300">
              Choose your subject, education level, and study duration. The more specific you are, the more tailored your plan becomes.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-2xl hover:shadow-violet-500/30 transition">
            <h3 className="text-2xl font-semibold mb-3 text-violet-400">2️⃣ AI Generates Content</h3>
            <p className="text-slate-300">
              Our AI instantly builds a personalized study plan, short notes, and quizzes to help you master each topic efficiently.
            </p>
          </div>
          <div className="p-6 bg-slate-800 rounded-2xl hover:shadow-violet-500/30 transition">
            <h3 className="text-2xl font-semibold mb-3 text-violet-400">3️⃣ Learn & Track Progress</h3>
            <p className="text-slate-300">
              Study using the plan, test your knowledge with quizzes, and track your progress over time — all in one place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
