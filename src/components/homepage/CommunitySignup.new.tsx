'use client';
// src/components/homepage/CommunitySignup.tsx - REDESIGNED
import { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { newsletterService } from '@/services/newsletterService';
import toast from 'react-hot-toast';
import Image from 'next/image';

const ease = [0.22, 1, 0.36, 1] as const;

// Ambient animated elements - subtle community presence
const AMBIENT_ELEMENTS = [
  { id: 1, initialX: '10%', initialY: '15%', delay: 0, size: 'sm' },
  { id: 2, initialX: '85%', initialY: '25%', delay: 0.3, size: 'xs' },
  { id: 3, initialX: '20%', initialY: '75%', delay: 0.6, size: 'xs' },
  { id: 4, initialX: '90%', initialY: '65%', delay: 0.2, size: 'sm' },
];

function AmbientGlow({ element }: { element: typeof AMBIENT_ELEMENTS[0] }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none will-change-transform ${element.size === 'sm' ? 'w-40 h-40' : 'w-24 h-24'
        } bg-gradient-to-br from-[#c9a84c]/5 to-[#c9a84c]/0`}
      style={{
        left: element.initialX,
        top: element.initialY,
      }}
      animate={{
        y: [0, 20, 0],
        x: [0, 10, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 6 + element.delay,
        delay: element.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export function CommunitySignup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: false, margin: '-50px' });

  // Track scroll relative to this section and the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  // Coordinated image transition: comes from above as user scrolls into section
  const choY = useTransform(scrollYProgress, [0, 0.3, 1], [60, 20, -10]);
  const choOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.7, 1]);
  const choScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 0.95, 1]);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await newsletterService.subscribe(email);
      toast.success('Welcome to the Faoo community!');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative bg-white py-32 md:py-40 lg:py-48 overflow-hidden"
    >
      {/* Ambient glow animations - community presence */}
      <div className="absolute inset-0 pointer-events-none">
        {AMBIENT_ELEMENTS.map((element) => (
          <AmbientGlow key={element.id} element={element} />
        ))}
      </div>

      <div className="container-page px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Scroll-linked Cho image - appears to continue from CHONote */}
          <motion.div
            style={{
              y: choY,
              opacity: choOpacity,
              scale: choScale,
            }}
            className="flex justify-center mb-16 md:mb-24 lg:mb-32"
          >
            <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg will-change-transform">
              <Image
                src="/Cho copy.webp"
                alt="Cho - Faoo Community"
                width={500}
                height={500}
                className="w-full h-full object-cover"
                priority
              />
              {/* Subtle premium overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0A0A0A]/5 to-transparent rounded-2xl md:rounded-3xl" />
            </div>
          </motion.div>

          {/* Premium Community Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease }}
            className="text-center"
          >
            {/* Premium label with animation */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="mb-6 md:mb-8"
            >
              <span className="inline-flex items-center gap-3 text-[11px] md:text-[12px] font-sans font-bold tracking-[0.3em] uppercase text-[#1a1a1a]/50">
                <motion.span
                  className="w-6 h-px bg-gradient-to-r from-transparent to-[#c9a84c]"
                  initial={{ width: 0 }}
                  animate={inView ? { width: 24 } : {}}
                  transition={{ duration: 0.8, delay: 0.3, ease }}
                />
                Our Community
                <motion.span
                  className="w-6 h-px bg-gradient-to-l from-transparent to-[#c9a84c]"
                  initial={{ width: 0 }}
                  animate={inView ? { width: 24 } : {}}
                  transition={{ duration: 0.8, delay: 0.3, ease }}
                />
              </span>
            </motion.div>

            {/* Heading - Premium typography */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease }}
              className="font-display font-black text-[#0A0A0A] leading-tight mb-6 md:mb-8"
              style={{ fontSize: 'clamp(36px, 8vw, 60px)' }}
            >
              Join The Faoo Community
            </motion.h2>

            {/* Subheading - Emotional & Clear */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease }}
              className="font-sans text-[15px] md:text-[17px] text-[#1a1a1a]/70 leading-relaxed mb-10 md:mb-14 max-w-2xl mx-auto"
            >
              Connect with craftspeople, collectors, and creators who understand that style is personal. Get early access to drops, exclusive events, and belong to a community built on authenticity.
            </motion.p>

            {/* Community Value Props - Subtle animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.45, ease }}
              className="grid grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16 max-w-2xl mx-auto"
            >
              {[
                { label: 'Early Access', icon: '✦' },
                { label: 'Community', icon: '◆' },
                { label: 'Exclusive', icon: '✦' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease }}
                  className="flex flex-col items-center gap-2"
                >
                  <span className="text-[#c9a84c] text-lg md:text-xl">{item.icon}</span>
                  <p className="text-[11px] md:text-[12px] font-sans font-bold tracking-[0.2em] uppercase text-[#1a1a1a]/60">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Email Form - Clean & Inviting */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.55, ease }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 justify-center"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 md:px-6 py-3 md:py-3.5 bg-white border border-[#1a1a1a]/12 rounded-lg text-[#1a1a1a] text-sm md:text-[15px] placeholder:text-[#1a1a1a]/30 font-sans focus:outline-none focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 transition-all duration-300 sm:flex-1"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 md:px-10 py-3 md:py-3.5 bg-[#c9a84c] text-[#0F0F0F] rounded-lg font-sans font-bold text-[12px] md:text-[13px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#d4b85a] hover:shadow-xl hover:shadow-[#c9a84c]/15 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <>
                    <span>Join</span>
                    <ArrowRight size={16} className="hidden sm:inline" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Trust & Privacy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.65, ease }}
              className="font-sans text-[10px] md:text-[11px] text-[#1a1a1a]/40 tracking-[0.15em] uppercase"
            >
              No spam · Privacy first · Unsubscribe anytime
            </motion.p>
          </motion.div>

          {/* Bottom decorative element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease }}
            className="mt-20 md:mt-24 flex justify-center"
          >
            <motion.div
              className="h-px w-16 bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
