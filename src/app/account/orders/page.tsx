'use client';
// src/app/account/orders/page.tsx
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatPrice';
import { formatDateShort } from '@/utils/formatDate';
import { OrderStatus } from '@/types/order.types';
import { Package } from 'lucide-react';

const statusColor: Record<OrderStatus, 'default' | 'success' | 'error' | 'warning' | 'new'> = {
  Pending: 'warning',
  Confirmed: 'new',
  Processing: 'new',
  Shipped: 'new',
  Delivered: 'success',
  Cancelled: 'error',
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getMyOrders(),
    enabled: isAuthenticated,
  });

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>;

  return (
    <div className="container-page py-10 max-w-3xl">
      <div className="text-center py-16 flex flex-col items-center gap-6">
        <h1 className="font-display text-4xl text-[#0A0A0A]">My Orders</h1>
        <p className="text-sm font-sans text-[#A3A3A3] max-w-md mx-auto">
          View your orders and order history on Shopify
        </p>
        <a
          href="https://shopify.com/100271948085/account"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="lg">
            View Orders on Shopify
          </Button>
        </a>
      </div>
    </div>
  );
}
