'use client';

import React from 'react';
import {
  Feather,
  Wind,
  Gem,
  Layers,
  Zap,
  Sparkles,
  Maximize2,
  CircleDot,
  Waves,
  Lock,
  Shirt,
  Minimize2,
  Disc,
  ShieldCheck,
  Scissors,
  RefreshCw,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/cn';

// ─── Deterministic icon lookup ─────────────────────────────────────────────────
// Keys are lowercase substrings that appear in USP text.
// Order matters: more specific patterns first.
const USP_ICON_MAP: [string, React.ElementType][] = [
  ['super soft', Feather],
  ['soft', Feather],
  ['breathable', Wind],
  ['airy', Wind],
  ['premium fabric', Gem],
  ['premium', Gem],
  ['inner lining', Layers],
  ['lining', Layers],
  ['elastic fit', Zap],
  ['elasticated', CircleDot],
  ['elastic waist', Waves],
  ['elastic', Zap],
  ['bead', Sparkles],
  ['embroid', Sparkles],
  ['handwork', Sparkles],
  ['shape retention', Maximize2],
  ['shape', Maximize2],
  ['no colour fading', ShieldCheck],
  ['no color fading', ShieldCheck],
  ['colour fading', ShieldCheck],
  ['color fading', ShieldCheck],
  ['clean fit', Shirt],
  ['structured', Scissors],
  ['lightweight', Minimize2],
  ['light weight', Minimize2],
  ['side zip', Lock],
  ['zip', Lock],
  ['semi-sheer', Disc],
  ['sheer', Disc],
  ['pre-washed', RefreshCw],
  ['washed', RefreshCw],
];

function getIcon(label: string): React.ElementType {
  const key = label.toLowerCase().trim();
  for (const [pattern, icon] of USP_ICON_MAP) {
    if (key.includes(pattern)) return icon;
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
    <div className={cn('grid grid-cols-2 gap-2', className)}>
      {usps.map((usp, i) => {
        const Icon = getIcon(usp.text);
        return (
          <div
            key={i}
            className="flex items-center gap-2.5 py-1.5"
          >
            {/* Fixed-size icon container — same for every card */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#151515] flex items-center justify-center">
              <Icon size={13} strokeWidth={1.8} className="text-white" />
            </div>
            {/* Label */}
            <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-[#151515] leading-tight">
              {usp.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProductUSPs;
