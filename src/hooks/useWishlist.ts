// src/hooks/useWishlist.ts
import { useWishlistStore } from '@/store/wishlistStore';

export function useWishlist() {
  return useWishlistStore();
}
