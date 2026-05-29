'use client';

import React from 'react';
import { cn } from '@/lib/cn';

export const SupportSection = ({ className }: { className?: string }) => {
  return (
    <div className={cn("pt-12 pb-0 text-center", className)}>
      <p className="text-[13px] font-medium text-[#737373] tracking-tight mb-2">
        Have a specific question? Email us
      </p>
      <a 
        href="mailto:support@faoo.in"
        className="text-[14px] font-display uppercase tracking-[0.2em] text-[#0A0A0A] border-b border-black/10 pb-0.5 hover:border-black/40 transition-all duration-300"
      >
        support@faoo.in
      </a>
    </div>
  );
};

export default SupportSection;
