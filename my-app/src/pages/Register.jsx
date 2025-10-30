import { useState } from "react";
import axios from "axios"; 
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // ✅ spinner
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    otp: "",
  });
  const navigate=useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleChange =  (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async() => {
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/otp`, {
        email: formData.email,
      });
      toast.success(`OTP sent to ${formData.email}`);
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const [first_name, second_name] = formData.fullName.trim().split(/\s+/, 2);
      // backend requires a non-empty second_name; if user provided only one name,
      // use the first_name as a fallback so validation doesn't fail. It's better
      // to ask for separate fields, but this keeps registration robust for now.
      const payload = {
        first_name: first_name || "",
        second_name: second_name || first_name || "",
        phone_number: formData.phone_number,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        otp: formData.otp,
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, payload, {
        withCredentials: true,
      });
      toast.success(res.data.message || "Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error("❌ Registration failed:", err.response || err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      toast.error(serverMsg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-800 px-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-violet-400 mb-4">
          Create an Account
        </h2>
        <p className="text-center text-gray-300 mb-6 text-sm md:text-base">
          Sign up and start planning your study journey with AI.
        </p>

        {/* Email + Send OTP */}
       {/*} {!otpSent && (
          <div className="flex gap-2 mb-4">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="flex-1 px-4 py-2 md:py-3 rounded-lg border border-gray-600 bg-slate-800 text-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              className="px-4 py-2 md:py-3 bg-violet-400 text-slate-900 font-semibold rounded-lg hover:bg-violet-500 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <ClipLoader color="#1c1917" size={20} /> : "Send OTP"}
            </button>
          </div>
        )}*/}

        {/* Form (shows after OTP sent) */}
        {!otpSent && (
          <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 rounded-lg border border-gray-600 bg-slate-800 text-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 rounded-lg border border-gray-600 bg-slate-800 text-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
            <input
              type="tel"
              name="phone_number"
              placeholder="Enter phone number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 rounded-lg border border-gray-600 bg-slate-800 text-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 rounded-lg border border-gray-600 bg-slate-800 text-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 rounded-lg border border-gray-600 bg-slate-800 text-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
              required
            />
           {/*} <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 md:py-3 rounded-lg border border-gray-600 bg-slate-800 text-violet-400 focus:ring-2 focus:ring-violet-400 focus:outline-none"
              required
            />*/}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!formData || loading}
              className={`w-full py-2 md:py-3 rounded-lg bg-violet-400 text-slate-900 font-semibold transition duration-300 shadow-md flex items-center justify-center ${
                !formData
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-violet-500"
              }`}
            >
              {loading ? <ClipLoader color="#1c1917" size={20} /> : "Create Account"}
            </button>
          </form>
        )}

        {/* Login redirect */}
        <p className="text-center text-gray-300 mt-4 text-sm md:text-base">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-violet-400 font-semibold hover:underline"
          >
            Log In
          </a>
        </p>
      </div>
    </section>
  );
};

export default Register;
