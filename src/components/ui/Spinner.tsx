'use client';
// src/components/ui/Spinner.tsx
import { cn } from '@/lib/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'block rounded-full border-2 border-current border-t-transparent animate-spin',
        sizeMap[size],
        className
      )}
    />
  );
}
