'use client';
import { useState, useEffect } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { useUIStore } from '@/store/uiStore';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { productService } from '@/services/productService';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/formatPrice';

export function SearchDrawer() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    async function search() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await productService.getProducts({ search: debouncedQuery, limit: 5 });
        setResults(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    search();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <Drawer isOpen={isSearchOpen} onClose={closeSearch} side="right" width="400px" title="Search">
      <div className="p-6 flex flex-col h-full">
        <form onSubmit={handleSubmit} className="relative mb-6">
          <Input
            autoFocus
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <span className="text-sm text-[#A3A3A3]">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-medium tracking-widest uppercase text-[#A3A3A3] mb-2">Suggestions</h3>
              {results.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="flex gap-4 items-center group"
                >
                  <div className="relative w-12 h-16 bg-[#F7F7F7] rounded overflow-hidden flex-shrink-0">
                    {product.primaryImage && (
                      <img src={product.primaryImage} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#0A0A0A] group-hover:text-[#525252] transition-colors line-clamp-1">{product.name}</span>
                    <span className="text-sm text-[#525252] mt-0.5">{formatPrice(product.price)}</span>
                  </div>
                </Link>
              ))}
              <button
                onClick={handleSubmit}
                className="mt-4 flex items-center justify-between py-3 border-t border-[#EFEFEF] text-sm font-medium text-[#0A0A0A] hover:text-[#525252] transition-colors"
              >
                View all results <ArrowRight size={16} />
              </button>
            </div>
          ) : query.trim() ? (
            <div className="text-center py-10 text-sm text-[#A3A3A3]">
              No results found for "{query}"
            </div>
          ) : (
            <div className="text-center py-10 text-sm text-[#A3A3A3]">
              Start typing to search
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
