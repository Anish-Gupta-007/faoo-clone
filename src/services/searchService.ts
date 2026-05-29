// src/services/searchService.ts
import api from '@/lib/axios';
import { Product } from '@/types/product.types';

export const searchService = {
  search: async (query: string, page = 1) => {
    const res = await api.get(
      `/search?q=${encodeURIComponent(query)}&page=${page}`
    );
    // Backend returns { success, products, total, page, pages }
    return {
      success: res.data.success,
      data: res.data.products ?? [],
      total: res.data.total ?? 0,
      page: res.data.page ?? 1,
      pages: res.data.pages ?? 1,
    };
  },
};
