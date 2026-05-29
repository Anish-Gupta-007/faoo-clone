// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { userService } from '@/services/userService';

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout, updateUser } = useAuthStore();
  const fetchCart = useCartStore((s) => s.fetchCart);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);

  useEffect(() => {
    if (isAuthenticated && !user) {
      userService.getProfile().then((profile) => {
        updateUser(profile);
        fetchCart();
        fetchWishlist();
      }).catch(() => logout());
    }
  }, [isAuthenticated]);

  return { user, isAuthenticated, setAuth, logout, updateUser };
}
