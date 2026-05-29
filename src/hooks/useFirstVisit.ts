// src/hooks/useFirstVisit.ts
'use client';
import { useEffect, useRef } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';

/**
 * Shows the popup after user has scrolled for at least 5 seconds.
 * Respects localStorage flag and auth state.
 */
export function useFirstVisit() {
  const { isFirstPopupSeen, markPopupSeen, hydratePopupState } = useUIStore();
  const { user, isAuthenticated } = useAuthStore();
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStartedTimer = useRef(false);

  useEffect(() => {
    hydratePopupState();
  }, []);

  // Determine if popup should ever show
  const shouldShow = () => {
    if (isFirstPopupSeen) return false;
    if (isAuthenticated && user && !user.isFirstOrder) return false;
    return true;
  };

  useEffect(() => {
    if (!shouldShow()) return;

    const handleScroll = () => {
      if (hasStartedTimer.current) return;
      hasStartedTimer.current = true;
      scrollTimer.current = setTimeout(() => {
        useUIStore.setState({ isFirstPopupSeen: false }); // trigger render
      }, 5000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [isFirstPopupSeen, isAuthenticated, user]);

  return { shouldShowPopup: shouldShow, markPopupSeen };
}
