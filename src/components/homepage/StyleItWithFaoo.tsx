'use client';
// src/components/homepage/StyleItWithFaoo.tsx
import { motion } from 'framer-motion';
import { Instagram, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const UGC_POSTS = [
  {
    id: 1,
    username: '@tanuj_bhoy',
    imageUrl: '/images/STWITHFAOO/SWF1.png',
    type: 'portrait',
    size: 'large'
  },
  {
    id: 2,
    username: '@faoo_minimal',
    imageUrl: '/images/STWITHFAOO/SWF2.png',
    type: 'portrait',
    size: 'small'
  },
  {
    id: 3,
    username: '@street_style_26',
    imageUrl: '/images/STWITHFAOO/SWF3.jpeg',
    type: 'portrait',
    size: 'small'
  },
  {
    id: 4,
    username: '@minimal_edit',
    imageUrl: '/images/STWITHFAOO/SWF4.jpeg',
    type: 'portrait',
    size: 'large'
  },
  {
    id: 5,
    username: '@aesthetic_faoo',
    imageUrl: '/images/STWITHFAOO/SWF1.png',
    type: 'portrait',
    size: 'small'
  },
  {
    id: 6,
    username: '@fashion_faoo',
    imageUrl: '/images/STWITHFAOO/SWF2.png',
    type: 'portrait',
    size: 'small'
  }
];

export function StyleItWithFaoo() {
  return (
    <section className="py-24 md:py-36 bg-[#e8e5dc] overflow-hidden">
      <div className="container-page px-4">

        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-7xl text-[#0A0A0A] tracking-tighter mb-4"
          >
            STYLE IT WITH FAOO
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-sans text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-[#737373]"
          >
            #faooforall
          </motion.p>
        </div>

        {/* Infinite Carousel Section */}
        <div className="relative mt-8 md:mt-12 overflow-hidden select-none">
          <motion.div
            animate={{ x: [0, -1600] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-2 md:gap-3 whitespace-nowrap"
          >
            {[...UGC_POSTS, ...UGC_POSTS, ...UGC_POSTS, ...UGC_POSTS].map((post, index) => (
              <motion.div
                key={`${post.id}-${index}`}
                className="relative flex-shrink-0 w-[200px] md:w-[280px] aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl cursor-pointer"
              >
                {/* Image */}
                <img
                  src={post.imageUrl}
                  alt={`Styled by ${post.username}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link
            href="https://instagram.com/faoo.official"
            target="_blank"
            className="inline-flex items-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-full border border-[#0A0A0A]/10 flex items-center justify-center group-hover:bg-[#0A0A0A] transition-all duration-500">
              <Instagram size={20} className="text-[#0A0A0A] group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#737373]">Follow our world</p>
              <p className="text-xl font-display text-[#0A0A0A] tracking-tighter">@faoo.official</p>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

