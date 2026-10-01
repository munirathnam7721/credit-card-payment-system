import api from "./api";

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login/", {
    email: loginData.email,
    password: loginData.password,
  });

  return response.data;
};


export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register/",
    userData
  );

  return response.data;
};


export const getProfile = async () => {
  const response = await api.get(
    "/auth/profile/"
  );

  return response.data;
};


export const logoutUser = async (refreshToken) => {
  const response = await api.post(
    "/auth/logout/",
    {
      refresh: refreshToken,
    }
  );

  return response.data;
};