'use client';
// src/components/homepage/AccessoriesSection.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ACCESSORIES_SECTION } from '@/constants/staticContent';
import { useCategoryStore } from '@/store/categoryStore';

export function AccessoriesSection() {
  const { categories } = useCategoryStore();
  const accessoriesCategory = categories.find((cat) => cat.slug === 'accessories');
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = accessoriesCategory?.subcategories && accessoriesCategory.subcategories.length > 0
    ? accessoriesCategory.subcategories.map((sub) => ({
      label: sub.name,
      href: `/${accessoriesCategory.slug}/${sub.slug}`,
      imageUrl: sub.image,
    }))
    : ACCESSORIES_SECTION.items;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-[#FAFAFA]">
      <div className="container-page mb-8 flex flex-col md:flex-row justify-center md:justify-between items-center gap-6 text-center">
        <div className="flex flex-col items-center">
          <h2 className="font-display text-3xl md:text-4xl text-[#0A0A0A]">{ACCESSORIES_SECTION.heading}</h2>
          <p className="font-sans text-sm text-[#A3A3A3] mt-2">Finish your outfit with the right details.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center hover:bg-[#8b0026] hover:text-[#151515] hover:border-[#8b0026] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center hover:bg-[#8b0026] hover:text-[#151515] hover:border-[#8b0026] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-8 md:gap-12 overflow-x-auto pl-4 md:pl-32 pr-4 md:pr-20 pb-8 scrollbar-hide snap-x"
      >
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="flex-shrink-0 w-64 md:w-80 snap-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link
              href={item.href}
              className="group block relative overflow-hidden rounded-[32px] aspect-[4/5] bg-[#F5F4F1] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-500 border border-[#151515]/5"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#EFEFEF] to-[#D4D4D4] transition-transform duration-700 group-hover:scale-105 flex items-center justify-center">
                  <span className="font-display text-5xl text-[#A3A3A3]">{item.label[0]}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <h3 className="font-display text-3xl text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{item.label}</h3>
                <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-[#8b0026] text-[#151515] flex items-center justify-center">
                    <ChevronRight size={20} />
                  </div>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
