import api from "./api";

export const getTransactions = async (params = {}) => {
  const response = await api.get("/transactions/", {
    params,
  });

  return response.data;
};