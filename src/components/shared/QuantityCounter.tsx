'use client';
// src/components/shared/QuantityCounter.tsx
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

interface QuantityCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function QuantityCounter({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  className,
}: QuantityCounterProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center border border-[#E5E5E5] rounded-[4px] overflow-hidden',
        className
      )}
    >
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-sans font-medium text-[#0A0A0A]">
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
