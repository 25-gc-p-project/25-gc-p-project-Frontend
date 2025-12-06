import apiClient from "./client";

export const fetchUserProfile = () => {
  return apiClient.get("/api/user/profile");
};

export const updateUserProfile = (payload) => {
  return apiClient.put("/api/user/profile", payload);
};
