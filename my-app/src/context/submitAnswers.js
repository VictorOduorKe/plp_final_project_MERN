import axios from "axios";
import { hideConsoleLogInProduction } from "./hideLogs";

export const submitAnswers = async (answersData) => {
  if(!answersData.subject_id ){
    hideConsoleLogInProduction("❌ Subject ID is required.");
    return { message: "Subject ID is required." };
  }
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/answers/submit`,
      {
        user_id: answersData.user_id,
        subject_id: answersData.subject_id,
        exam_id: answersData.exam_id,
        answers: answersData.answers,
      }
    );
    hideConsoleLogInProduction(answersData.subject_id);
    hideConsoleLogInProduction("✅ Answers submitted:", response.data);
    return response.data;
  } catch (error) {
    hideConsoleLogInProduction("❌ Error submitting answers:", error);
    throw error.response?.data || { message: "Submission failed." };
  }
};
