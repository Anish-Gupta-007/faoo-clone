'use client';
// src/components/shared/SectionHeader.tsx
import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  tag?: string;
  heading: string;
  subheading?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export function SectionHeader({
  tag,
  heading,
  subheading,
  align = 'center',
  className,
}: SectionHeaderProps) {
  const alignClass = {
    left: 'text-center md:text-left items-center md:items-start',
    center: 'text-center items-center',
    right: 'text-center md:text-right items-center md:items-end',
  };

  return (
    <div className={cn('flex flex-col gap-3', alignClass[align], className)}>
      {tag && (
        <span className="text-xs font-sans font-medium tracking-widest uppercase text-[#A3A3A3]">
          {tag}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl text-[#0A0A0A]">{heading}</h2>
      {subheading && (
        <p className="text-base font-sans text-[#525252] max-w-2xl mx-auto leading-relaxed">
          {subheading}
        </p>
      )}
    </div>
  );
}
