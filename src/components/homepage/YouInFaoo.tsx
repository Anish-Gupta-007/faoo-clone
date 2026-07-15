'use client';
// src/components/homepage/YouInFaoo.tsx
import Image from 'next/image';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    name: 'Aastha',
    image: '/youndfaoo/Aastha.jpg',
    review: 'I got this Aura Blue Top and Pants for my vacation and now I have been wearing it everywhere I go. From vacation, to office, to brunch plans—it’s my favourite. Love the fabric and fit.'
  },
  {
    name: 'Sarthak',
    image: '/youndfaoo/Sarthak.jpg',
    review: 'The Summer Icon Satin Shirt fits and looks so good. I like the quality and look. Worth the money.'
  },
  {
    name: 'Kunaal',
    image: '/youndfaoo/Kunaal.jpg',
    review: "I'm a tall guy, 6'4\" and it's very difficult for me to find clothes that fit me but Faoo customised them so well that I literally wear Faoo throughout the week now. They got me sorted. 100% recommend their product, fit and price point."
  }
];

export function YouInFaoo() {
  return (
    <section className="bg-white pt-2 pb-10 md:pt-4 md:pb-16 overflow-hidden border-b border-gray-100">
      <div className="container-page px-4 md:px-6">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-3"
          >
            <div className="h-[1px] w-10 bg-[#8b0026]/20" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-[#8b0026]">
              Community
            </span>
            <div className="h-[1px] w-10 bg-[#8b0026]/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl text-[#0A0A0A] leading-tight tracking-tight uppercase"
          >
            You in Faoo
          </motion.h2>
        </div>

        {/* Carousel / Grid Container */}
        <div className="relative mt-8">
          <div
            className="flex gap-6 lg:gap-8 overflow-x-auto lg:overflow-x-visible scroll-smooth pb-6 px-4 -mx-4 lg:px-0 lg:mx-0 snap-x snap-mandatory lg:grid lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TESTIMONIALS.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-[280px] sm:w-[350px] md:w-[calc(50%-12px)] lg:w-full flex-shrink-0 snap-start bg-[#FAF9F5] p-5 md:p-6 rounded-[24px] border border-[#EAE6DF]/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col h-auto"
              >
                {/* Image first */}
                <div className="relative aspect-[4/5] w-full rounded-[18px] overflow-hidden mb-5 bg-[#F5F4F1] border border-[#151515]/5">
                  <Image
                    src={item.image}
                    alt={`${item.name} wearing Faoo`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105"
                  />
                </div>

                {/* Content section */}
                <div className="flex flex-col flex-grow">
                  {/* Customer name below image */}
                  <h3 className="font-display text-base font-bold text-[#151515] tracking-[0.05em] mb-2 uppercase">
                    {item.name}
                  </h3>
                  {/* Review below name */}
                  <p className="font-sans text-[13px] md:text-sm text-[#525252] leading-relaxed italic flex-grow">
                    &ldquo;{item.review}&rdquo;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
