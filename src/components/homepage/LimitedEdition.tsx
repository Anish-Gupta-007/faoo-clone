'use client';
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { LIMITED_EDITION } from '@/constants/staticContent';

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Hang Tag ── */
function HangTag({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      style={{ transformOrigin: '50% 0%' }}
      animate={inView ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
    >
      {/* String */}
      <motion.div
        className="w-[1.5px] bg-[#c9a84c]"
        initial={{ height: 0 }}
        animate={inView ? { height: 72 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease }}
      />
      {/* Eyelet */}
      <div className="w-6 h-6 rounded-full border-2 border-[#c9a84c] bg-[#0F0F0F] -mb-3 z-10 relative" />

      {/* Tag body */}
      <motion.div
        className="relative w-52 bg-[#FAFAF5] border border-[#c9a84c]/60 flex flex-col items-center"
        style={{ paddingTop: '32px', paddingBottom: '24px', paddingLeft: '20px', paddingRight: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25)' }}
        initial={{ opacity: 0, scale: 0.75, y: -20 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.35, ease }}
      >
        {/* Gold stitched border */}
        <div className="absolute inset-3 border border-dashed border-[#c9a84c]/50 pointer-events-none" />

        {/* Gold top stripe */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#c9a84c]" />

        <div className="flex flex-col items-center gap-3 w-full">
          <span className="font-sans text-[8px] tracking-[0.5em] uppercase text-[#1a1a1a]/70 font-bold">FAOO</span>

          <span className="font-display font-black leading-none text-[#1a1a1a]" style={{ fontSize: '68px', letterSpacing: '-0.04em' }}>
            01
          </span>

          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-px bg-[#c9a84c]/60" />
            <span className="text-[7px] font-sans tracking-[0.3em] uppercase text-[#1a1a1a]/50">of 1</span>
            <div className="flex-1 h-px bg-[#c9a84c]/60" />
          </div>

          <span className="font-sans text-[9px] tracking-[0.32em] uppercase text-[#1a1a1a] font-bold">Limited Edition</span>
          <span className="font-sans text-[8px] italic text-[#1a1a1a]/50">Pièce Unique</span>

          {/* Barcode */}
          <div className="flex items-end gap-[2px] mt-2">
            {[4, 6, 2, 7, 3, 6, 2, 5, 7, 3, 2, 6, 5, 3, 7, 2, 5].map((h, i) => (
              <div key={i} className="bg-[#1a1a1a]" style={{ width: '2px', height: `${h * 2.5}px` }} />
            ))}
          </div>
          <span className="font-mono text-[7px] tracking-widest text-[#1a1a1a]/45 mt-1">SS·2025·001</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── T-shirt silhouette ── */
function TShirt({ inView }: { inView: boolean }) {
  const path = 'M140,14 C130,14 108,18 98,30 L50,54 L8,76 L36,110 L70,96 L74,102 L74,246 L206,246 L206,102 L210,96 L244,110 L272,76 L230,54 L182,30 C172,18 150,14 140,14 Z';
  return (
    <svg viewBox="0 0 280 260" className="w-full h-full" fill="none" aria-hidden>
      <motion.path
        d={path}
        stroke="rgba(201,168,76,0.35)"
        strokeWidth="2"
        fill="rgba(201,168,76,0.04)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2.5, delay: 0.5, ease }}
      />
      <motion.path
        d="M118,14 Q140,38 162,14"
        stroke="rgba(201,168,76,0.4)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, delay: 2.8, ease }}
      />
    </svg>
  );
}

/* ── Safety pin SVG ── */
function SafetyPin({ rotate = 0 }: { rotate?: number }) {
  return (
    <svg width="24" height="56" viewBox="0 0 28 60" fill="none" aria-hidden style={{ transform: `rotate(${rotate}deg)` }}>
      <ellipse cx="14" cy="8" rx="7" ry="7" stroke="#c9a84c" strokeWidth="2" />
      <line x1="14" y1="15" x2="14" y2="46" stroke="#c9a84c" strokeWidth="2" />
      <path d="M9 42 Q14 55 19 42" stroke="#c9a84c" strokeWidth="2" fill="none" />
      <circle cx="14" cy="8" r="3" fill="#c9a84c" opacity="0.5" />
    </svg>
  );
}

export function LimitedEdition() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative w-full overflow-hidden min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">

      {/* Split: dark left + light right */}
      <div className="absolute inset-0 hidden lg:flex">
        <div className="w-[45%] bg-[#0F0F0F]" />
        <div className="flex-1 bg-[#F2EBE0]" />
      </div>

      {/* Mobile/Tablet: full dark top, light bottom */}
      <div className="absolute inset-0 lg:hidden flex flex-col">
        <div className="flex-1 bg-[#0F0F0F]" />
        <div className="flex-1 bg-[#F2EBE0]" />
      </div>

      {/* T-shirt silhouette on the split line - hidden on mobile, visible on larger screens */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[32%] w-[280px] h-[260px] pointer-events-none hidden lg:block" aria-hidden>
        <TShirt inView={inView} />
      </div>

      {/* Ghost number — dark side - adjusted for mobile */}
      <div className="absolute left-[2%] top-1/2 -translate-y-1/2 pointer-events-none select-none hidden md:block" aria-hidden>
        <span className="font-display font-black leading-none" style={{ fontSize: 'clamp(80px, 15vw, 280px)', color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.05em' }}>
          01
        </span>
      </div>

      {/* Decorative safety pins - hidden on mobile */}
      <div className="absolute top-10 left-[8%] pointer-events-none opacity-70 hidden md:block">
        <SafetyPin rotate={-20} />
      </div>
      <div className="absolute bottom-10 left-[15%] pointer-events-none opacity-50 hidden md:block">
        <SafetyPin rotate={15} />
      </div>
      <div className="absolute top-1/3 right-[8%] pointer-events-none opacity-60 hidden md:block">
        <SafetyPin rotate={35} />
      </div>

      {/* Gold horizontal rule at the split - hidden on mobile */}
      <div className="absolute top-0 bottom-0 left-[45%] w-px bg-[#c9a84c]/30 pointer-events-none hidden lg:block" />

      {/* Main layout */}
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 md:py-0">
        <div className="flex flex-col lg:flex-row items-stretch" style={{ minHeight: 'auto' }}>

          {/* Left — dark panel: headline */}
          <div className="flex flex-col justify-center lg:w-[44%] py-8 md:py-16 gap-6 md:gap-8 pr-0 lg:pr-12 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              <div className="w-8 h-px bg-[#c9a84c]" />
              <span className="text-[8px] font-sans font-bold tracking-[0.4em] uppercase text-[#c9a84c]/80">
                {LIMITED_EDITION.tag ?? 'Exclusive Drop'}
              </span>
            </motion.div>

            {['Limited', 'Edition'].map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.h2
                  initial={{ y: '105%' }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 0.75, delay: 0.22 + i * 0.14, ease }}
                  className="font-display font-black text-white leading-[0.88]"
                  style={{ fontSize: 'clamp(56px, 8vw, 104px)' }}
                >
                  {word}
                </motion.h2>
              </div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.52, ease }}
              className="flex items-center gap-2"
            >
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-[#c9a84c]"
                animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/40">Active Drop · SS 2025</span>
            </motion.div>
          </div>

          {/* Center: Hang Tag */}
          <div className="hidden lg:flex items-center justify-center w-[12%] relative">
            <HangTag inView={inView} />
          </div>

          {/* Mobile hang tag */}
          <div className="flex lg:hidden justify-center py-6 md:py-8">
            <div className="w-[140px] md:w-[200px]">
              <HangTag inView={inView} />
            </div>
          </div>

          {/* Right — light panel: description + CTA */}
          <div className="flex flex-col justify-center flex-1 py-8 md:py-16 pl-0 lg:pl-12 gap-6 md:gap-8 text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.4, ease }}
              className="font-sans text-[14px] md:text-[15px] text-[#1a1a1a]/65 leading-[1.8] md:leading-[1.9] font-light max-w-full lg:max-w-[380px] mx-auto lg:mx-0"
            >
              {LIMITED_EDITION.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.54, ease }}
              className="flex justify-center lg:justify-start"
            >
              <Link
                href={LIMITED_EDITION.ctaHref ?? '/limited-edition'}
                className="group inline-flex items-center gap-4"
              >
                <div className="relative overflow-hidden bg-[#1a1a1a] px-8 py-4 rounded-full">
                  <div className="absolute inset-0 bg-[#c9a84c] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                  <span className="relative z-10 font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-white group-hover:text-[#1a1a1a] transition-colors duration-300 flex items-center gap-2">
                    {LIMITED_EDITION.ctaText ?? 'Shop Now'}
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Attribute row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.66, ease }}
              className="flex items-center justify-center lg:justify-start gap-6 md:gap-8 pt-6 md:pt-8 border-t border-[#1a1a1a]/10 flex-wrap md:flex-nowrap"
            >
              {[{ v: '1 of 1', l: 'Unique' }, { v: '∞', l: 'Craft' }, { v: '0', l: 'Replicas' }].map((s, i) => (
                <React.Fragment key={s.l}>
                  {i > 0 && <div className="w-px h-8 bg-[#1a1a1a]/12" />}
                  <div className="flex flex-col gap-1">
                    <span className="font-display font-black text-xl text-[#1a1a1a] leading-none">{s.v}</span>
                    <span className="font-sans text-[8px] tracking-[0.28em] uppercase text-[#1a1a1a]/40">{s.l}</span>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
