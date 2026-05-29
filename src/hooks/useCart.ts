// src/hooks/useCart.ts
import { useCartStore } from '@/store/cartStore';

export function useCart() {
  return useCartStore();
}
