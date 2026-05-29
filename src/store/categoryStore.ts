// src/store/categoryStore.ts
import { create } from 'zustand';
import { categoryService } from '@/services/categoryService';
import { CategoryWithSubs } from '@/types/category.types';

interface CategoryState {
  categories: CategoryWithSubs[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    // Prevent refetching if we already have data
    if (get().categories.length > 0 || get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const topLevel = await categoryService.getCategories();
      
      const tree = await Promise.all(
        topLevel.map(async (cat) => {
          const subs = await categoryService.getSubcategories(cat.slug);
          return { ...cat, subcategories: subs };
        })
      );
      
      set({ categories: tree, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch categories', 
        isLoading: false 
      });
    }
  },
}));
