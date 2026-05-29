'use client';
// src/components/Providers.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/queryClient';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { useCategoryStore } from '@/store/categoryStore';
import { userService } from '@/services/userService';
import { SmoothScroll } from '@/components/SmoothScroll';

function StoreHydrator() {
  useEffect(() => {
    const { hydrate, isAuthenticated } = useAuthStore.getState();
    const { hydratePopupState } = useUIStore.getState();
    hydrate();
    hydratePopupState();

    // Pre-fetch categories immediately so homepage components don't block
    useCategoryStore.getState().fetchCategories();

    // Guest cart clearing: on every NEW browser session, clear guest cart
    const authState = useAuthStore.getState();
    const SESSION_KEY = 'faoo-session-active';
    if (typeof window !== 'undefined') {
      const isExistingSession = sessionStorage.getItem(SESSION_KEY);
      if (!isExistingSession) {
        // New session detected
        sessionStorage.setItem(SESSION_KEY, 'true');
        if (!authState.isAuthenticated) {
          // Guest user — clear persisted cart from localStorage and store
          localStorage.removeItem('faoo-cart-storage');
          useCartStore.persist.rehydrate();
          useCartStore.getState().reset();
        }
      }
    }

    // After hydration, check if authenticated and fetch user + cart + wishlist
    if (authState.isAuthenticated) {
      // Fetch user profile if not loaded
      if (!authState.user) {
        userService
          .getProfile()
          .then((user) => {
            useAuthStore.getState().updateUser(user);
          })
          .catch(() => {
            // Token invalid — log out
            useAuthStore.getState().logout();
          });
      }
      useCartStore.getState().fetchCart();
      useWishlistStore.getState().fetchWishlist();
    }
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreHydrator />
      <SmoothScroll>
        {children}
      </SmoothScroll>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '14px',
            borderRadius: '4px',
            background: '#0A0A0A',
            color: '#FFFFFF',
          },
          success: { iconTheme: { primary: '#27AE60', secondary: '#FFFFFF' } },
          error: { iconTheme: { primary: '#C0392B', secondary: '#FFFFFF' } },
        }}
      />
    </QueryClientProvider>
  );
}
