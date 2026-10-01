import api from "./api";

export const getAdminUsers = async () => {
  const response = await api.get("/admin/users/");
  return response.data;
};

export const getAdminCards = async () => {
  const response = await api.get("/admin/cards/");
  return response.data;
};

export const getAdminTransactions = async () => {
  const response = await api.get("/admin/transactions/");
  return response.data;
};

export const getDailyPaymentSummary = async () => {
  const response = await api.get("/admin/summary/daily/");
  return response.data;
};

export const exportTransactionsCSV = async () => {
  const response = await api.get("/admin/transactions/export/", {
    responseType: "blob",
  });

  return response.data;
};