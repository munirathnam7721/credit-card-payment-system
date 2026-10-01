import axios from "axios";

const FASTAPI_URL = "http://127.0.0.1:8001/api";

export const makePayment = async (paymentData) => {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.post(
    `${FASTAPI_URL}/payments/`,
    paymentData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};