import apiClient from './client';

export const fetchProducts = ({
  page = 0,
  size = 10,
  sort = 'latest',
  sessionId,
} = {}) => {
  return apiClient.get('/api/products', {
    params: { page, size, sort },
    headers: sessionId ? { 'X-Session-Id': sessionId } : {},
  });
};
