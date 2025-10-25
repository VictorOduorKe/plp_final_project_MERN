import axios from "axios"

export const fetchPlanBySubject = async (user_id, subject_id) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/plan?user_id=${user_id}&subject_id=${subject_id}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching plan by subject:", error);
    throw error;
  }
};