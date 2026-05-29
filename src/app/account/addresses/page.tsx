'use client';
// src/app/account/addresses/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/authStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Address, AddressPayload } from '@/types/user.types';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  country: z.string().default('India'),
});
type AddrData = z.infer<typeof schema>;

export default function AddressesPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: userService.getAddresses,
    enabled: isAuthenticated,
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddrData>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'India' },
  });

  const saveMutation = useMutation({
    mutationFn: (d: AddressPayload) =>
      editId ? userService.updateAddress(editId, d) : userService.addAddress(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      setShowForm(false); setEditId(null); reset();
      toast.success(editId ? 'Address updated' : 'Address added');
    },
    onError: () => toast.error('Failed to save address'),
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteAddress,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted');
    },
  });

  const defaultMutation = useMutation({
    mutationFn: userService.setDefaultAddress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });

  const handleEdit = (addr: Address) => {
    setEditId(addr._id);
    reset({ fullName: addr.fullName, phone: addr.phone, addressLine1: addr.addressLine1, addressLine2: addr.addressLine2, city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country });
    setShowForm(true);
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;

  return (
    <div className="container-page py-10 max-w-3xl">
      <h1 className="font-display text-4xl text-[#0A0A0A] mb-8">My Addresses</h1>
      <div className="flex flex-col gap-4 mb-6">
        {(addresses ?? []).map((addr: Address) => (
          <div key={addr._id} className="border border-[#EFEFEF] rounded-lg p-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#A3A3A3] mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-sans text-sm font-medium">{addr.fullName}</p>
                  {addr.isDefault && <span className="text-xs text-[#27AE60] bg-[#27AE60]/10 px-2 py-0.5 rounded">Default</span>}
                </div>
                <p className="font-sans text-sm text-[#525252] mt-0.5">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="font-sans text-sm text-[#525252]">{addr.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!addr.isDefault && (
                <button onClick={() => defaultMutation.mutate(addr._id)} title="Set default" className="p-1.5 hover:bg-gray-100 rounded"><Star size={14} className="text-[#A3A3A3]" /></button>
              )}
              <button onClick={() => handleEdit(addr)} className="text-xs font-sans text-[#525252] hover:text-[#0A0A0A] px-2 py-1 hover:bg-gray-50 rounded">Edit</button>
              <button onClick={() => deleteMutation.mutate(addr._id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-[#C0392B]" /></button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => { setEditId(null); reset({ country: 'India' }); setShowForm((v) => !v); }} className="flex items-center gap-2 text-sm font-sans text-[#525252] hover:text-[#0A0A0A] mb-4">
        <Plus size={14} /> {showForm ? 'Cancel' : 'Add New Address'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit((d) => saveMutation.mutate(d as AddressPayload))} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 border border-[#EFEFEF] rounded-lg">
          <Input label="Full Name" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Input label="Address Line 1" error={errors.addressLine1?.message} {...register('addressLine1')} className="sm:col-span-2" />
          <Input label="Address Line 2 (optional)" {...register('addressLine2')} className="sm:col-span-2" />
          <Input label="City" error={errors.city?.message} {...register('city')} />
          <Input label="State" error={errors.state?.message} {...register('state')} />
          <Input label="Pincode" error={errors.pincode?.message} {...register('pincode')} />
          <Input label="Country" {...register('country')} />
          <Button type="submit" variant="primary" loading={saveMutation.isPending} className="sm:col-span-2">
            {editId ? 'Update Address' : 'Save Address'}
          </Button>
        </form>
      )}
    </div>
  );
}
