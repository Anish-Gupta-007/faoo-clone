'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FittingScale, { FitType } from '@/components/pdp/FittingScale';
import ProductOfferInfo from '@/components/pdp/ProductOfferInfo';
import ProductUSPs from '@/components/pdp/ProductUSPs';

export default function FittingScaleDemo() {
  const [fit, setFit] = useState<FitType>('regular');

  return (
    <div className="min-h-screen bg-[#F9F9F7] flex flex-col items-center py-20 px-6 text-[#151515]">
      <div className="w-full max-w-xl space-y-16">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-display tracking-tight">Product Page Components</h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#737373]">Premium UI Kit</p>
        </header>

        {/* Product Offer Section */}
        <section className="bg-white p-12 border border-[#EFEFEF] shadow-xs">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#A3A3A3] mb-8 border-b border-[#F7F7F7] pb-4">
            Pricing & Promotions
          </h2>
        </section>

        {/* Product USPs Section */}
        <section className="bg-white p-12 border border-[#EFEFEF] shadow-xs">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#A3A3A3] mb-8 border-b border-[#F7F7F7] pb-4">
            Product Features (USPs)
          </h2>
          <ProductUSPs />
        </section>

        {/* Fitting Scale Section */}
        <section className="bg-white p-12 border border-[#EFEFEF] shadow-xs">
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#A3A3A3] mb-8 border-b border-[#F7F7F7] pb-4">
            Fitting Scale
          </h2>
          <div className="flex gap-8 mb-16 justify-center border-b border-[#F7F7F7] pb-8">
            {(['fitted', 'regular', 'oversized'] as FitType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFit(type)}
                className={`text-[10px] uppercase tracking-[0.2em] transition-all relative py-2 ${fit === type
                    ? 'text-[#151515] font-semibold'
                    : 'text-[#A3A3A3] hover:text-[#737373]'
                  }`}
              >
                {type}
                {fit === type && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#151515]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-center py-6">
            <FittingScale fit={fit} className="w-full" />
          </div>
        </section>

        <footer className="text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#A3A3A3]">
            Designed for Faao Luxury Streetwear
          </p>
        </footer>
      </div>
    </div>
  );
}
