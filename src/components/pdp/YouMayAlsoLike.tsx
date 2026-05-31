'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { ProductCard } from '@/components/plp/ProductCard';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface YouMayAlsoLikeProps {
  categorySlug: string;
  currentProductId: string;
}

export function YouMayAlsoLike({ categorySlug, currentProductId }: YouMayAlsoLikeProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: productsRes, isLoading } = useQuery({
    queryKey: ['related-products', categorySlug, currentProductId],
    queryFn: () => productService.getProducts({ category: categorySlug, limit: 12 }),
    enabled: !!categorySlug,
  });

  const products = (productsRes?.data || [])
    .filter((p: any) => p._id !== currentProductId)
    .slice(0, 8);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollWidth - scrollLeft - clientWidth > 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const { clientWidth } = carouselRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 500);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#8b0026]" size={24} />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-t border-[#EFEFEF]">
      <div className="container-page px-4">
        {/* Header with Navigation arrows */}
        <div className="flex items-center justify-between mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-xl md:text-3xl text-[#151515] tracking-[0.1em] flex items-center gap-4"
          >
            <span className="h-[1px] w-8 bg-black/10"></span>
            YOU MAY ALSO LIKE
          </motion.h2>

          <div className="flex gap-2">
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-[#151515]/10 flex items-center justify-center text-[#151515] transition-all hover:bg-[#151515] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#151515]"
              aria-label="Previous products"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-[#151515]/10 flex items-center justify-center text-[#151515] transition-all hover:bg-[#151515] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#151515]"
              aria-label="Next products"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-1 -mx-1 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product: any, idx: number) => (
              <div
                key={product._id}
                className="w-[200px] md:w-[260px] flex-shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
