'use client';
// src/app/[category]/page.tsx
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/plp/ProductGrid';
import { FilterSidebar } from '@/components/plp/FilterSidebar';
import { SortDropdown } from '@/components/plp/SortDropdown';
import { PaginationBar } from '@/components/plp/PaginationBar';
import { EmptyState } from '@/components/plp/EmptyState';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ProductCard, ProductFilters } from '@/types/product.types';
import { Filter, Search } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/cn';

function CategoryPLPContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const categorySlug = (params?.category as string) || '';
  const { categories, fetchCategories } = useCategoryStore();

  const [searchInput, setSearchInput] = useState(searchParams?.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Find category name for display
  const currentCategory = categories.find((cat) => cat.slug === categorySlug);
  const categoryName = currentCategory ? currentCategory.name : categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const [restoredCategory, setRestoredCategory] = useState<string | null>(null);

  useEffect(() => {
    if (restoredCategory !== categorySlug) {
      if ((searchParams?.toString() || '') === '') {
        const saved = sessionStorage.getItem(`faoo-filters-${categorySlug}`);
        if (saved) router.replace(`/${categorySlug}?${saved}`);
      }
      setRestoredCategory(categorySlug);
    } else {
      sessionStorage.setItem(`faoo-filters-${categorySlug}`, searchParams?.toString() || '');
    }
  }, [searchParams, categorySlug, router, restoredCategory]);

  const isNewCollection = searchParams?.get('isNewCollection') === 'true';

  const filters: ProductFilters & { search?: string } = {
    category: categorySlug,
    search: searchParams?.get('search') || undefined,
    sort: (searchParams?.get('sort') as ProductFilters['sort']) || 'newest',
    page: Number(searchParams?.get('page')) || 1,
    size: searchParams?.get('size') || undefined,
    fittingType: (searchParams?.get('fitting') as ProductFilters['fittingType']) || undefined,
    maxPrice: Number(searchParams?.get('maxPrice')) || undefined,
    ...(isNewCollection && { isNewCollection: true }),
  };

  useEffect(() => {
    if (debouncedSearch !== (searchParams?.get('search') || '')) {
      updateFilter({ search: debouncedSearch, page: 1 } as any);
    }
  }, [debouncedSearch]);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters as ProductFilters),
    staleTime: 5 * 60 * 1000,
  });

  const updateFilter = (updates: Partial<ProductFilters & { search?: string }>) => {
    const newParams = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(updates).forEach(([k, v]) => {
      const key = k === 'fittingType' ? 'fitting' : k;
      if (v !== undefined && v !== '') newParams.set(key, String(v));
      else newParams.delete(key);
    });
    newParams.delete('page');
    router.push(`/${categorySlug}?${newParams.toString()}`);
  };

  const resetFilters = () => {
    setSearchInput('');
    router.push(`/${categorySlug}`);
  };

  const products = (data?.data ?? []) as unknown as ProductCard[];
  const totalPages = data?.pages ?? 1;
  const total = data?.total ?? 0;

  return (
    <div className="min-h-screen bg-[#F5F4F1] pb-20">
      <div className="container-page pt-10">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: categoryName }]} />

        {/* Premium Header Area */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-10 mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {isNewCollection && (
              <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase text-[#8b0026] mb-3 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-[#8b0026]" /> New Collection
              </p>
            )}
            <h1 className="font-display text-5xl md:text-7xl lg:text-[80px] text-[#151515] leading-[0.9] tracking-tight mb-4 capitalize">
              {categoryName}
            </h1>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4"
          >
            {/* Search Bar */}
            <div className="relative w-full md:w-[320px] group">
              <Search size={16} strokeWidth={1.5} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#151515]/40 group-focus-within:text-[#8b0026] transition-colors duration-300" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-14 bg-white/60 backdrop-blur-md border border-[#151515]/5 hover:border-[#151515]/15 rounded-full pl-12 pr-6 text-sm font-sans placeholder:text-[#151515]/30 text-[#151515] focus:outline-none focus:border-[#8b0026]/30 focus:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300"
              />
            </div>

            <div className="hidden lg:block w-full md:w-auto">
              <SortDropdown
                value={filters.sort || 'newest'}
                onChange={(v) => updateFilter({ sort: v as ProductFilters['sort'] })}
              />
            </div>
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="flex gap-12 items-start">
          <div className="hidden lg:block sticky top-28 w-[240px] flex-shrink-0">
            <FilterSidebar filters={filters} onChange={updateFilter} onReset={resetFilters} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="lg:hidden flex items-center justify-between gap-3 mb-8">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="flex-shrink-0 flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.15em] uppercase border border-[#151515]/10 bg-white rounded-full px-6 h-12 hover:bg-[#151515] hover:text-white transition-all duration-300 shadow-sm"
              >
                <Filter size={14} strokeWidth={1.5} /> Filters
              </button>
              <SortDropdown
                value={filters.sort || 'newest'}
                onChange={(v) => updateFilter({ sort: v as ProductFilters['sort'] })}
                className="flex-1 max-w-[200px]"
              />
            </div>

            {!isLoading && products.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-[0.16,1,0.3,1]">
                <ProductGrid products={products} isLoading={isLoading} />
                <PaginationBar
                  currentPage={filters.page || 1}
                  totalPages={totalPages}
                  onPageChange={(p) => updateFilter({ page: p })}
                />
              </div>
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

export default function CategoryPage() {
  return (
    <Suspense>
      <CategoryPLPContent />
    </Suspense>
  );
}
