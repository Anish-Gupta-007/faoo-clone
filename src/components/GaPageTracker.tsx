'use client';
// src/components/GaPageTracker.tsx
import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Inner component that reads pathname + searchParams.
 * Must be wrapped in <Suspense> because useSearchParams() opts the subtree
 * into client-side rendering and Next.js requires a Suspense boundary.
 */
function GaTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the very first render — gtag('config', ...) in the Script tag
    // already fires the initial page_view on load.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const pagePath =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: pagePath });
    }
  }, [pathname, searchParams]);

  return null;
}

export function GaPageTracker() {
  return (
    <Suspense fallback={null}>
      <GaTrackerInner />
    </Suspense>
  );
}
