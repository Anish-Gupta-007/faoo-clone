'use client';
// src/app/register/page.tsx
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  fullName: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile'),
  password: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/, 'Min 8 chars, 1 uppercase, 1 number, 1 special'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

const otpSchema = z.object({ otp: z.string().length(6, 'OTP must be 6 digits') });

type FormData = z.infer<typeof schema>;
type OTPData = z.infer<typeof otpSchema>;

import { Suspense } from 'react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const { register: regOTP, handleSubmit: submitOTP, formState: { errors: otpErrors } } = useForm<OTPData>({ resolver: zodResolver(otpSchema) });

  const onRegister = async (data: FormData) => {
    setLoading(true);
    try {
      await authService.register({ fullName: data.fullName, email: data.email, phone: data.phone, password: data.password });
      setEmail(data.email);
      setStep('otp');
      toast.success('OTP sent to your email!');
    } catch (err: unknown) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async (data: OTPData) => {
    setLoading(true);
    try {
      const res = await authService.verifyOTP({ email, otp: data.otp });
      const localCartItems = useAuthStore.getState().isAuthenticated ? [] : (await import('@/store/cartStore')).useCartStore.getState().cart?.items || [];

      setAuth(res.user, res.accessToken, res.refreshToken);

      if (localCartItems.length > 0) {
        const { default: api } = await import('@/lib/axios');
        for (const item of localCartItems) {
          if (item._id.toString().startsWith('local')) {
            await api.post('/cart/add', { variantId: item.variantId, productId: item.productId, quantity: item.quantity }).catch(() => {});
          }
        }
      }

      toast.success('Account created! Welcome to Faoo.');
      const redirect = searchParams?.get('redirect') || '/';
      router.push(redirect);
    } catch {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 flex flex-col gap-6">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl text-[#0A0A0A]">Faoo</Link>
          <h1 className="font-display text-2xl text-[#0A0A0A] mt-4">
            Join Faoo
          </h1>
          <p className="font-sans text-sm text-[#525252] mt-1">
            Create your account
          </p>
        </div>

        {step === 'register' ? (
          <form onSubmit={handleSubmit(onRegister)} className="flex flex-col gap-4 mt-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...register('fullName')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="9876543210"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              Create Account
            </Button>
          </form>
        ) : (
          <form onSubmit={submitOTP(onVerifyOTP)} className="flex flex-col gap-4 mt-4">
            <Input
              label="Enter OTP"
              type="text"
              placeholder="123456"
              maxLength={6}
              error={otpErrors.otp?.message}
              {...regOTP('otp')}
            />
            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              Verify OTP
            </Button>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              size="lg"
              onClick={() => setStep('register')}
            >
              Back
            </Button>
          </form>
        )}

        <p className="text-center text-sm font-sans text-[#525252]">
          Already have an account?{' '}
          <Link href={`/login${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`} className="text-[#0A0A0A] font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F9F9F7]">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
