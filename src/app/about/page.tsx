// src/app/about/page.tsx
'use client';
import { motion } from 'framer-motion';
import { ABOUT_CONTENT } from '@/constants/staticContent';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const VALUE_COLORS: Record<string, string> = {
  F: 'rgba(201,168,76,0.15)',
  A: 'rgba(139,0,38,0.12)',
};

export default function AboutPage() {
  const paragraphs = ABOUT_CONTENT.story.split('\n\n').filter(Boolean);

  return (
    <main className="bg-[#F9F8F5] min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0A0A0A] text-white">
        {/* Ambient glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(139,0,38,0.07) 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 pt-28 pb-20 md:pt-36 md:pb-28 text-center">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <div className="w-5 h-[1px] bg-[#c9a84c]" />
            <span className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-[#c9a84c]">
              Our Story
            </span>
            <div className="w-5 h-[1px] bg-[#c9a84c]" />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black text-white tracking-tight leading-[0.92] mb-8"
            style={{ fontSize: 'clamp(52px, 10vw, 110px)' }}
          >
            {ABOUT_CONTENT.heading}
          </motion.h1>

          {/* Hashag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm font-sans font-bold tracking-[0.35em] uppercase text-[#c9a84c]/60"
          >
            #faooforall
          </motion.p>
        </div>

        {/* Bottom rule */}
        <div className="w-full h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2) 40%, rgba(201,168,76,0.2) 60%, transparent)' }} />
      </section>

      {/* ── Story Section ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col gap-6"
        >
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className="font-sans text-base md:text-lg text-[#3a3a3a] leading-[1.85] font-light"
            >
              {para}
            </motion.p>
          ))}
        </motion.div>
      </section>

      {/* ── Values Section ── */}
      <section className="bg-[#0A0A0A] text-white py-20 md:py-28 border-t border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 md:px-10">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14 md:mb-20"
          >
            <p className="text-[10px] font-sans font-bold tracking-[0.4em] uppercase text-[#c9a84c] mb-5">
              What We Stand For
            </p>
            <h2 className="font-display font-black text-white tracking-tight"
              style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}>
              Our Values
            </h2>
          </motion.div>

          {/* F · A · O · O cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
          >
            {ABOUT_CONTENT.values.map((v, i) => {
              const val = v as any;
              const letter: string = val.letter ?? val.title?.[0] ?? '?';
              const accentBg = VALUE_COLORS[letter] || 'rgba(255,255,255,0.04)';
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="relative group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9 overflow-hidden hover:border-[#c9a84c]/20 transition-colors duration-500 backdrop-blur-sm"
                >
                  {/* Large letter watermark */}
                  <span
                    className="absolute top-4 right-6 font-display font-black leading-none select-none pointer-events-none"
                    style={{
                      fontSize: 'clamp(72px, 10vw, 108px)',
                      color: 'rgba(255,255,255,0.03)',
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {letter}
                  </span>

                  {/* Accent glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at 20% 50%, ${accentBg}, transparent 70%)` }}
                  />

                  {/* Letter badge */}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center mb-5 border border-white/[0.08]"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <span className="font-display font-black text-lg text-[#c9a84c] leading-none">
                      {letter}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="relative z-10 font-display font-bold text-white text-xl md:text-2xl mb-3 tracking-tight">
                    {val.title}
                  </h3>
                  <p className="relative z-10 font-sans text-sm md:text-base text-white/45 leading-[1.75] font-light">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Closing statement ── */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 py-20 md:py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-display font-black text-[#0A0A0A] leading-tight tracking-tight"
            style={{ fontSize: 'clamp(32px, 6vw, 64px)' }}>
            You are fashion.
          </p>
          <p className="mt-3 text-sm font-sans font-bold tracking-[0.35em] uppercase text-[#c9a84c]">
            #faooforall
          </p>
        </motion.div>
      </section>

    </main>
  );
}
