import React, { useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const server_url = import.meta.env.VITE_SERVER_URL;

  const navigate = useNavigate();

  const verifyPayment = async () => {
    const response = await axios.post(server_url + "/api/order/verify", {
      success,
      orderId,
    });
    if (response.data.success) {
      navigate("/my-orders");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
