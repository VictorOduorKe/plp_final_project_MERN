import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { paymentStatus } from "../../context/PaymentContext";

const UserDashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [status, setStatus] = useState(null); // ✅ will hold { package, expiresAt, expired }

  const getUser = JSON.parse(localStorage.getItem("user") || "{}");
  const user_id = getUser?.id;

  useEffect(() => {
    if (!getUser || !getUser.email) {
      handleLogout();
      return;
    }

    const fetchStatus = async () => {
      try {
        const result = await paymentStatus(user_id);
        setStatus(result); // ✅ store actual plan info
        console.log("Payment status:", result);
      } catch (err) {
        console.error("Failed to fetch payment status:", err);
      }
    };

    if (user_id) {
      fetchStatus();
    }
  }, [user_id]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("session_token");
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Try again.");
    }
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-violet-700 text-white flex items-center justify-between p-4 z-50">
        <h2 className="text-lg font-bold">📚 Study Planner</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          bg-violet-700 text-white p-5 flex flex-col space-y-6
          fixed top-0 left-0 h-full w-64 z-40 mt-3
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300
          md:relative md:translate-x-0 md:flex-shrink-0
        `}
      >
        <h2 className="text-2xl font-bold text-center mb-8 md:hidden">
          📚 Study Planner
        </h2>

        {/* ✅ Display package name */}
        <span className="text-2xl font-bold text-center">
          {status?.package || "Loading..."} Plan
        </span>

        <strong className="md:hidden">{getUser?.first_name || "Guest"}</strong>

        <nav className="flex flex-col space-y-4 mt-4">
          <NavLink to="/user/add-subject" onClick={handleLinkClick} className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-violet-600 transition ${isActive ? "bg-violet-600" : ""}`
            }>
            ➕ Add Subject
          </NavLink>

          <NavLink to="/user/study-plans" onClick={handleLinkClick} className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-violet-600 transition ${isActive ? "bg-violet-600" : ""}`
            }>
            📊 Study Plans
          </NavLink>

          <NavLink to="/user/quizzes" onClick={handleLinkClick} className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-violet-600 transition ${isActive ? "bg-violet-600" : ""}`
            }>
            🧠 Quizzes
          </NavLink>

          <NavLink to="/user/notes" onClick={handleLinkClick} className={({ isActive }) =>
              `px-3 py-2 rounded-md hover:bg-violet-600 transition ${isActive ? "bg-violet-600" : ""}`
            }>
            📚 Notes
          </NavLink>

      {status ? (
  status.package !== "free" && !status.expired ? (
    <p className="text-sm text-slate-200 font-medium">
      ✅ Plan: {status.package} <br />
      📅 Expires on:{" "}
      {status.expiresAt
        ? new Date(status.expiresAt).toLocaleDateString()
        : "N/A"}
    </p>
  ) : (
    <NavLink
      to="/user/payments"
      onClick={handleLinkClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md hover:bg-violet-600 transition ${
          isActive ? "bg-violet-600" : ""
        }`
      }
    >
      💳 Upgrade
    </NavLink>
  )
) : (
  <p className="text-slate-300 text-sm">Loading plan...</p>
)}

        </nav>

        <div className="mt-auto text-center md:hidden">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md font-semibold transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}

      <main className="flex-1 p-8 md:ml-0 mt-20 md:mt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
