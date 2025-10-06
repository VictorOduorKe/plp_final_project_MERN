import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify"

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      toast.error("Logout failed:", error.message);
    } finally {
      // ✅ Clear local storage and any session info
      localStorage.removeItem("user");
      localStorage.removeItem("session_token");
      // Update state so component re-renders and redirects
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "user") {
      handleLogout();
    }
  }, []);

  // 🔁 Once `isAuthenticated` becomes false, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
