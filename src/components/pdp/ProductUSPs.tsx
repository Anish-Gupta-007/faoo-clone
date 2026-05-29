'use client';

import React from 'react';
import {
  Feather,
  Wind,
  Gem,
  Layers,
  Zap,
  Palette,
  Maximize2,
  Sparkles,
  CircleDot,
  Waves,
  Lock,
  Star,
  AlignCenter,
  Shirt,
  Minimize2,
  Disc,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Icon map for all known Faoo USPs ────────────────────────────────────────
const USP_ICON_MAP: Record<string, React.ElementType> = {
  'super soft':         Feather,
  'premium fabric':     Gem,
  'breathable':         Wind,
  'structured fit':     AlignCenter,
  'lightweight':        Minimize2,
  'no colour fading':   Palette,
  'shape retention':    Maximize2,
  'elastic fit':        Zap,
  'bead handwork':      Sparkles,
  'clean fit':          Shirt,
  'inner lining':       Layers,
  'side zip':           Lock,
  'elasticated back':   CircleDot,
  'elastic waistband':  Waves,
  'semi-sheer':         Disc,
};

function getIcon(label: string): React.ElementType {
  const key = label.toLowerCase().trim();
  for (const [pattern, icon] of Object.entries(USP_ICON_MAP)) {
    if (key === pattern || key.includes(pattern)) return icon;
  }
  return Star;
}

interface ProductUSPsProps {
  usps?: { text: string; iconUrl?: string }[];
  className?: string;
}

export const ProductUSPs: React.FC<ProductUSPsProps> = ({ usps, className }) => {
  if (!usps || usps.length === 0) return null;

  return (
    <div className={cn('grid grid-cols-2 gap-2.5 md:gap-3', className)}>
      {usps.map((usp, i) => {
        const Icon = getIcon(usp.text);
        return (
          <div
            key={i}
            className="flex items-center gap-3 p-3.5 bg-[#F7F7F7] border border-[#EFEFEF] rounded-xl hover:shadow-sm hover:border-[#D4D4D4] transition-all duration-300 group"
          >
            {/* Icon circle */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#151515] flex items-center justify-center group-hover:bg-[#151515] group-hover:text-white transition-colors duration-300">
              <Icon size={15} strokeWidth={1.5} />
            </div>

            {/* Label */}
            <span className="text-[10px] md:text-[11px] uppercase tracking-widest font-bold text-[#151515] leading-tight">
              {usp.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProductUSPs;
