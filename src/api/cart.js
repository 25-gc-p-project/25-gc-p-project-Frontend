import apiClient from './client';

export const fetchCart = async () => {
  const res = await apiClient.get('/api/carts');
  return res.data;
};

export const addCartItem = async ({ productId, count }) => {
  const res = await apiClient.post('/api/carts', {
    productId,
    count,
  });
  return res.data;
};

export const deleteCartItem = async (cartId) => {
  const res = await apiClient.delete(`/api/carts/${cartId}`);
  return res.data;
};
