'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { cn } from '@/lib/cn';

interface IRLImage {
  id: string;
  url: string;
  handle?: string;
}

interface IRLSectionProps {
  images?: IRLImage[];
  className?: string;
}

export function IRLSection({ images, className }: IRLSectionProps) {
  if (!images || images.length === 0) return null;
  // Duplicate images for seamless loop
  const infiniteImages = [...images, ...images, ...images, ...images];

  return (
    <section className={cn("bg-[#F9F9F7] pt-12 md:pt-16 pb-24 md:pb-32 overflow-hidden border-b border-[#F0F0F0]/50", className)}>
      <div className="container-page mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="font-display text-4xl md:text-6xl tracking-[0.05em] font-light text-[#0A0A0A] mb-4">
            IN REAL LIFE
          </h2>
        </motion.div>
      </div>

      <div className="relative group">
        {/* Infinite Carousel Container */}
        <div className="flex whitespace-nowrap overflow-hidden py-4">
          <motion.div
            className="flex gap-16 px-8"
            animate={{
              x: [0, `-${(100 / 4) * 1}%`],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
            whileHover={{ animationPlayState: 'paused' }}
          >
            {infiniteImages.map((img, idx) => (
              <div
                key={`${img.id}-${idx}`}
                className="relative w-[260px] md:w-[320px] aspect-[4/5] flex-shrink-0 group/card"
              >
                <div className="w-full h-full overflow-hidden bg-neutral-200 rounded-[1px]">
                  <img
                    src={img.url}
                    alt="IRL Perspective"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-500" />
                </div>

                {/* Handle Overlay */}
                <div className="absolute bottom-6 left-6 opacity-0 group-hover/card:opacity-100 transition-all duration-500 transform translate-y-2 group-hover/card:translate-y-0 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
                    <Instagram size={14} className="text-white" />
                  </div>
                  <span className="text-[10px] font-sans font-bold tracking-widest text-white uppercase drop-shadow-md">
                    {img.handle}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Gradient Edge Fades */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-[#F9F9F7] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-[#F9F9F7] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}

