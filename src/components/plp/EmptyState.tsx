'use client';
// src/components/plp/EmptyState.tsx
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'No products found',
  description = 'Try adjusting your filters or browse our full collection.',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
      <PackageOpen size={48} className="text-[#D4D4D4]" />
      <div>
        <h3 className="font-display text-2xl text-[#0A0A0A] mb-2">{title}</h3>
        <p className="font-sans text-sm text-[#A3A3A3] max-w-md mx-auto mb-6">
          We couldn't find anything matching your current filters. Try removing some filters or exploring the whole collection.
        </p>
      </div>
      <Link href="/men">
        <Button variant="secondary" size="md">Clear All Filters</Button>
      </Link>
    </div>
  );
}
