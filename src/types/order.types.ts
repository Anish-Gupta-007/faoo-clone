// src/types/order.types.ts

import { Address } from './user.types';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'COD' | 'Prepaid';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  _id: string;
  variantId: string;
  productId: string;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: string;
  addressSnapshot: Address;
  items: OrderItem[];
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId: string;
  couponCode: string;
  discountAmount: number;
  shippingCharge: number;
  totalAmount: number;
  deliveryTimeline: string;
  trackingId: string;
  createdAt: string;
}

export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface CreateOrderResponse {
  order: Order;
  razorpayOrderId?: string;
  razorpayKeyId?: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
