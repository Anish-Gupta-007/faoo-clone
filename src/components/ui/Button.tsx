'use client';
// src/components/ui/Button.tsx
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] active:bg-[#262626] tracking-[0.18em] uppercase shadow-sm hover:shadow-[0_4px_20px_rgba(139,0,38,0.15),0_1px_4px_rgba(0,0,0,0.12)] transition-shadow',
  secondary:
    'bg-transparent border border-[#0A0A0A]/80 text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white active:bg-[#262626] tracking-[0.12em] transition-colors',
  ghost:
    'bg-transparent text-[#737373] hover:text-[#0A0A0A] hover:bg-[#F7F7F7] tracking-wide',
  danger:
    'bg-transparent text-[#C0392B] hover:text-[#96241B] hover:bg-[#C0392B]/5 tracking-wide',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-5 text-[11px]',
  md: 'h-11 px-6 text-[11px]',
  lg: 'h-[54px] px-8 text-[11px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans font-medium',
          'rounded-[2px] transition-all select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-[#8b0026]/70 focus-visible:outline-offset-3',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
