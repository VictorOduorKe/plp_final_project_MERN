import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = new URLSearchParams(location.search).get("reference");
      if (reference) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/payment/verify/${reference}`
          );
          console.log("Verified:", res.data);
        } catch (error) {
          console.error("Verification failed:", error.response?.data);
        }
      }
    };
    verifyPayment();
  }, [location.search]);

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-green-600">✅ Payment Successful</h1>
      <p>We’re verifying your transaction…</p>
    </div>
  );
};

export default PaymentSuccess;
