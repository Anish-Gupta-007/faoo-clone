// src/services/couponService.ts
import api from '@/lib/axios';

interface CouponValidateResponse {
  valid: boolean;
  discountAmount?: number;
  message?: string;
  coupon?: { code: string; discountType: string; discountValue: number };
}

export const couponService = {
  validateCoupon: async (couponCode: string, cartTotal: number, paymentMethod?: string): Promise<CouponValidateResponse> => {
    const res = await api.post('/coupons/validate', {
      couponCode,
      cartTotal,
      paymentMethod,
    });
    // Backend returns { success, valid, discountAmount, message?, coupon? }
    return res.data;
  },
};
