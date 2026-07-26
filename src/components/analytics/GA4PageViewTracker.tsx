'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function PageViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Avoid double-tracking the initial page view on mount, as the main layout
    // script tag's gtag('config', ...) already tracks the initial landing page.
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    try {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'page_view', {
          page_path: url,
        });
      }
    } catch (error) {
      console.error('Failed to send page_view event:', error);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GA4PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  );
}
