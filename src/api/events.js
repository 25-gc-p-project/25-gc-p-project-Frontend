import apiClient from './client';

export const sendViewEvent = ({
  productId,
  type = 'CLICK',
  sessionId,
  token,
}) => {
  const headers = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (sessionId) {
    headers['X-Session-Id'] = sessionId;
  }

  return apiClient.post('/api/events/view', null, {
    params: {
      productId,
      type,
    },
    headers,
  });
};
