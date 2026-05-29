'use client';

import React from 'react';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';
import { HeartButton } from '@/components/shared/HeartButton';

type Size = 'Free Size' | 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';
type FitType = 'fitted' | 'regular' | 'oversized';

interface AddToCartSectionProps {
  sizes: Size[];
  selectedSize: Size | null;
  outOfStockSizes: Size[];
  onSizeSelect: (size: Size) => void;
  onAddToCart: () => void;
  onBuyNow?: () => void;
  isLoading?: boolean;
  fitType?: FitType;
  isFreeSize?: boolean;
  onSizeGuideClick?: () => void;
  showValidation?: boolean;
  productId: string;
  isOutOfStock?: boolean;
}

export const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  sizes,
  selectedSize,
  outOfStockSizes,
  onSizeSelect,
  onAddToCart,
  onBuyNow,
  isLoading,
  fitType = 'regular',
  isFreeSize = false,
  onSizeGuideClick,
  showValidation = false,
  productId,
  isOutOfStock = false,
}) => {
  const fitConfig: Record<string, { position: number }> = {
    fitted: { position: 0 },
    regular: { position: 50 },
    oversized: { position: 100 },
    // Fallback
    relaxed: { position: 100 },
  };

  const isSoldOut = isOutOfStock ||
    (sizes.length > 0 && outOfStockSizes.length === sizes.length && !isFreeSize) ||
    (isFreeSize && outOfStockSizes.includes('Free Size' as Size));

  return (
    <div className="flex flex-col w-full gap-6 md:gap-8">
      {/* Sizes Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm md:text-base text-gray-400 font-medium">Size</span>
          </div>
          <button
            onClick={onSizeGuideClick}
            className="text-sm md:text-base text-black underline decoration-1 underline-offset-4 hover:opacity-70 transition-opacity w-fit"
          >
            Size Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-3 relative">
          {showValidation && (
            <span className="text-[10px] text-red-500 absolute -top-5 left-0 font-medium tracking-wider uppercase animate-pulse">
              * Select a size
            </span>
          )}
          {isFreeSize && (
            <button
              onClick={() => onSizeSelect('Free Size')}
              disabled={isSoldOut || outOfStockSizes.includes('Free Size' as Size)}
              className={cn(
                "relative min-w-[80px] md:min-w-[100px] h-10 md:h-[42px] px-3 md:px-6 border-2 border-solid text-xs md:text-sm flex items-center justify-center font-bold tracking-widest transition-all",
                selectedSize === 'Free Size'
                  ? "bg-black text-white border-black"
                  : "bg-transparent border-black text-black hover:bg-black hover:text-white",
                (isSoldOut || outOfStockSizes.includes('Free Size' as Size)) && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-black"
              )}
            >
              <span className="relative z-10">FREE SIZE</span>
              {(isSoldOut || outOfStockSizes.includes('Free Size' as Size)) && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 w-[140%] h-[1.5px] bg-black -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                </div>
              )}
            </button>
          )}
          {sizes.map((size) => {
            const isSelected = selectedSize === size;
            const isOutOfStockSize = isSoldOut || outOfStockSizes.includes(size);

            return (
              <button
                key={size}
                disabled={isOutOfStockSize}
                onClick={() => onSizeSelect(size)}
                className={cn(
                  "relative min-w-[44px] md:min-w-[56px] h-10 md:h-[42px] px-2 md:px-3 border-2 border-solid text-xs md:text-sm flex items-center justify-center transition-all font-medium cursor-pointer",
                  isSelected
                    ? "bg-black text-white border-black"
                    : "bg-transparent border-black text-black hover:bg-black hover:text-white",
                  isOutOfStockSize && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-black"
                )}
              >
                <span className="relative z-10">{size}</span>
                {isOutOfStockSize && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-[140%] h-[1.5px] bg-black -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fit Scale Section */}
      <div className="flex flex-col pt-2 md:pt-4">
        <div className="relative h-6 flex items-center">
          <div className="absolute left-0 right-0 h-[1.5px] bg-black" />
          <div className="absolute left-0 h-4 w-[1.5px] bg-black" />
          <div className="absolute right-0 h-4 w-[1.5px] bg-black" />

          <motion.div
            initial={{ left: '50%' }}
            animate={{ left: `${fitConfig[fitType]?.position ?? 50}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="absolute w-[18px] h-[18px] bg-[#FF6A00] border-[2.5px] border-white rounded-full -translate-x-1/2 z-10 shadow-[0_0_0_1px_#FF6A00]"
          />
        </div>
        <div className="flex justify-between text-sm md:text-[15px] font-medium text-black mt-2">
          <span className="translate-x-0">Fitted</span>
          <span className="translate-x-0">Regular</span>
          <span className="translate-x-0">Oversized</span>
        </div>
        <p className="text-sm md:text-[15px] font-bold text-black mt-4 md:mt-6">
          {fitType === 'fitted' ? 'Fitted Cut' : fitType === 'oversized' ? 'Oversized Fit' : 'Fits True to Size'}
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col gap-2 md:gap-3 pt-2 md:pt-4">
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <button
            onClick={onAddToCart}
            disabled={isLoading || isSoldOut}
            className={cn(
              "flex-1 h-12 md:h-[54px] flex items-center justify-center text-[10px] md:text-[11px] font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden group border",
              isLoading || isSoldOut
                ? "bg-[#151515] text-white border-[#151515] opacity-50 cursor-not-allowed"
                : "bg-[#8b0026] text-white border-[#8b0026] hover:bg-white hover:text-[#8b0026]"
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSoldOut ? (
              "SOLD OUT"
            ) : (selectedSize || isFreeSize) ? (
              "ADD TO CART"
            ) : (
              "SELECT SIZE"
            )}
          </button>

          <HeartButton
            productId={productId}
            className="h-12 md:h-[54px] w-12 md:w-[54px] border border-[#151515]/20 hover:border-[#8b0026] transition-all duration-300 bg-white flex-shrink-0 group hover:bg-[#8b0026]/5"
            size="md"
          />
        </div>

        <button
          onClick={onBuyNow}
          disabled={isSoldOut || (!selectedSize && !isFreeSize)}
          className={cn(
            "w-full h-12 md:h-[54px] flex items-center justify-center transition-all duration-300 text-[10px] md:text-[11px] font-sans font-bold tracking-[0.25em] uppercase border border-[#151515]",
            !isSoldOut && (selectedSize || isFreeSize)
              ? "bg-[#151515] text-white hover:bg-white hover:text-[#151515]"
              : "bg-[#151515] text-white opacity-40 cursor-not-allowed"
          )}
        >
          BUY IT NOW
        </button>
      </div>
    </div>
  );
};

export default AddToCartSection;
