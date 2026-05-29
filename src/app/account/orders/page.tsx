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

  const orders = data?.orders ?? [];

  return (
    <div className="container-page py-10 max-w-3xl">
      <h1 className="font-display text-4xl text-[#0A0A0A] mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <Package size={40} className="text-[#D4D4D4]" />
          <h1 className="font-display text-2xl text-[#0A0A0A]">No orders yet</h1>
          <p className="text-sm font-sans text-[#A3A3A3] max-w-xs mx-auto">You haven't placed any orders. Start exploring our collections.</p>
          <Link href="/men">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order: any) => (
            <Link key={order._id} href={`/account/orders/${order.orderId}`} className="block border border-[#EFEFEF] rounded-lg p-5 hover:border-[#A3A3A3] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-sans text-sm font-medium text-[#0A0A0A]">{order.orderId}</p>
                  <p className="font-sans text-xs text-[#A3A3A3] mt-0.5">{formatDateShort(order.createdAt)}</p>
                  <p className="font-sans text-sm text-[#525252] mt-1">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={statusColor[order.orderStatus as OrderStatus]}>{order.orderStatus}</Badge>
                  <p className="font-sans text-sm font-medium text-[#0A0A0A]">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
