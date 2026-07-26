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
  supportsAllSizes?: boolean;
  isBuyNowLoading?: boolean;
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
  supportsAllSizes = false,
  isBuyNowLoading = false,
}) => {
  // Maps fitType to a percentage along the bar: 0% = Fitted, 50% = Regular, 100% = Oversized
  const fitPosition: Record<string, number> = {
    fitted: 0,
    regular: 50,
    oversized: 100,
    relaxed: 100,
  };

  const position = fitPosition[fitType] ?? 50;

  const isSoldOut =
    isOutOfStock ||
    (sizes.length > 0 && outOfStockSizes.length === sizes.length && !isFreeSize && !supportsAllSizes) ||
    (isFreeSize && outOfStockSizes.includes('Free Size' as Size));

  const fitLabel =
    fitType === 'fitted' ? 'Fitted Cut' :
      fitType === 'oversized' ? 'Oversized Fit' :
        'Fits True to Size';

  return (
    <div className="flex flex-col w-full gap-6 md:gap-8">
      {/* ── Sizes ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans font-semibold tracking-[0.18em] uppercase text-[#A3A3A3]">Size</span>
            {!supportsAllSizes && showValidation && (
              <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase animate-pulse">
                · Select a size
              </span>
            )}
          </div>
          {!supportsAllSizes && (
            <button
              onClick={onSizeGuideClick}
              className="text-[11px] font-sans font-medium text-[#151515] underline decoration-1 underline-offset-4 hover:opacity-60 transition-opacity"
            >
              Size Guide
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {supportsAllSizes ? (
            <div className="relative h-11 px-5 bg-[#FAF9F5] border border-[#c9a84c]/30 text-[10px] md:text-[11px] font-sans font-bold tracking-[0.18em] uppercase flex items-center justify-center rounded-lg shadow-[0_2px_8px_rgba(201,168,76,0.05)] text-[#c9a84c] cursor-default select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] mr-2.5 animate-pulse" />
              Fits All Sizes
            </div>
          ) : (
            <>
              {isFreeSize && (
                <button
                  onClick={() => onSizeSelect('Free Size')}
                  disabled={isSoldOut || outOfStockSizes.includes('Free Size' as Size)}
                  className={cn(
                    'relative min-w-[72px] h-11 px-4 border border-solid text-[11px] font-sans font-semibold tracking-widest uppercase flex items-center justify-center transition-all duration-200',
                    selectedSize === 'Free Size'
                      ? 'bg-[#151515] text-white border-[#151515]'
                      : 'bg-white border-[#D4D4D4] text-[#151515] hover:border-[#151515]',
                    (isSoldOut || outOfStockSizes.includes('Free Size' as Size)) &&
                    'opacity-40 cursor-not-allowed hover:border-[#D4D4D4]'
                  )}
                >
                  <span className="relative z-10">ONE SIZE</span>
                  {(isSoldOut || outOfStockSizes.includes('Free Size' as Size)) && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-[#A3A3A3] -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                    </div>
                  )}
                </button>
              )}

              {sizes.map((size) => {
                const isSelected = selectedSize === size;
                const isOOS = isSoldOut || outOfStockSizes.includes(size);
                return (
                  <button
                    key={size}
                    disabled={isOOS}
                    onClick={() => onSizeSelect(size)}
                    className={cn(
                      'relative min-w-[48px] h-11 px-3 border border-solid text-[12px] font-sans font-semibold flex items-center justify-center transition-all duration-200 cursor-pointer',
                      isSelected
                        ? 'bg-[#151515] text-white border-[#151515]'
                        : 'bg-white border-[#D4D4D4] text-[#151515] hover:border-[#151515]',
                      isOOS && 'opacity-40 cursor-not-allowed hover:border-[#D4D4D4]'
                    )}
                  >
                    <span className="relative z-10">{size === 'Free Size' ? 'ONE SIZE' : size}</span>
                    {isOOS && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 w-[140%] h-[1px] bg-[#A3A3A3] -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                      </div>
                    )}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* ── Fit Scale (hidden for Free Size products) ── */}
      {!isFreeSize && (
        <div className="flex flex-col gap-3">
          {/* Track */}
          <div className="relative h-[2px] bg-[#E5E5E5] rounded-full mx-0">
            {/* Filled portion */}
            <motion.div
              className="absolute left-0 top-0 h-full bg-[#151515] rounded-full"
              initial={{ width: '50%' }}
              animate={{ width: `${position}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            />
            {/* Dot */}
            <motion.div
              className="absolute top-1/2 w-3 h-3 rounded-full bg-[#151515] border-2 border-white shadow-[0_0_0_1px_#151515] -translate-y-1/2 -translate-x-1/2"
              initial={{ left: '50%' }}
              animate={{ left: `${position}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            />
          </div>

          {/* Labels — 3-col grid so each label aligns exactly with its endpoint */}
          <div className="grid grid-cols-3 text-[10px] font-sans font-medium text-[#A3A3A3] tracking-[0.12em] uppercase">
            <span className="text-left" style={{ color: fitType === 'fitted' ? '#151515' : undefined }}>Fitted</span>
            <span className="text-center" style={{ color: fitType === 'regular' ? '#151515' : undefined }}>Regular</span>
            <span className="text-right" style={{ color: fitType === 'oversized' ? '#151515' : undefined }}>Oversized</span>
          </div>

          {/* Active label */}
          <p className="text-[11px] font-sans font-semibold text-[#151515] tracking-[0.08em] uppercase">
            {fitLabel}
          </p>
        </div>
      )}

      {/* ── Buttons ── */}
      <div className="flex flex-col gap-2 md:gap-3">
        <div className="flex flex-row items-center gap-2 md:gap-3">
          <button
            onClick={onAddToCart}
            disabled={isLoading || isSoldOut}
            className={cn(
              'flex-1 h-12 md:h-[54px] flex items-center justify-center text-[10px] md:text-[11px] font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 border',
              isLoading || isSoldOut
                ? 'bg-[#151515] text-white border-[#151515] opacity-50 cursor-not-allowed'
                : 'bg-[#8b0026] text-white border-[#8b0026] hover:bg-white hover:text-[#8b0026]'
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSoldOut ? (
              'SOLD OUT'
            ) : (selectedSize || isFreeSize || supportsAllSizes) ? (
              'ADD TO CART'
            ) : (
              'SELECT SIZE'
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
          disabled={isSoldOut || (!selectedSize && !isFreeSize && !supportsAllSizes) || isBuyNowLoading}
          className={cn(
            'w-full h-12 md:h-[54px] flex items-center justify-center transition-all duration-300 text-[10px] md:text-[11px] font-sans font-bold tracking-[0.25em] uppercase border border-[#151515]',
            !isSoldOut && (selectedSize || isFreeSize || supportsAllSizes) && !isBuyNowLoading
              ? 'bg-[#151515] text-white hover:bg-white hover:text-[#151515]'
              : 'bg-[#151515] text-white opacity-40 cursor-not-allowed'
          )}
        >
          {isBuyNowLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'BUY IT NOW'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddToCartSection;
