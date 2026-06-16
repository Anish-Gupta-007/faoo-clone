'use client';
// src/components/plp/FilterSidebar.tsx
import { ProductFilters, FittingType } from '@/types/product.types';
import { ALL_SIZES, FITTING_TYPES, PRICE_RANGE } from '@/constants/sizes';
import { cn } from '@/lib/cn';
import { RotateCcw, Ruler, Shirt, Tag, X } from 'lucide-react';

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: Partial<ProductFilters>) => void;
  onReset: () => void;
  onClose?: () => void;
}

export function FilterSidebar({ filters, onChange, onReset, onClose }: FilterSidebarProps) {
  const selectedSizes = filters.size?.split(',').filter(Boolean) ?? [];

  const toggleSize = (size: string) => {
    // Single select toggle behavior: 
    // If size is already selected, unselect it. 
    // Otherwise, select only this size.
    if (selectedSizes.includes(size)) {
      onChange({ size: undefined });
    } else {
      onChange({ size: size });
    }
  };


  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className={cn(
        "bg-[#FCFBF9]/95 backdrop-blur-xl border border-[#151515]/5 transition-all duration-500",
        onClose ? "h-full overflow-y-auto pb-20" : "sticky top-28 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
      )}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#151515]/5 bg-white/50">
          <div className="flex items-center gap-2">
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1 -ml-1 text-[#151515]/40 hover:text-[#151515] transition-colors"
              >
                <X size={18} />
              </button>
            )}
            <h3 className="font-display text-[12px] font-bold text-[#151515] tracking-[0.15em] uppercase">Refine By</h3>
          </div>
          <button
            onClick={onReset}
            className="group flex items-center gap-1.5 text-[10px] font-sans font-semibold text-[#8b0026] hover:text-[#6a001d] transition-colors uppercase tracking-widest"
          >
            <span>Reset</span>
            <RotateCcw size={12} className="transition-transform duration-500 group-hover:-rotate-180" />
          </button>
        </div>

        <div className="flex flex-col divide-y divide-[#151515]/5">
          {/* Size Section */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#151515]/5 flex items-center justify-center text-[#151515]">
                <Ruler size={12} />
              </div>
              <p className="text-[11px] font-sans font-bold text-[#151515] tracking-[0.1em] uppercase">Size</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {ALL_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={cn(
                    'h-8 flex items-center justify-center text-[10px] font-sans font-semibold rounded-lg transition-all duration-300 ease-out border',
                    size === 'Free Size' ? 'col-span-2' : '',
                    selectedSizes.includes(size)
                      ? 'bg-gradient-to-br from-[#151515] to-[#2A2A2A] text-white border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.15)] scale-[1.02]'
                      : 'bg-white border-[#151515]/10 text-[#525252] hover:border-[#151515]/30 hover:shadow-sm hover:text-[#151515]'
                  )}
                >
                  {size === 'Free Size' ? 'ONE SIZE' : size}
                </button>
              ))}
            </div>
          </div>

          {/* Fitting Section */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#151515]/5 flex items-center justify-center text-[#151515]">
                  <Shirt size={12} />
                </div>
                <p className="text-[11px] font-sans font-bold text-[#151515] tracking-[0.1em] uppercase">Fitting</p>
              </div>
              {filters.fittingType && (
                <button
                  onClick={() => onChange({ fittingType: undefined })}
                  className="text-[10px] font-medium text-[#A3A3A3] hover:text-[#151515] uppercase tracking-wider transition-colors duration-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col gap-0">
              {FITTING_TYPES.map((fit) => (
                <div
                  key={fit}
                  onClick={() => onChange({ fittingType: filters.fittingType === fit ? undefined : fit as FittingType })}
                  className="flex items-center group cursor-pointer p-1.5 -mx-1.5 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-300 border border-transparent hover:border-[#151515]/5"
                >
                  <div className="relative flex items-center justify-center w-4 h-4 mr-3">
                    <div className={cn(
                      "w-4 h-4 border rounded-full transition-all duration-300 group-hover:border-[#151515]/50",
                      filters.fittingType === fit ? "border-[#151515]" : "border-[#D4D4D4]"
                    )} />
                    <div className={cn(
                      "absolute w-1.5 h-1.5 bg-[#151515] rounded-full transition-transform duration-300 ease-out pointer-events-none",
                      filters.fittingType === fit ? "scale-100" : "scale-0"
                    )} />
                  </div>
                  <span className={cn(
                    "text-xs font-sans transition-colors duration-300",
                    filters.fittingType === fit ? "text-[#151515] font-semibold" : "text-[#525252] group-hover:text-[#151515]"
                  )}>
                    {fit}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* Price Range Section */}
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#151515]/5 flex items-center justify-center text-[#151515]">
                <Tag size={12} />
              </div>
              <p className="text-[11px] font-sans font-bold text-[#151515] tracking-[0.1em] uppercase">Price Range</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-[#151515]/5 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-[10px] font-sans font-medium text-[#737373] tracking-wide">Max Price</span>
                <span className="text-sm font-sans font-bold text-[#151515] tracking-tight">₹{filters.maxPrice ?? PRICE_RANGE.max}</span>
              </div>

              <div className="relative py-2">
                <input
                  type="range"
                  min={PRICE_RANGE.min}
                  max={PRICE_RANGE.max}
                  step={100}
                  value={filters.maxPrice ?? PRICE_RANGE.max}
                  onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
                  className="w-full h-1.5 bg-[#EFEFEF] rounded-full appearance-none cursor-pointer accent-[#151515] hover:accent-[#8b0026] transition-all duration-300
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#151515] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:bg-[#8b0026] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-300"
                  aria-label="Maximum price"
                />
              </div>

              <div className="flex justify-between mt-4 text-[10px] font-sans font-semibold text-[#A3A3A3] tracking-wider">
                <span>₹{PRICE_RANGE.min}</span>
                <span>₹{PRICE_RANGE.max}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
