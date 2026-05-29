'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getTagBadges } from '@/utils/shopifyTags';

interface ShopifyProductCardProps {
  product: {
    id: string;
    title: string;
    handle: string;
    tags: string[];
    isAvailable?: boolean;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: { url: string; altText: string | null }[];
  };
}

export function ShopifyProductCard({ product }: ShopifyProductCardProps) {
  const badges = getTagBadges(product.tags || []);
  const isSoldOut = product.isAvailable === false;

  const amount = product.priceRange?.minVariantPrice?.amount || '0';
  const formattedPrice = `₹${parseFloat(amount).toLocaleString('en-IN')}`;

  // Debug log
  console.log('ShopifyProductCard - Product:', product.title, 'Tags:', product.tags, 'Badges:', badges);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/products/${product.handle}`} className="block">
        {/* Image Area */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F4F1] mb-4">
          <Image
            src={product.images[0]?.url || '/placeholder.jpg'}
            alt={product.images[0]?.altText || product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            priority={false}
          />

          {/* Hover Overlay — warm tint */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.08) 100%)' }} />

          {/* Tag Badges Stack */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
            {badges.map((badge, idx) => (
              <div
                key={idx}
                style={{ backgroundColor: badge.bg, color: badge.color }}
                className="px-2.5 py-1 rounded text-[8px] tracking-[0.15em] uppercase font-bold whitespace-nowrap"
              >
                {badge.text}
              </div>
            ))}
          </div>

          {/* Sold Out Badge */}
          {isSoldOut && (
            <div className="absolute top-2 right-2 z-10 px-2.5 py-1 bg-[#0A0A0A]/80 backdrop-blur-sm text-white rounded text-[8px] tracking-[0.15em] uppercase font-bold">
              Sold Out
            </div>
          )}
        </div>

        {/* Product Info below image */}
        <div className="flex flex-col gap-1 px-0.5 pt-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-sm font-sans font-medium text-[#1A1A1A] line-clamp-1 tracking-[0.01em]">
              {product.title}
            </h3>
            <span className="font-sans text-sm font-semibold text-[#1A1A1A] flex-shrink-0">
              {formattedPrice}
            </span>
          </div>
          <p className="text-[10px] text-[#A3A3A3] font-sans tracking-[0.12em] uppercase">
            Collection
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default ShopifyProductCard;
