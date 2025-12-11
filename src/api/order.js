import apiClient from './client';

export const createOrder = async (items) => {
  const res = await apiClient.post('/api/orders', items);
  return res.data;
};

export const fetchOrders = async () => {
  const res = await apiClient.get('/api/orders');
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await apiClient.post(`/api/orders/${orderId}/cancel`);
  return res.data;
};
