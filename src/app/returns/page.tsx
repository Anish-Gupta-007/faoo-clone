'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion';
import {
  RotateCcw,
  Package,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Mail,
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { RETURNS_CONTENT } from '@/constants/staticContent';
import { cn } from '@/lib/cn';
import { ReturnsPortal } from '@/components/returns/ReturnsPortal';

// Spotlight Card Component
const SpotlightCard = ({
  icon: Icon,
  title,
  description,
  index
}: {
  icon: any;
  title: string;
  description: string;
  index: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      className="group relative bg-[#FCFCFC] border border-[#EFEFEF] p-10 rounded-2xl hover:border-[#0A0A0A] transition-colors duration-700 overflow-hidden"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(10, 10, 10, 0.04),
              transparent 80%
            )
          `,
        }}
      />

      <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
        <Icon size={160} strokeWidth={0.5} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-white border border-[#EFEFEF] rounded-xl flex items-center justify-center group-hover:bg-[#0A0A0A] group-hover:text-white group-hover:border-[#0A0A0A] transition-all duration-500 shadow-sm">
            <Icon size={26} strokeWidth={1.2} />
          </div>
          <div className="h-[1px] flex-grow bg-[#EFEFEF] group-hover:bg-[#0A0A0A]/10 transition-colors duration-500" />
        </div>

        <h3 className="font-display text-2xl mb-4 text-[#0A0A0A] tracking-tight leading-tight">
          {title}
        </h3>
        <p className="font-sans text-base text-[#737373] leading-relaxed group-hover:text-[#525252] transition-colors duration-500">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default function ReturnsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const returnIcons = [RotateCcw, Package, CreditCard];
  const exchangeIcons = [RefreshCw, Package, ShieldCheck];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white selection:bg-[#0A0A0A] selection:text-white">
      {/* Grainy Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Background Watermarks */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
          className="absolute top-[20%] -left-20 font-display text-[20vw] leading-none text-[#F9F9F7] font-bold select-none opacity-50"
        >
          POLICY
        </motion.div>
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 200]) }}
          className="absolute bottom-[10%] -right-20 font-display text-[20vw] leading-none text-[#F9F9F7] font-bold select-none opacity-50"
        >
          SERVICE
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-24 overflow-hidden">
        <div className="container-page relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-center gap-3 mb-8">
                <span className="w-12 h-[1px] bg-[#0A0A0A]" />
                <span className="text-[11px] uppercase tracking-[0.4em] text-[#0A0A0A] font-bold">
                  Returns & Exchanges
                </span>
                <span className="w-12 h-[1px] bg-[#0A0A0A]" />
              </div>
              <h1 className="font-display text-7xl md:text-[10rem] text-[#0A0A0A] mb-12 leading-[0.85] tracking-tighter">
                Seamless <br />
                <span className="italic text-[#A3A3A3]">Confidence.</span>
              </h1>
              <p className="font-sans text-xl md:text-2xl text-[#525252] leading-relaxed max-w-2xl mx-auto mb-16">
                At FAOO, we prioritize your satisfaction above all. Our refined return and exchange process is designed to be as effortless as the silhouettes we create.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#0A0A0A]" />
                  7-Day Window
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#A3A3A3]" />
                  Easy Doorstep Pickup
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#A3A3A3]" />
                  Fast Processing
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Returns Flow Portal */}
      <ReturnsPortal />

      {/* Policy Content */}
      <div className="container-page pb-32">
        <div className="space-y-24">

          {/* Returns Section */}
          <section className="relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-2 text-[#A3A3A3] mb-4">
                  <RotateCcw size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Procedure 01</span>
                </div>
                <h2 className="font-display text-5xl md:text-6xl text-[#0A0A0A] tracking-tight">
                  {RETURNS_CONTENT.returns.title}
                </h2>
              </div>
              <div className="max-w-xs text-sm text-[#737373] leading-relaxed md:text-right">
                Request a return within 7 days of delivery for a full refund to your original payment method.
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {RETURNS_CONTENT.returns.items.map((item, idx) => (
                <SpotlightCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={returnIcons[idx]}
                  index={idx}
                />
              ))}
            </div>
          </section>

          {/* Exchange Section */}
          <section className="relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <div className="flex items-center gap-2 text-[#A3A3A3] mb-4">
                  <RefreshCw size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Procedure 02</span>
                </div>
                <h2 className="font-display text-5xl md:text-6xl text-[#0A0A0A] tracking-tight">
                  {RETURNS_CONTENT.exchange.title}
                </h2>
              </div>
              <div className="max-w-xs text-sm text-[#737373] leading-relaxed md:text-right">
                Need a different size or style? Our exchange process ensures you get exactly what you need.
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {RETURNS_CONTENT.exchange.items.map((item, idx) => (
                <SpotlightCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  icon={exchangeIcons[idx]}
                  index={idx}
                />
              ))}
            </div>
          </section>

          {/* Simplified Support Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#0A0A0A] rounded-[2rem] p-12 md:p-20 text-center text-white"
          >
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-1 rounded-full border border-white/10 bg-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                  Always here for you
                </span>
              </div>

              <h2 className="font-display text-5xl md:text-6xl mb-6 tracking-tight">
                Still have questions?
              </h2>

              <p className="font-sans text-lg text-gray-400 mb-10 leading-relaxed">
                Need help with your return or exchange? Our support team is available to assist you with every detail.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="mailto:hello@faoo.in"
                  className="inline-flex items-center gap-3 bg-white text-[#0A0A0A] px-10 py-5 rounded-xl font-bold text-sm tracking-widest uppercase hover:bg-gray-100 transition-colors"
                >
                  <Mail size={18} />
                  hello@faoo.in
                  <ChevronRight size={18} />
                </a>
                <span className="text-gray-500 text-sm font-medium">Response under 24 hours</span>
              </div>
            </div>
          </motion.section>



        </div>
      </div>


      {/* Footer Branding */}
      <footer className="py-12 bg-white">
        <div className="container-page flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="font-display text-2xl font-bold tracking-tighter italic">FAOO.</span>
            <div className="w-[1px] h-4 bg-[#EFEFEF]" />
            <p className="text-[10px] text-[#A3A3A3] tracking-[0.2em] font-medium uppercase">
              The Art of Minimalist Living
            </p>
          </div>
          <p className="text-[10px] text-[#D4D4D4] font-medium uppercase tracking-[0.3em]">
            © 2026 ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
}


