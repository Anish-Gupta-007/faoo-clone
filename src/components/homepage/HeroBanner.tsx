'use client';
// src/components/homepage/HeroBanner.tsx
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { HERO_BANNERS } from '@/constants/staticContent';
import { useCategoryStore } from '@/store/categoryStore';

interface HeroBannerProps {
  banners?: typeof HERO_BANNERS;
}

export function HeroBanner({ banners = HERO_BANNERS }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCtaHref = (staticHref: string) => {
    if (staticHref === '/men') {
      const match = categories.find((c) =>
        (c.name || '').toLowerCase().startsWith('men') || (c.slug || '').toLowerCase().startsWith('men')
      );
      return match ? `/${match.slug}` : '/men';
    }
    if (staticHref === '/women') {
      const match = categories.find((c) =>
        (c.name || '').toLowerCase().startsWith('women') || (c.slug || '').toLowerCase().startsWith('women')
      );
      return match ? `/${match.slug}` : '/women';
    }
    return staticHref;
  };

  // Separate ref arrays for desktop and mobile videos
  const desktopRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const mobileRefs  = useRef<(HTMLVideoElement | null)[]>([]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  // Play the active video, pause others — for both desktop & mobile refs
  useEffect(() => {
    [desktopRefs, mobileRefs].forEach((refs) => {
      refs.current.forEach((vid, idx) => {
        if (!vid) return;
        if (idx === current) {
          vid.currentTime = 0;
          vid.play().catch(() => { /* autoplay blocked */ });
        } else {
          vid.pause();
        }
      });
    });
  }, [current]);

  const banner = banners[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: 'calc(100vh - var(--navbar-height))' }}
      aria-label="Hero banner"
    >
      {/* Media layers — all mounted, only active one visible */}
      {banners.map((b, idx) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
          aria-hidden={idx !== current}
        >
          {b.videoUrl ? (
            <>
              {/* Desktop video — hidden on mobile */}
              <video
                ref={(el) => { desktopRefs.current[idx] = el; }}
                src={b.videoUrl}
                autoPlay={idx === 0}
                muted
                loop
                playsInline
                preload={idx === 0 ? 'auto' : 'metadata'}
                className="absolute inset-0 w-full h-full object-cover hidden md:block"
              />
              {/* Mobile video — hidden on desktop */}
              <video
                ref={(el) => { mobileRefs.current[idx] = el; }}
                src={b.mobileVideoUrl}
                autoPlay={idx === 0}
                muted
                loop
                playsInline
                preload={idx === 0 ? 'auto' : 'metadata'}
                className="absolute inset-0 w-full h-full object-cover block md:hidden"
              />
            </>
          ) : (
            <>
              {/* Desktop image — hidden on mobile */}
              {b.imageUrl && (
                <img
                  src={b.imageUrl}
                  alt={b.heading || 'Hero Banner'}
                  className="absolute inset-0 w-full h-full object-cover hidden md:block"
                />
              )}
              {/* Mobile image — hidden on desktop */}
              {b.mobileImageUrl && (
                <img
                  src={b.mobileImageUrl}
                  alt={b.heading || 'Hero Banner'}
                  className="absolute inset-0 w-full h-full object-cover block md:hidden"
                />
              )}
            </>
          )}
          {/* Subtle bottom gradient for button legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>
      ))}

      {/* CTA button */}
      <div className="relative z-10 container-page h-full flex flex-col justify-end pb-16 md:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="-translate-y-[3px]"
          >
            <Link
              href={getCtaHref(banner.ctaHref)}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const targetHref = getCtaHref(banner.ctaHref);
                  const targetSlug = targetHref.startsWith('/') ? targetHref.substring(1) : targetHref;
                  sessionStorage.removeItem(`faoo-filters-${targetSlug}`);
                }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Button className="group relative bg-white text-black px-12 py-7 rounded-full text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] uppercase overflow-hidden border-none transition-all duration-500">
                  <span className="relative z-10 flex items-center gap-3">
                    {banner.ctaText}
                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
                  </span>
                  <div className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
