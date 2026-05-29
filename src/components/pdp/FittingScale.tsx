'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export type FitType = 'fitted' | 'regular' | 'oversized';

interface FittingScaleProps {
  fit: FitType;
  className?: string;
}

const fitConfig: Record<string, { position: number; label: string }> = {
  fitted: {
    position: 0,
    label: 'Fitted',
  },
  regular: {
    position: 50,
    label: 'Regular',
  },
  oversized: {
    position: 100,
    label: 'Oversized',
  },
  // Fallback
  relaxed: {
    position: 100,
    label: 'Relaxed',
  },
};

export const FittingScale: React.FC<FittingScaleProps> = ({ fit, className }) => {
  const currentFit = fitConfig[fit] || fitConfig.regular;

  return (
    <div className={cn('w-full py-4', className)}>
      <div className="relative h-10 flex items-center px-0.5">
        {/* Horizontal Line */}
        <div className="absolute left-0 right-0 h-[1px] bg-black" />

        {/* End Ticks */}
        <div className="absolute left-0 h-4 w-[1px] bg-black" />
        <div className="absolute right-0 h-4 w-[1px] bg-black" />

        {/* Animated Indicator (Orange) */}
        <motion.div
          initial={{ left: '50%' }}
          animate={{ left: `${currentFit.position}%` }}
          transition={{
            type: 'spring',
            stiffness: 100,
            damping: 20
          }}
          className="absolute w-4 h-4 bg-[#FF5722] rounded-full -translate-x-1/2 z-10 border-2 border-white shadow-sm flex items-center justify-center"
        >
          {/* Inner ring effect like the image */}
          <div className="w-2.5 h-2.5 rounded-full border border-white/50" />
        </motion.div>

        {/* Labels below the line */}
        <div className="absolute top-7 left-0 right-0 flex justify-between text-[11px] font-bold text-black uppercase tracking-tight">
          <span className={cn(fit === 'fitted' ? 'opacity-100' : 'opacity-100')}>Fitted</span>
          <span className={cn('translate-x-0', fit === 'regular' ? 'opacity-100' : 'opacity-100')}>Regular</span>
          <span className={cn(fit === 'oversized' ? 'opacity-100' : 'opacity-100')}>Oversized</span>
        </div>
      </div>
    </div>
  );
};

export default FittingScale;
