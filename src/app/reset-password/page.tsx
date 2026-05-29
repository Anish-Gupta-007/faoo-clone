'use client';
// src/app/reset-password/page.tsx
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '@/services/authService';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

const schema = z.object({
  otp: z.string().length(6),
  newPassword: z.string().min(8).regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

type ResetData = z.infer<typeof schema>;

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ResetData) => {
    setLoading(true);
    try {
      await authService.resetPassword({ email, otp: data.otp, newPassword: data.newPassword });
      toast.success('Password reset successfully');
      router.push('/login');
    } catch {
      toast.error('Invalid OTP or expired. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F7] px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 flex flex-col gap-6">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl text-[#0A0A0A]">Faoo</Link>
          <h1 className="font-display text-2xl text-[#0A0A0A] mt-4">Reset Password</h1>
          <p className="font-sans text-sm text-[#525252] mt-1">Enter OTP sent to {email}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="OTP" placeholder="6-digit OTP" maxLength={6} error={errors.otp?.message} {...register('otp')} />
          <Input label="New Password" type="password" error={errors.newPassword?.message} {...register('newPassword')} />
          <Input label="Confirm Password" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>Reset Password</Button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>;
}
