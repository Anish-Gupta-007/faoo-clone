'use client';
// src/app/login/page.tsx
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Suspense } from 'react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});
type LoginData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const { migrateCart, fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setLoading(true);
    try {
      const res = await authService.login(data);

      setAuth(res.user, res.accessToken, res.refreshToken);

      // Migrate local cart items to server after login
      await migrateCart();

      await Promise.all([fetchCart(), fetchWishlist()]);
      toast.success(`Welcome back, ${res.user.fullName.split(' ')[0]}!`);
      const redirect = searchParams?.get('redirect') || '/';
      router.push(redirect);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 flex flex-col gap-6">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl text-[#0A0A0A]">Faoo</Link>
          <h1 className="font-display text-2xl text-[#0A0A0A] mt-4">Welcome back</h1>
          <p className="font-sans text-sm text-[#525252] mt-1">Sign in to your account via Shopify</p>
        </div>
        
        <div className="flex flex-col gap-4 mt-4">
          <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/auth/shopify/authorize`}>
            <Button type="button" variant="primary" fullWidth size="lg">Sign In with Shopify</Button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
