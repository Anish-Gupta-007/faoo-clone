// src/types/cart.types.ts

export interface CartItem {
  _id: string;
  variantId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug: string;
    primaryImage: string;
    isFreeShipping: boolean;
  };
  variant: {
    color: string;
    size: string;
    fittingType: string;
    sku: string;
    stockQuantity: number;
  };
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  couponCode: string;
  discountAmount: number;
  totalAmount: number;
  checkoutUrl?: string;
}

export interface AddCartItemPayload {
  variantId: string;
  productId: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  variantId: string;
  quantity: number;
}

export interface ApplyCouponPayload {
  code: string;
}
