'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface FocusDetail {
  id: string;
  title: string;
  description: string;
  image: string;
}

interface FocusWithFaooProps {
  details?: FocusDetail[];
}

export function FocusWithFaoo({ details }: FocusWithFaooProps) {
  if (!details || details.length === 0) return null;

  const INFINITE_DETAILS = Array(Math.ceil(12 / details.length)).fill(details).flat();

  return (
    <section className="bg-[#F7F7F5] pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden border-y border-[#F0F0F0]/80">
      <div className="container-page mx-auto px-4 md:px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-[10px] tracking-[0.4em] font-sans font-bold text-[#8b0026] uppercase mb-4">
            The Perspective
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight font-light text-[#0A0A0A]">
            FOCUS WITH <span className="italic uppercase">FAOO</span>
          </h2>
        </motion.div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative flex whitespace-nowrap overflow-hidden py-4">
        <motion.div
          animate={{
            x: [0, "-50%"], // Loop exactly half of the duplicated track
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex gap-16 px-8"
        >
          {INFINITE_DETAILS.map((detail, index) => (
            <div
              key={`${detail.id}-${index}`}
              className="w-[260px] md:w-[320px] flex-shrink-0 group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200 rounded-[1px] shadow-sm">
                <img
                  src={detail.image}
                  alt={detail.title}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />
                
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-[9px] font-sans font-bold tracking-widest text-white uppercase bg-[#8b0026] px-3 py-1.5 shadow-lg">
                    Focus 0{String(index % details.length + 1)}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-3 whitespace-normal text-center">
                <h3 className="font-display text-xl tracking-tight font-medium text-[#0A0A0A]">
                  {detail.title}
                </h3>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Subtle Side Fades */}
        <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-[#F7F7F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-[#F7F7F5] to-transparent z-10 pointer-events-none" />
      </div>

    </section>
  );
}
