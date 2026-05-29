'use client';
// src/components/plp/PaginationBar.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ currentPage, totalPages, onPageChange }: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const showPages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  const renderPages: (number | '...')[] = [];
  showPages.forEach((p, i) => {
    if (i > 0 && p - showPages[i - 1] > 1) renderPages.push('...');
    renderPages.push(p);
  });

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-9 h-9 flex items-center justify-center rounded border border-[#E5E5E5] disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {renderPages.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-[#A3A3A3]">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              'w-9 h-9 flex items-center justify-center text-sm font-sans rounded border transition-colors',
              p === currentPage
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                : 'border-[#E5E5E5] text-[#525252] hover:bg-gray-50'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-9 h-9 flex items-center justify-center rounded border border-[#E5E5E5] disabled:opacity-40 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
