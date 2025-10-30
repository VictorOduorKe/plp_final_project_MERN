import axios from "axios";

export const fetchPlan = async (user_id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/plan`, {
      params: { user_id },
    });
    if(response){
      console.log("Fetched Plan (from API):", response.data);
      return response.data; 
    }
    console.log("no plan found")
  } catch (error) {
    console.error("Fetch plan failed:", error);
    throw error;
  }
};

export const fetchPlanBySubject = async (user_id, subject_id) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/plan?user_id=${user_id}&subject_id=${subject_id}`
    );
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Error fetching plan by subject:", error);
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

    console.log("✅ Fetched Practice Exams:", response.data);
    if (!response.data) {
      console.log("NO data found");
      return null;
    }
    return response.data;
  } catch (error) {
    console.error("❌ Fetch practice exams failed:", error);
    throw error;
  }
};


