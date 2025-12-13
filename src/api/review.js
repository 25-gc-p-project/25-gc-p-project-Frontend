import apiClient from './client';

export const createReview = async ({ productId, content, score, rating }) => {
  const res = await apiClient.post('/api/reviews', {
    productId,
    content,
    score,
    rating,
  });
  return res.data;
};

export const updateReview = async (
  reviewId,
  { productId, content, score, rating }
) => {
  if (!reviewId) throw new Error('reviewId is required');

  const res = await apiClient.put(`/api/reviews/${reviewId}`, {
    productId,
    content,
    score,
    rating,
  });
  return res.data;
};

export const deleteReview = async (reviewId) => {
  if (!reviewId) throw new Error('reviewId is required');

  const res = await apiClient.delete(`/api/reviews/${reviewId}`);
  return res.data;
};

export const fetchProductReviews = async (productId) => {
  if (!productId) throw new Error('productId is required');

  const res = await apiClient.get(`/api/reviews/products/${productId}`);
  return res.data;
};

export const fetchMyReviews = async () => {
  const res = await apiClient.get('/api/reviews/my');
  return res.data;
};
