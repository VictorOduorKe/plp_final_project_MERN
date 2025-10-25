// context/GeneratePlan.js
import axios from "axios";
import { toast } from "react-toastify";

export const generatePlan = async (user_id, subject_id) => {
  const token=localStorage.getItem("token")
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/plan`, {
      user_id,
      subject_id,
       headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("📘 Generated Plan: sucessfully");
    return response.data;
  } catch (error) {
    toast.error("❌ Error generating plan:", error);
    throw error;
  }
};
