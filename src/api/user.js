import apiClient from "./client";

export const fetchUserProfile = () => {
  return apiClient.get("/api/user/profile");
};

export const updateUserProfile = (payload) => {
  return apiClient.put("/api/user/profile", payload);
};

export const updateUserHealth = (payload) => {
  const body = {
    diseaseNames: payload.diseases || [],
    allergyNames: payload.allergies || [],
    healthGoalNames: payload.effects || [],
  };

  return apiClient.post("/api/user/health", body);
};
