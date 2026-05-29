'use client';
// src/components/shared/Breadcrumb.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight size={12} className="text-[#A3A3A3]" />
            )}
            {isLast || !item.href ? (
              <span
                className={
                  isLast
                    ? 'text-xs font-sans text-[#0A0A0A] font-medium tracking-wide'
                    : 'text-xs font-sans text-[#A3A3A3] tracking-wide'
                }
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-xs font-sans text-[#A3A3A3] hover:text-[#0A0A0A] tracking-wide transition-colors"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
