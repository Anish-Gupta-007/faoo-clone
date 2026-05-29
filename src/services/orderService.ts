// src/services/orderService.ts
import { shopifyService } from './shopifyService';
import {
  Order,
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentPayload,
} from '@/types/order.types';

export const orderService = {

  getMyOrders: async (page = 1, limit = 10) => {
    try {
      const res = await shopifyService.getOrders(limit);
      return { success: true, orders: res.data || [], total: res.data?.length || 0, page: 1, pages: 1 };
    } catch (error) {
      console.error("Error fetching Shopify orders:", error);
      return { success: false, orders: [], total: 0, page: 1, pages: 1 };
    }
  },

  getOrder: async (orderId: string): Promise<Order> => {
    const res = await shopifyService.getOrderById(orderId);
    return res.data as any;
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    // Requires Admin API mutation mapping which isn't available yet, stubbing for now
    return {} as any;
  },
};
