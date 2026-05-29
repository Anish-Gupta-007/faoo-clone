'use client';
// src/app/[category]/[subcategory]/page.tsx
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { ProductGrid } from '@/components/plp/ProductGrid';
import { FilterSidebar } from '@/components/plp/FilterSidebar';
import { SortDropdown } from '@/components/plp/SortDropdown';
import { PaginationBar } from '@/components/plp/PaginationBar';
import { EmptyState } from '@/components/plp/EmptyState';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ProductFilters, ProductCard } from '@/types/product.types';
import { Filter, X } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { motion, AnimatePresence } from 'framer-motion';

function SubcategoryContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = (params?.category as string) || '';
  const subcategorySlug = (params?.subcategory as string) || '';
  const [showFilter, setShowFilter] = useState(false);
  
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const currentCategory = categories.find((cat) => cat.slug === categorySlug);
  const currentSubcategory = currentCategory?.subcategories?.find(sub => sub.slug === subcategorySlug);

  const categoryName = currentCategory ? currentCategory.name : categorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const subcategoryName = currentSubcategory ? currentSubcategory.name : subcategorySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const filters: ProductFilters = {
    category: categorySlug,
    subCategory: subcategorySlug,
    sort: (searchParams?.get('sort') as ProductFilters['sort']) || 'newest',
    page: Number(searchParams?.get('page')) || 1,
    size: searchParams?.get('size') || undefined,
    fittingType: (searchParams?.get('fitting') as ProductFilters['fittingType']) || undefined,
    maxPrice: Number(searchParams?.get('maxPrice')) || undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });

  const updateFilter = (updates: Partial<ProductFilters>) => {
    const p = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(updates).forEach(([k, v]) => {
      const key = k === 'fittingType' ? 'fitting' : k;
      if (v !== undefined && v !== '') p.set(key, String(v));
      else p.delete(key);
    });
    p.delete('page');
    router.push(`/${categorySlug}/${subcategorySlug}?${p.toString()}`);
  };


  const products = (data?.data ?? []) as unknown as ProductCard[];

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: categoryName, href: `/${categorySlug}` }, { label: subcategoryName }]} />
      <div className="flex items-end justify-between mt-6 mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-[#0A0A0A]">{subcategoryName}</h1>
        <p className="text-sm font-sans text-[#A3A3A3]">{data?.total ?? 0} products</p>
      </div>
      <div className="flex gap-8">
        <div className="hidden lg:block">
          <FilterSidebar filters={filters} onChange={updateFilter} onReset={() => router.push(`/${categorySlug}/${subcategorySlug}`)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setShowFilter(true)} className="lg:hidden flex items-center gap-2 text-sm font-sans border border-[#E5E5E5] rounded px-3 h-9">
              <Filter size={14} /> Filter
            </button>
            <div className="ml-auto">
              <SortDropdown value={filters.sort || 'newest'} onChange={(v) => updateFilter({ sort: v as ProductFilters['sort'] })} />
            </div>
          </div>
        {!isLoading && products.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <ProductGrid products={products} isLoading={isLoading} />
            <PaginationBar currentPage={filters.page || 1} totalPages={data?.pages ?? 1} onPageChange={(p) => updateFilter({ page: p })} />
          </>
        )}
      </div>
    </div>

    <AnimatePresence>
      {showFilter && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilter(false)}
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
              onReset={() => router.push(`/${categorySlug}/${subcategorySlug}`)}
              onClose={() => setShowFilter(false)}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </div>
);
}

export default function SubcategoryPage() {
  return <Suspense><SubcategoryContent /></Suspense>;
}
