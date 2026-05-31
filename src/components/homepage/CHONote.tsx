'use client';
// src/components/homepage/CHONote.tsx
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { CHO_NOTE } from '@/constants/staticContent';

const ease = [0.22, 1, 0.36, 1] as const;

export function CHONote() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: '0px' });

  // Track scroll from section start to well past it
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Image parallax: moves up and fades as user scrolls past
  const photoY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -40, -80]);
  const photoOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);
  const photoScale = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.98, 0.95]);

  return (
    <section ref={sectionRef} className="bg-[#F9F9F7] py-20 md:py-28 relative">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-4xl mx-auto">
          {/* Photo - Scroll-linked parallax transition */}
          <motion.div
            ref={photoRef}
            className="bg-[#EFEFEF] rounded-lg md:order-2 max-w-sm mx-auto md:mx-0 w-full flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            {CHO_NOTE.photoUrl ? (
              <img
                id="cho-image-start-placeholder"
                src={CHO_NOTE.photoUrl}
                alt={CHO_NOTE.name}
                className="w-full h-auto object-cover rounded-lg will-change-transform"
              />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-b from-[#E5E5E5] to-[#D4D4D4] flex items-center justify-center rounded-lg">
                <span className="font-display text-6xl text-[#A3A3A3]">{CHO_NOTE.name[0]}</span>
              </div>
            )}
          </motion.div>

          {/* Note */}
          <motion.div
            className="md:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-xs font-sans font-medium tracking-widest uppercase text-[#A3A3A3] mb-6">
              A Note From
            </p>
            <blockquote className="font-sans text-[15px] md:text-[20px] text-[#0A0A0A]/90 font-light leading-relaxed mb-8">
              &ldquo;{CHO_NOTE.note}&rdquo;
            </blockquote>
            <div>
              <p className="font-display text-3xl text-[#0A0A0A] italic">{CHO_NOTE.signature}</p>
              <p className="font-sans text-sm text-[#A3A3A3] mt-1">{CHO_NOTE.role}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
