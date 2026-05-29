'use client';
// src/app/account/page.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Package, MapPin, Heart, User } from 'lucide-react';

const schema = z.object({
  fullName: z.string().min(2).max(60),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile'),
});
type ProfileData = z.infer<typeof schema>;

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, updateUser } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: userService.getProfile,
    enabled: isAuthenticated,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileData>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: profile?.fullName, phone: profile?.phone },
  });

  useEffect(() => {
    if (profile) reset({ fullName: profile.fullName, phone: profile.phone });
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: (updated) => {
      updateUser(updated);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Update failed'),
  });

  const initials = user?.fullName ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;

  return (
    <div className="container-page py-10 max-w-3xl">
      <h1 className="font-display text-4xl text-[#0A0A0A] mb-8">My Account</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'My Orders', href: '/account/orders', icon: Package },
          { label: 'Addresses', href: '/account/addresses', icon: MapPin },
          { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
        ].map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-3 p-4 border border-[#EFEFEF] rounded-lg hover:border-[#0A0A0A] transition-colors">
            <Icon size={18} className="text-[#525252]" />
            <span className="font-sans text-sm font-medium text-[#0A0A0A]">{label}</span>
          </Link>
        ))}
      </div>
      <div className="bg-white border border-[#EFEFEF] rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-sans font-medium text-lg">
            {initials}
          </div>
          <div>
            <p className="font-sans font-medium text-[#0A0A0A]">{profile?.fullName}</p>
            <p className="font-sans text-sm text-[#A3A3A3]">{profile?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Input label="Email" value={profile?.email} disabled hint="Email cannot be changed" />
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" loading={updateMutation.isPending}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
