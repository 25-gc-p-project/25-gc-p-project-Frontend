import apiClient from "./client";

export const signupApi = (payload) => {
  return apiClient.post("/api/auth/signup", payload);
};

export const loginApi = (payload) => {
  return apiClient.post("/api/auth/login", payload);
};
