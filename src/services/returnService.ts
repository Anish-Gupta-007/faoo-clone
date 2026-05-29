import { shopifyService } from './shopifyService';

export const returnService = {
  checkOrder: async (orderId: string) => {
    // Map to get order by id in Shopify
    const res = await shopifyService.getOrderById(orderId);
    return { success: true, order: res.data };
  },
  
  createReturnRequest: async (data: { orderId: string, requestType: 'Return' | 'Exchange', reason: string, items?: any[] }) => {
    const res = await shopifyService.createReturn(data.orderId, data.items || []);
    return { success: true, returnData: res.data };
  }
};
