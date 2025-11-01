import axios from "axios";
import { hideConsoleLogInProduction } from "./hideLogs";
// import { hideConsoleLogInProduction } from "./hideLogs"; --- IGNORE ---


export const fetchPlan = async (user_id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/plan`, {
      params: { user_id },
    });
    if(response){
      hideConsoleLogInProduction("Fetched Plan (from API):", response.data);
      return response.data; 
    }
    hideConsoleLogInProduction("no plan found");
  } catch (error) {
    hideConsoleLogInProduction("Fetch plan failed:", error);
    throw error;
  }
};

export const fetchPlanBySubject = async (user_id, subject_id) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/plan?user_id=${user_id}&subject_id=${subject_id}`
    );
    hideConsoleLogInProduction(res.data);
    return res.data;
  } catch (error) {
    hideConsoleLogInProduction("Error fetching plan by subject:", error);
    throw error;
  }
};


export const fetchPracticeExams = async (user_id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/plan/practice-exams`,
      {
        params: { user_id },
        timeout: 20000, // ⏱️ 20 seconds
        withCredentials: true,
      }
    );

    hideConsoleLogInProduction("✅ Fetched Practice Exams:", response.data);
    if (!response.data) {
    hideConsoleLogInProduction("NO data found");
      return null;
    }
    return response.data;
  } catch (error) {
    hideConsoleLogInProduction("❌ Fetch practice exams failed:", error);
    throw error;
  }
};


