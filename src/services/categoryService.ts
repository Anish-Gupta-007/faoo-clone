// src/services/categoryService.ts
import { Category } from '@/types/category.types';
import { shopifyService } from './shopifyService';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const res = await shopifyService.getCollections(50);
      return (res.data || []).map((col: any) => ({
        _id: col.id,
        name: col.title,
        slug: col.handle,
        parentCategory: null,
        image: col.image?.url || '',
        isActive: true,
        displayOrder: 0
      }));
    } catch (e) {
      console.error('Failed to fetch Shopify collections', e);
      return [];
    }
  },

  getSubcategories: async (slug: string): Promise<Category[]> => {
    // Shopify collections don't have native subcategories without custom metafields or tag hierarchies
    // Returning empty so UI doesn't crash
    return [];
  },
};
