'use client';
// src/components/ui/Badge.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'default' | 'new' | 'limited' | 'success' | 'error' | 'warning';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#EFEFEF] text-[#404040]',
  new: 'bg-[#0A0A0A] text-white',
  limited: 'bg-[#0A0A0A] text-white',
  success: 'bg-[#27AE60] text-white',
  error: 'bg-[#C0392B] text-white',
  warning: 'bg-amber-500 text-white',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5',
        'text-xs font-sans font-medium tracking-widest uppercase',
        'rounded-[2px]',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
