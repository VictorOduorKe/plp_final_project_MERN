import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔥 TODO: Call backend API to send reset password email
    alert(`Password reset link sent to ${email}`);
    setEmail("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800 px-4">
      <div className="w-full max-w-md bg-slate-900 shadow-lg rounded-2xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-violet-400 mb-4">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter your registered email and we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-300 font-semibold mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-600 rounded-lg px-4 py-2 bg-slate-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-400 text-slate-900 py-2 rounded-lg font-semibold hover:bg-violet-500 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-300">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:underline font-medium"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
