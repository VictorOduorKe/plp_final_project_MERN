import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ✅ Token from email link
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // 🔥 TODO: Send token + new password to backend
    alert("Password has been reset successfully!");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-800 px-4">
      <div className="w-full max-w-md bg-slate-900 shadow-lg rounded-2xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-violet-400 mb-4">
          Reset Password
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-gray-300 font-semibold mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              required
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-600 rounded-lg px-4 py-2 bg-slate-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-300 font-semibold mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-600 rounded-lg px-4 py-2 bg-slate-800 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-400 text-slate-900 py-2 rounded-lg font-semibold hover:bg-violet-500 transition duration-300"
          >
            Reset Password
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-300">
            Go back to{" "}
            <Link
              to="/login"
              className="text-violet-400 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
