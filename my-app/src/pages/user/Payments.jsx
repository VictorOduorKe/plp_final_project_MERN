import { useState } from "react";
import axios from "axios"
import {toast} from "react-toastify"


const Payment = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "basic",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const user=JSON.parse(localStorage.getItem("user"))
  const handleSubmit = async(e) => {
    e.preventDefault();
   try {
const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/payment`, // 👈 your backend endpoint
      {
        user_id:user.id, // or however you store user ID
        email: formData.email,
        phone: formData.phone,
        amount:
          formData.plan === "basic"
            ? 1
            : formData.plan === "pro"
            ? 2
            : 3,
        package: formData.plan,
      }
    );
    console.log(formData)
    const { authorization_url } = res.data;
     window.location.href = authorization_url;
   } catch (error) {
    console.error("Payment error:", error.response?.data || error.message);
    toast.error(
      error.response?.data?.message ||
        "Failed to start payment. Please try again."
    );
   }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center py-10 px-4">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">
          Complete Your Payment
        </h2>

        {/* Summary */}
        <div className="bg-slate-100 rounded-lg p-4 mb-6 text-slate-700">
          <h3 className="font-semibold text-lg mb-2">📘 Plan Summary</h3>
          <p>AI Study Planner Access – Includes study plans, notes & quizzes</p>
          <p className="font-semibold mt-2">Price: <span className="text-violet-600">Ksh 500 / month</span></p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Phone (M-Pesa)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 0712345678"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Select Plan</label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="basic">📘 Basic – Ksh 500 / month</option>
              <option value="pro">🚀 Pro – Ksh 1200 / 3 months</option>
              <option value="premium">🏆 Premium – Ksh 4000 / year</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
          >
            Pay Now
          </button>

          <p className="text-center text-sm text-slate-500 mt-3">
            💡 Secure payment powered by M-Pesa & Paystack
          </p>
        </form>
      </div>
    </section>
  );
};

export default Payment;
