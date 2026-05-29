// src/store/authStore.ts
import { create } from 'zustand';
import { User } from '@/types/user.types';
import { storage } from '@/utils/storage';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrate: () => {
    const token = storage.getAccessToken();
    const refreshToken = storage.getRefreshToken();
    if (token || refreshToken) {
      set({ accessToken: token, isAuthenticated: true, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },

  setAuth: (user, accessToken, refreshToken) => {
    storage.setAccessToken(accessToken);
    storage.setRefreshToken(refreshToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  logout: () => {
    storage.clearTokens();
    set({ user: null, accessToken: null, isAuthenticated: false });
    // Reset cart and wishlist stores upon logout
    if (typeof window !== 'undefined') {
      import('@/store/cartStore').then((m) => m.useCartStore.getState().reset());
      import('@/store/wishlistStore').then((m) => m.useWishlistStore.getState().reset());
    }
  },

  updateUser: (partial) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, ...partial } });
    } else {
      set({ user: partial as User });
    }
  },
}));
