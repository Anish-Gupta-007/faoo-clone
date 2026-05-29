'use client';
// src/app/forgot-password/page.tsx
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const schema = z.object({ email: z.string().email() });
type ForgotData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ForgotData) => {
    setLoading(true);
    try {
      await authService.forgotPassword(data);
      toast.success('OTP sent to your email');
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 flex flex-col gap-6">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl text-[#0A0A0A]">Faoo</Link>
          <h1 className="font-display text-2xl text-[#0A0A0A] mt-4">Forgot Password</h1>
          <p className="font-sans text-sm text-[#525252] mt-1">We&apos;ll send a reset OTP to your email</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>Send OTP</Button>
        </form>
        <p className="text-center text-sm font-sans text-[#525252]">
          <Link href="/login" className="text-[#0A0A0A] hover:underline">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
