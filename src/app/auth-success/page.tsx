'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Spinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

function AuthSuccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { migrateCart, fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    const processAuth = async () => {
      const accessToken = searchParams?.get('accessToken');
      const refreshToken = searchParams?.get('refreshToken');

      if (accessToken && refreshToken) {
        // Optimistically set auth so we can fetch profile right away
        setAuth({} as any, accessToken, refreshToken);
        
        try {
          // Fetch real user profile to complete auth setup
          const { userService } = await import('@/services/userService');
          const user = await userService.getProfile();
          setAuth(user, accessToken, refreshToken);
          
          await migrateCart();
          await Promise.all([fetchCart(), fetchWishlist()]);
          
          toast.success(`Welcome to Faoo!`);
          router.replace('/');
        } catch (error) {
          console.error("Auth sync failed", error);
          toast.error("Failed to sync profile");
          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    };

    processAuth();
  }, [searchParams, router, setAuth, migrateCart, fetchCart, fetchWishlist]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">
      <div className="text-center flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="font-sans text-sm text-[#525252]">Signing you in securely...</p>
      </div>
    </div>
  );
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]"><Spinner size="lg" /></div>}>
      <AuthSuccessHandler />
    </Suspense>
  );
}
