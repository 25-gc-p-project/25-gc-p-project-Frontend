import apiClient from "./client";

export const fetchUserProfile = () => {
  return apiClient.get("/api/user/profile");
};
