import axios from "axios";

export const submitAnswers = async (answersData) => {
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
    console.log("✅ Answers submitted:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error submitting answers:", error);
    throw error.response?.data || { message: "Submission failed." };
  }
};
