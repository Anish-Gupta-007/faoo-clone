import api from '@/lib/axios';

export interface PostReviewParams {
  productId?: string;
  productHandle?: string;
  rating: number;
  reviewText: string;
}

export const reviewService = {
  getProductReviews: async (productId: string) => {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },

  postReview: async (data: PostReviewParams) => {
    const res = await api.post('/reviews', data);
    return res.data;
  }
};
