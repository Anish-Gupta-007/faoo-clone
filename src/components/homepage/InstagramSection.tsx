'use client';
import { Instagram, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const HANDLE = 'faoo.official';
const IG_URL = `https://www.instagram.com/${HANDLE}/`;

function getDefaultH() {
  if (typeof window === 'undefined') return 660;
  if (window.innerWidth <= 480) return 480;
  if (window.innerWidth <= 768) return 560;
  return 660;
}

export function InstagramSection() {
  const [iframeH, setIframeH] = useState(getDefaultH);
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const latestH = useRef(getDefaultH());

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!e.data) return;
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        const h = d?.details?.height ?? d?.data?.height ?? d?.height;
        if (h && Number(h) > 80) {
          const clamped = Math.ceil(Number(h));
          if (Math.abs(clamped - latestH.current) > 2) {
            latestH.current = clamped;
            setIframeH(clamped);
          }
        }
      } catch (_e) {
        void _e;
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const onIframeLoad = () => {
    setIsLoaded(true);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc?.body?.scrollHeight && doc.body.scrollHeight > 80) {
        const h = doc.body.scrollHeight;
        latestH.current = h;
        setIframeH(h);
      }
    } catch (_e) {
      void _e;
    }
  };

  return (
    <section className="container-page py-20 md:py-32">
      {/* Aesthetic Header */}
      <div className="flex flex-col items-center text-center mb-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-[1px] w-10 bg-[#8b0026]/20" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#8b0026]">
            Follow Along
          </span>
          <div className="h-[1px] w-10 bg-[#8b0026]/20" />
        </div>

        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#0A0A0A] mb-1 leading-tight tracking-tight">
          We're on Instagram
        </h2>

        <p className="font-sans text-sm md:text-base text-[#525252] leading-relaxed mb-4 italic">
          Catch our latest drops, vibes & moments — live from the studio.
        </p>

        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#0A0A0A] text-[#E8E5DC] rounded-lg text-[10px] font-sans font-bold tracking-[0.15em] uppercase hover:bg-[#151515] transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Instagram size={14} />
          <span>@{HANDLE}</span>
          <ExternalLink size={12} className="opacity-60" />
        </a>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full relative border border-gray-200 rounded-2xl"
        style={{
          overflow: 'hidden',
          lineHeight: 0,
          height: `${iframeH}px`,
          transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#F5F4F1] animate-pulse rounded-2xl" />
      )}
      <iframe
        ref={iframeRef}
        title="FAOO Instagram Feed"
        src={`https://www.instagram.com/${HANDLE}/embed/`}
      width="100%"
      height={iframeH}
      onLoad={onIframeLoad}
      style={{
        border: 'none',
        display: 'block',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
      }}
      scrolling="no"
      allow="encrypted-media"
      loading="lazy"
        />
    </motion.div>

    </section >
  );
}