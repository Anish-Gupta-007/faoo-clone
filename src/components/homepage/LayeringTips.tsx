'use client';
// src/components/homepage/LayeringTips.tsx
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { LAYERING_TIPS } from '@/constants/staticContent';

export function LayeringTips() {
  return (
    <section className="bg-[#e8e5dc] py-16 md:py-24">
      <div className="container-page">
        <SectionHeader heading={LAYERING_TIPS.heading} tag="Style Guide" className="mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LAYERING_TIPS.tips.map((tip, i) => (
            <motion.div
              key={tip.title}
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <div className="aspect-[4/3] bg-[#F5F4F1] rounded-lg overflow-hidden group">
                {tip.imageUrl ? (
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#EFEFEF] to-[#D4D4D4] flex items-center justify-center">
                    <span className="font-display text-4xl text-[#A3A3A3]">{i + 1}</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-display text-xl text-[#0A0A0A] mb-2">{tip.title}</h3>
                <p className="font-sans text-sm text-[#525252] leading-relaxed">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
