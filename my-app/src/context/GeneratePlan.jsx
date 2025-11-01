// context/GeneratePlan.js
import axios from "axios";
import { toast } from "react-toastify";
import { hideConsoleLogInProduction } from "./hideLogs";
// import { hideConsoleLogInProduction } from "./hideLogs"; --- IGNORE ---

export const generatePlan = async (user_id, subject_id) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/plan`,
      { user_id, subject_id },
      { withCredentials: true }
    );

    toast.success("📘 Generated Plan: successfully");
    return response.data;
  } catch (error) {
    hideConsoleLogInProduction("❌ Error generating plan:", error);
    toast.error("❌ Error generating plan");
    throw error;
  }
};
