// src/store/uiStore.ts
import { create } from 'zustand';
import { storage } from '@/utils/storage';

interface UIStore {
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isFirstPopupSeen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  markPopupSeen: () => void;
  hydratePopupState: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isFirstPopupSeen: false,

  hydratePopupState: () => {
    set({ isFirstPopupSeen: storage.isPopupSeen() });
  },

  openCart: () => set({ isCartOpen: true, isMobileMenuOpen: false }),
  closeCart: () => set({ isCartOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true, isCartOpen: false }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  markPopupSeen: () => {
    storage.markPopupSeen();
    set({ isFirstPopupSeen: true });
  },
}));
