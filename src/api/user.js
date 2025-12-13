import apiClient from './client';

export const fetchUserProfile = () => {
  return apiClient.get('/api/user/profile');
};

export const updateUserProfile = (payload) => {
  return apiClient.put('/api/user/profile', payload);
};

export const updateUserHealth = (payload) => {
  const body = {
    diseases: payload.diseases || [],
    allergies: payload.allergies || [],
    goals: [...(payload.effects || [])],
  };

  return apiClient.post('/api/user/health', body);
};

export const deleteUserAccount = () => {
  return apiClient.delete('/api/user');
};
