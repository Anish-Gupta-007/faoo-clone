'use client';
// src/app/careers/page.tsx
import { motion } from 'framer-motion';
import { CAREERS_CONTENT } from '@/constants/staticContent';
import { MapPin, Briefcase, ArrowRight, Sparkles, Globe, Heart } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="bg-white min-h-screen text-[#0A0A0A] pt-32 pb-20 overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="container-page relative z-10">

        {/* HERO SECTION */}
        <div className="max-w-4xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <Sparkles size={16} className="text-[#8b0026]" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#8b0026]">
                Growth at Faoo
              </span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl tracking-tighter leading-[0.85] mb-12 uppercase italic font-bold text-[#0A0A0A]">
              {CAREERS_CONTENT.heading}
            </h1>
            <p className="font-sans text-xl md:text-2xl text-[#0A0A0A]/60 leading-relaxed font-light max-w-2xl">
              {CAREERS_CONTENT.description}
            </p>
          </motion.div>
        </div>

        {/* CULTURE SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40">
          {CAREERS_CONTENT.culture.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="p-10 rounded-[2rem] bg-[#F9F9F9] border border-[#0A0A0A]/5 hover:bg-[#F0F0F0] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-full bg-[#8b0026]/10 flex items-center justify-center mb-8">
                {i === 0 ? <Sparkles size={20} className="text-[#8b0026]" /> :
                  i === 1 ? <Heart size={20} className="text-[#8b0026]" /> :
                    <Globe size={20} className="text-[#8b0026]" />}
              </div>
              <h3 className="font-display text-2xl mb-4 italic uppercase text-[#0A0A0A]">{item.title}</h3>
              <p className="font-sans text-sm text-[#0A0A0A]/50 leading-relaxed font-light">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* OPEN ROLES SECTION */}
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-16 pb-8 border-b border-[#0A0A0A]/10">
            <h2 className="font-display text-4xl md:text-5xl uppercase italic font-bold tracking-tight text-[#0A0A0A]">
              Open Positions
            </h2>
            <span className="font-mono text-xs text-[#0A0A0A]/30 tracking-widest uppercase">
              [{CAREERS_CONTENT.openRoles.length} ROLES]
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {CAREERS_CONTENT.openRoles.map((role, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group relative"
              >
                <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#F9F9F9] border border-[#0A0A0A]/5 hover:border-[#0A0A0A]/20 transition-all duration-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group-hover:bg-[#F3F3F3]">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#0A0A0A]/5 text-[9px] font-bold tracking-widest uppercase text-[#0A0A0A]/60 border border-[#0A0A0A]/5">
                        {role.type}
                      </span>
                      <span className="flex items-center gap-2 text-[10px] font-sans text-[#0A0A0A]/40 tracking-widest uppercase">
                        <MapPin size={12} /> {role.location}
                      </span>
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl mb-4 italic uppercase text-[#0A0A0A] group-hover:text-[#8b0026] transition-colors duration-500">
                      {role.title}
                    </h3>
                    <p className="font-sans text-sm text-[#0A0A0A]/50 leading-relaxed font-light">
                      {role.description}
                    </p>
                  </div>

                  <a
                    href={`mailto:${CAREERS_CONTENT.email}?subject=Application: ${role.title}`}
                    className="h-16 px-10 rounded-full bg-[#0A0A0A] text-white font-sans text-[10px] font-bold tracking-[0.4em] uppercase flex items-center justify-center gap-4 hover:bg-[#8b0026] transition-all duration-500 active:scale-95 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
                  >
                    Apply Now
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FOOTER CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-40 p-12 md:p-20 rounded-[3rem] bg-[#0A0A0A] text-white flex flex-col items-center text-center gap-8 relative overflow-hidden group/cta"
        >
          {/* Decorative Circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5 blur-3xl group-hover/cta:scale-150 transition-transform duration-1000" />

          <h2 className="font-display text-4xl md:text-6xl tracking-tight leading-none uppercase italic font-bold relative z-10">
            Don&apos;t see your role?
          </h2>
          <p className="font-sans text-lg text-white/60 font-light max-w-xl relative z-10">
            We are always looking for exceptional talent. If you believe you belong here, send us your portfolio and tell us why.
          </p>
          <a
            href={`mailto:${CAREERS_CONTENT.email}`}
            className="inline-flex items-center gap-4 font-sans text-sm font-bold tracking-[0.2em] uppercase border-b-2 border-[#8b0026] pb-2 hover:gap-8 transition-all duration-500 relative z-10 text-white"
          >
            {CAREERS_CONTENT.email}
          </a>
        </motion.div>

      </div>
    </div>
  );
}
