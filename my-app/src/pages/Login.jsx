import { useState, useContext } from "react";
import { toast} from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // ✅ import spinner

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      setLoading(false);

      if (data?.user) {
        toast.success("Login successful! Redirecting...");
        setTimeout(() => {
          navigate(data.user.role === "admin" ? "/admin" : "/user");
        }, 1000);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed. Check your credentials.";
      toast.error(msg);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-800 px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-center text-violet-400 mb-4">
          AI Study Planner
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Welcome back! Please log in to continue.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-300 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm text-violet-400 hover:underline transition-all duration-200"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-violet-400 text-slate-900 font-semibold text-lg hover:bg-violet-500 transition-all duration-300 shadow-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <ClipLoader color="#1c1917" size={25} />
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-violet-400 font-semibold hover:underline transition-all duration-200"
          >
            Sign Up
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
