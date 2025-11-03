import axios from "axios"
import { hideConsoleLogInProduction } from "./hideLogs";
// import { hideConsoleLogInProduction } from "./hideLogs"; --- IGNORE ---

export const fetchPlanBySubject = async (user_id, subject_id) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/plan?user_id=${user_id}&subject_id=${subject_id}`
    );
    return res.data;
  } catch (error) {
    hideConsoleLogInProduction("Error fetching plan by subject:", error);
    throw error;
  }
};