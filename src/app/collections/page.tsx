'use client';
// src/app/collections/page.tsx
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/plp/ProductGrid';
import { FilterSidebar } from '@/components/plp/FilterSidebar';
import { SortDropdown } from '@/components/plp/SortDropdown';
import { EmptyState } from '@/components/plp/EmptyState';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ProductCard, ProductFilters } from '@/types/product.types';
import { Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategoryStore } from '@/store/categoryStore';

/**
 * Round-robin interleave: takes arrays and picks 1 from each in turn.
 * e.g. [m1,m2,m3], [w1,w2], [a1] → [m1,w1,a1, m2,w2, m3]
 */
function interleave<T>(...arrays: T[][]): T[] {
  const result: T[] = [];
  const maxLen = Math.max(...arrays.map((a) => a.length));
  for (let i = 0; i < maxLen; i++) {
    for (const arr of arrays) {
      if (arr[i] !== undefined) result.push(arr[i]);
    }
  }
  return result;
}

function CollectionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams?.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 500);
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // Resolve actual category slugs from the store
  const menSlug = useMemo(() => {
    const match = categories.find((c) =>
      (c.name || '').toLowerCase().startsWith('men') &&
      !(c.name || '').toLowerCase().startsWith('women')
    );
    return match?.slug ?? 'mens-clothing';
  }, [categories]);

  const womenSlug = useMemo(() => {
    const match = categories.find((c) =>
      (c.name || '').toLowerCase().startsWith('women')
    );
    return match?.slug ?? 'womens-clothing';
  }, [categories]);

  const accSlug = useMemo(() => {
    const match = categories.find((c) =>
      (c.name || '').toLowerCase().startsWith('access')
    );
    return match?.slug ?? 'accessories';
  }, [categories]);

  // Sync debounced search to URL
  useEffect(() => {
    const current = searchParams?.get('search') || '';
    if (debouncedSearch !== current) {
      const p = new URLSearchParams(searchParams?.toString() || '');
      if (debouncedSearch) p.set('search', debouncedSearch);
      else p.delete('search');
      p.delete('page');
      router.push(`/collections?${p.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Shared filter state from URL (no category key — we handle it ourselves)
  const sort = (searchParams?.get('sort') as ProductFilters['sort']) || 'newest';
  const sizeF = searchParams?.get('size') || undefined;
  const fittingF = (searchParams?.get('fitting') as ProductFilters['fittingType']) || undefined;
  const maxPriceF = Number(searchParams?.get('maxPrice')) || undefined;
  const searchF = searchParams?.get('search') || undefined;

  const sharedFilters: ProductFilters = {
    sort, size: sizeF, fittingType: fittingF, maxPrice: maxPriceF, limit: 100,
  };

  // Fetch each category separately
  const { data: menData, isLoading: menLoading } = useQuery({
    queryKey: ['col-men', menSlug, sharedFilters],
    queryFn: () => productService.getProducts({ ...sharedFilters, category: menSlug }),
    enabled: !!menSlug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: womenData, isLoading: womenLoading } = useQuery({
    queryKey: ['col-women', womenSlug, sharedFilters],
    queryFn: () => productService.getProducts({ ...sharedFilters, category: womenSlug }),
    enabled: !!womenSlug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: accData, isLoading: accLoading } = useQuery({
    queryKey: ['col-acc', accSlug, sharedFilters],
    queryFn: () => productService.getProducts({ ...sharedFilters, category: accSlug }),
    enabled: !!accSlug,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = menLoading || womenLoading || accLoading;

  // Build interleaved list, then apply search filter client-side
  const interleaved = useMemo(() => {
    const men = (menData?.data ?? []) as unknown as ProductCard[];
    const women = (womenData?.data ?? []) as unknown as ProductCard[];
    const acc = (accData?.data ?? []) as unknown as ProductCard[];
    let mixed = interleave(men, women, acc);

    if (searchF) {
      const q = searchF.toLowerCase();
      mixed = mixed.filter((p) => p.name.toLowerCase().includes(q));
    }
    return mixed;
  }, [menData, womenData, accData, searchF]);

  const updateFilter = (updates: Partial<ProductFilters & { search?: string; page?: number }>) => {
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(updates).forEach(([k, v]) => {
      const key = k === 'fittingType' ? 'fitting' : k;
      if (v !== undefined && v !== '') newParams.set(key, String(v));
      else newParams.delete(key);
    });
    newParams.delete('page');
    router.push(`/collections?${newParams.toString()}`);
  };

  const resetFilters = () => {
    setSearchInput('');
    router.push('/collections');
  };

  // Sidebar needs a filters object
  const sidebarFilters: ProductFilters = {
    sort, size: sizeF, fittingType: fittingF, maxPrice: maxPriceF,
  };

  return (
    <div className="min-h-screen bg-[#F5F4F1] pb-20">
      <div className="container-page pt-10">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'All Collections' }]} />

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-10 mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#8b0026] mb-3 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#8b0026]" /> Men&apos;s · Women&apos;s · Accessories
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[80px] text-[#151515] leading-[0.9] tracking-tight mb-4">
              All Collections
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4"
          >
            {/* Search */}
            <div className="relative w-full md:w-[320px] group">
              <Search
                size={16}
                strokeWidth={1.5}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#151515]/40 group-focus-within:text-[#8b0026] transition-colors duration-300"
              />
              <input
                type="text"
                placeholder="Search all collections..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-14 bg-white/60 backdrop-blur-md border border-[#151515]/5 hover:border-[#151515]/15 rounded-full pl-12 pr-6 text-sm font-sans placeholder:text-[#151515]/30 text-[#151515] focus:outline-none focus:border-[#8b0026]/30 focus:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300"
              />
            </div>

            <div className="hidden lg:block w-full md:w-auto">
              <SortDropdown
                value={sort}
                onChange={(v) => updateFilter({ sort: v as ProductFilters['sort'] })}
              />
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex gap-12 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block sticky top-28 w-[240px] flex-shrink-0">
            <FilterSidebar
              filters={sidebarFilters}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          </div>

          <div className="flex-1 min-w-0">
            {/* Mobile filter row */}
            <div className="lg:hidden flex items-center justify-between gap-3 mb-8">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex-shrink-0 flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-[#151515]/10 bg-white rounded-full px-6 h-12 hover:bg-[#151515] hover:text-white transition-all duration-300 shadow-sm"
              >
                <Filter size={14} strokeWidth={1.5} /> Filters
              </button>
              <SortDropdown
                value={sort}
                onChange={(v) => updateFilter({ sort: v as ProductFilters['sort'] })}
                className="flex-1 max-w-[200px]"
              />
            </div>

            {!isLoading && interleaved.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[0.16,1,0.3,1]">
                <ProductGrid products={interleaved} isLoading={isLoading} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {showMobileFilter && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilter(false)}
                className="fixed inset-0 bg-[#151515]/20 backdrop-blur-sm z-[100] lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-full max-w-[320px] bg-[#F5F4F1] z-[101] lg:hidden shadow-2xl"
              >
                <FilterSidebar
                  filters={sidebarFilters}
                  onChange={updateFilter}
                  onReset={resetFilters}
                  onClose={() => setShowMobileFilter(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense>
      <CollectionsContent />
    </Suspense>
  );
}
