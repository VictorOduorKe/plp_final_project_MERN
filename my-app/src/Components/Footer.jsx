import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-2">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold text-violet-500 mb-4">
            AI StudyPlanner
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your smart companion for personalized learning.  
            Build study plans, generate quizzes, and reach your academic goals faster with AI.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="hover:text-violet-400 transition-colors duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-violet-400 transition-colors duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-violet-400 transition-colors duration-300"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-violet-400 transition-colors duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/register"
                className="hover:text-violet-400 transition-colors duration-300"
              >
                Get Started
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="hover:text-violet-400 transition-colors duration-300"
              >
                Login
              </Link>
            </li>
            <li>
              <a
                href="#faq"
                className="hover:text-violet-400 transition-colors duration-300"
              >
                FAQs
              </a>
            </li>
            <li>
              <a
                href="#support"
                className="hover:text-violet-400 transition-colors duration-300"
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Subscribe</h3>
          <p className="text-sm text-gray-400 mb-4">
            Join our newsletter to get study tips and updates.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg focus:outline-none text-gray-900"
            />
            <button
              type="submit"
              className="bg-violet-600 text-white px-5 py-2 rounded-lg hover:bg-violet-700 transition-colors duration-300 w-full sm:w-auto"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} AI StudyPlanner — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
