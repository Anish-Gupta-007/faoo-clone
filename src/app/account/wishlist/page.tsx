'use client';
// src/app/account/wishlist/page.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { ProductGrid } from '@/components/plp/ProductGrid';
import { Spinner } from '@/components/ui/Spinner';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/types/product.types';

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist-products'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return (res.data.wishlist ?? [])
        .filter(Boolean)
        .map((p: any) => ({
          ...p,
          primaryImage: p.media?.find((m: any) => m.isPrimary)?.url || p.media?.[0]?.url || '',
        })) as ProductCard[];
    },
    enabled: isAuthenticated,
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;

  const products = data ?? [];

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-4xl text-[#0A0A0A] mb-8">My Wishlist</h1>
      {products.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-4">
          <Heart size={40} className="text-[#D4D4D4]" />
          <h1 className="font-display text-2xl text-[#0A0A0A]">Your wishlist is empty</h1>
          <p className="text-sm font-sans text-[#A3A3A3]">Save items you love to build your perfect wardrobe.</p>
          <Link href="/men">
            <Button variant="primary">Start Browsing</Button>
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
