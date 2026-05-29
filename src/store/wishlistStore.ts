// src/store/wishlistStore.ts
import { create } from 'zustand';
import api from '@/lib/axios';
import { queryClient } from '@/lib/queryClient';

interface WishlistStore {
  wishlistIds: string[];
  fetchWishlist: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  reset: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: [],

  fetchWishlist: async () => {
    try {
      const res = await api.get('/wishlist');
      // Backend returns { success, wishlist: [...products] }
      const products = res.data.wishlist || [];
      const ids = products.filter(Boolean).map((p: { _id: string }) => p._id);
      set({ wishlistIds: ids });
    } catch {
      // silently fail
    }
  },

  toggle: async (productId) => {
    const current = get().wishlistIds;
    const isIn = current.includes(productId);
    // Optimistic update
    set({
      wishlistIds: isIn
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    });
    try {
      const res = await api.post(`/wishlist/${encodeURIComponent(productId)}`);
      // Backend returns updated wishlist
      const products = res.data.wishlist || [];
      set({ wishlistIds: products.filter(Boolean).map((p: { _id: string }) => p._id) });
      
      // Invalidate react-query cache to ensure the wishlist page displays the updated items
      queryClient.invalidateQueries({ queryKey: ['wishlist-products'] });
    } catch {
      // Rollback
      set({ wishlistIds: current });
    }
  },

  isInWishlist: (productId) => get().wishlistIds.includes(productId),

  reset: () => set({ wishlistIds: [] }),
}));
