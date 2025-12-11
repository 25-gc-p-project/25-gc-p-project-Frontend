import apiClient from './client';

export const fetchProducts = async ({
  page = 0,
  size = 10,
  sort = 'latest',
  sessionId,
}) => {
  const res = await apiClient.get('/api/products', {
    params: { page, size, sort },
    headers: sessionId ? { 'X-Session-Id': sessionId } : {},
  });
  return res.data;
};

export const searchProducts = async ({
  keyword,
  page = 0,
  size = 10,
  sort = 'latest',
  sessionId,
}) => {
  const res = await apiClient.get('/api/products/search', {
    params: { keyword, page, size, sort },
    headers: sessionId ? { 'X-Session-Id': sessionId } : {},
  });
  return res.data;
};

export const fetchRecommendedProducts = async (sessionId) => {
  const res = await apiClient.get('/api/products/recommend', {
    headers: sessionId ? { 'X-Session-Id': sessionId } : {},
  });
  return res.data;
};

export const fetchProductDetail = async (id, sessionId) => {
  const res = await apiClient.get(`/api/products/${id}`, {
    headers: sessionId ? { 'X-Session-Id': sessionId } : {},
  });
  return res.data;
};
