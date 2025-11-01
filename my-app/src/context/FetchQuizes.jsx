import axios from "axios";
import { hideConsoleLogInProduction } from "./hideLogs";
// import { hideConsoleLogInProduction } from "./hideLogs"; --- IGNORE ---
export const fetchQuizes = async (user_id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/plan/quizzes`,
      {
        params: { user_id },
      }
    );
    return response.data;
  } catch (error) {
    hideConsoleLogInProduction("Error fetching quizzes:", error);
    throw error;
  }
};

export default fetchQuizes;
