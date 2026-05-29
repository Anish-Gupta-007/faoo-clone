'use client';
// src/app/search/page.tsx
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/plp/ProductGrid';
import { FilterSidebar } from '@/components/plp/FilterSidebar';
import { SortDropdown } from '@/components/plp/SortDropdown';
import { PaginationBar } from '@/components/plp/PaginationBar';
import { EmptyState } from '@/components/plp/EmptyState';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ProductCard, ProductFilters } from '@/types/product.types';
import { Filter, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const q = searchParams?.get('q') || '';
  const [inputVal, setInputVal] = useState(q);

  useEffect(() => setInputVal(q), [q]);

  const filters: ProductFilters = {
    search: q,
    sort: (searchParams?.get('sort') as ProductFilters['sort']) || 'newest',
    page: Number(searchParams?.get('page')) || 1,
    size: searchParams?.get('size') || undefined,
    fittingType: (searchParams?.get('fitting') as ProductFilters['fittingType']) || undefined,
    maxPrice: Number(searchParams?.get('maxPrice')) || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['search', filters],
    queryFn: () => productService.getProducts(filters),
    enabled: q.length >= 1, // Allow search with 1+ characters
    staleTime: 5 * 60 * 1000,
  });

  const updateFilter = (updates: Partial<ProductFilters>) => {
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(updates).forEach(([k, v]) => {
      const key = k === 'fittingType' ? 'fitting' : k;
      if (v !== undefined && v !== '') newParams.set(key, String(v));
      else newParams.delete(key);
    });
    newParams.delete('page');
    router.push(`/search?${newParams.toString()}`);
  };

  const resetFilters = () => router.push(`/search?q=${encodeURIComponent(q)}`);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
    }
  };

  const products = (data?.data ?? []) as unknown as ProductCard[];
  const totalPages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container-page py-10">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
        
        <div className="mt-8 mb-10">
          <form onSubmit={handleSearch} className="max-w-xl flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Search products..."
                className="w-full h-12 pl-12 pr-4 rounded-full border border-[#E5E5E5] bg-white text-sm focus:outline-none focus:border-[#8b0026] transition-colors"
              />
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#A3A3A3]" />
            </div>
            <button
              type="submit"
              className="px-8 rounded-full bg-[#151515] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#8b0026] transition-colors"
            >
              Search
            </button>
          </form>
          
          <div className="flex items-end justify-between mt-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-[#0A0A0A]">
                {q ? `Results for "${q}"` : 'Search our collection'}
              </h1>
              <p className="text-xs font-sans text-[#A3A3A3] tracking-widest uppercase mt-2">{total} results</p>
            </div>
            <div className="hidden lg:block">
              <SortDropdown
                value={filters.sort || 'newest'}
                onChange={(v) => updateFilter({ sort: v as ProductFilters['sort'] })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {q && (
            <div className="hidden lg:block">
              <FilterSidebar filters={filters} onChange={updateFilter} onReset={resetFilters} />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {q && (
              <div className="lg:hidden flex items-center justify-between gap-3 mb-6">
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="flex-shrink-0 flex items-center gap-2 text-[12px] font-sans font-bold tracking-wide border border-[#151515]/10 bg-white rounded-full px-5 h-10 hover:bg-[#F5F4F1] transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                >
                  <Filter size={14} className="text-[#151515]/60" /> Filter
                </button>
                <SortDropdown
                  value={filters.sort || 'newest'}
                  onChange={(v) => updateFilter({ sort: v as ProductFilters['sort'] })}
                  className="flex-1 max-w-[200px]"
                />
              </div>
            )}

            {!isLoading && q && products.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <ProductGrid products={products} isLoading={isLoading} />
                {q && totalPages > 1 && (
                  <PaginationBar
                    currentPage={filters.page || 1}
                    totalPages={totalPages}
                    onPageChange={(p) => updateFilter({ page: p })}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showMobileFilter && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilter(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-full max-w-[300px] bg-white z-[101] lg:hidden"
              >
                <FilterSidebar 
                  filters={filters} 
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

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}

