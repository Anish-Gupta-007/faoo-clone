'use client';
// src/components/ui/Select.tsx
import { forwardRef, SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#525252] font-sans">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-12 pl-4 pr-10 font-sans text-base bg-white appearance-none',
              'border border-[#E5E5E5] rounded-[4px]',
              'text-[#0A0A0A]',
              'transition-colors duration-150',
              'focus:outline-none focus:border-[#0A0A0A]',
              error && 'border-[#C0392B]',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] pointer-events-none"
          />
        </div>
        {error && <p className="text-sm text-[#C0392B] font-sans">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
