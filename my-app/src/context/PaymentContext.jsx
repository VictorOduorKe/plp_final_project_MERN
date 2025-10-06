import axios from "axios";
import { toast } from "react-toastify";

export const paymentStatus = async (user_id) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/payment/status/${user_id}`
    );

    console.log("✅ Payment Status:", res.data);

    // ✅ Use res.status instead of res.ok
    if (res.status !== 200 || res.data.package === "free") {
      toast.error("No active plan found");
    }

    return res.data; // e.g. { package: "free", message: "No active plan found" }
  } catch (error) {
    console.error(
      "❌ no payment plan found:",
      error.response?.data || error.message
    );
    toast.error("Unable to fetch payment status");
    return { package: "free", message: "Unable to fetch status" }; // fallback
  }
};
