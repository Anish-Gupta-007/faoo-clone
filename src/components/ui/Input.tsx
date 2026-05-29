'use client';
// src/components/ui/Input.tsx
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#525252] font-sans"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full h-12 px-4 font-sans text-base bg-white',
              'border border-[#E5E5E5] rounded-[4px]',
              'text-[#0A0A0A] placeholder:text-[#A3A3A3]',
              'transition-colors duration-150',
              'focus:outline-none focus:border-[#0A0A0A]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
              error && 'border-[#C0392B] focus:border-[#C0392B]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-sm text-[#C0392B] font-sans" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-sm text-[#A3A3A3] font-sans">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
