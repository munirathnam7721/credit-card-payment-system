import api from "./api";

export const getCards = async () => {
  const response = await api.get("/cards/");
  return response.data;
};

export const addCard = async (cardData) => {
  const response = await api.post("/cards/add/", cardData);
  return response.data;
};

export const deleteCard = async (cardId) => {
  const response = await api.delete(`/cards/${cardId}/`);
  return response.data;
};