'use client';
// src/components/homepage/StyleItWithFaoo.tsx
import { motion } from 'framer-motion';
import { Instagram, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const UGC_POSTS = [


    {
    id: 1,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/2.jpg',
    type: 'portrait',
    size: 'small'
  },
  {
    id: 2,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/5.PNG',
    type: 'portrait',
    size: 'small'
  },
      {
    id: 3,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/1.png',
    type: 'portrait',
    size: 'large'
  },
  {
    id: 4,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/6.jpg',
    type: 'portrait',
    size: 'small'
  },

  {
    id: 5,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/7.PNG',
    type: 'portrait',
    size: 'large'
  },
        {
    id: 7,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/3.png',
    type: 'portrait',
    size: 'small'
  },
    {
    id: 6,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/4.PNG',
    type: 'portrait',
    size: 'large'
  },

  {
    id: 8,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/8.jpeg',
    type: 'portrait',
    size: 'small'
  },
    {
    id: 9,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/11.PNG',
    type: 'portrait',
    size: 'small'
  },
  {
    id: 10,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/9.jpeg',
    type: 'portrait',
    size: 'small'
  },
  {
    id: 11,
    username: '@faoo_official',
    imageUrl: '/images/STWITHFAOO/10.jpeg',
    type: 'portrait',
    size: 'large'
  },

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
                  className="w-full h-full object-contain"
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

