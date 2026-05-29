'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, MapPin, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { formatPrice } from '@/utils/formatPrice';
import { formatDate } from '@/utils/formatDate';
import { OrderStatus } from '@/types/order.types';
import Link from 'next/link';

const statusConfig: Record<OrderStatus, { color: string; bg: string; icon: any }> = {
  Pending: { color: '#B45309', bg: '#FFFBEB', icon: Clock },
  Confirmed: { color: '#0A0A0A', bg: '#F5F5F5', icon: CheckCircle2 },
  Processing: { color: '#0A0A0A', bg: '#F5F5F5', icon: Package },
  Shipped: { color: '#0A0A0A', bg: '#F5F5F5', icon: Truck },
  Delivered: { color: '#15803D', bg: '#F0FDF4', icon: CheckCircle2 },
  Cancelled: { color: '#B91C1C', bg: '#FEF2F2', icon: CheckCircle2 },
};

const STATUS_ORDER: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();
  const orderId = (params?.orderId as string) || '';

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: isAuthenticated && !!orderId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FBFBFB]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-page py-20 text-center bg-[#FBFBFB] min-h-screen">
        <p className="font-sans text-[#A3A3A3]">Order not found</p>
        <Link href="/account/orders" className="text-sm font-sans underline mt-4 block">Return to orders</Link>
      </div>
    );
  }

  const currentStep = STATUS_ORDER.indexOf(order.orderStatus);
  const StatusIcon = statusConfig[order.orderStatus].icon;

  return (
    <div className="min-h-screen bg-[#FBFBFB] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-[#F0F0F0] sticky top-0 z-40">
        <div className="container-page py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <Link 
                href="/account/orders" 
                className="flex items-center gap-2 text-[10px] font-sans font-bold tracking-[0.2em] text-[#A3A3A3] uppercase hover:text-[#0A0A0A] transition-colors group"
              >
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                Back to Orders
              </Link>
              <span className="text-[10px] font-sans text-[#A3A3A3] tracking-widest uppercase">
                Placed on {formatDate(order.createdAt)}
              </span>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="font-display text-4xl md:text-5xl text-[#0A0A0A] tracking-tight">
                  {order.orderId}
                </h1>
                <div className="flex items-center gap-3">
                  <div 
                    className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#F0F0F0] bg-white"
                    style={{ color: statusConfig[order.orderStatus].color }}
                  >
                    <StatusIcon size={12} />
                    <span className="text-[10px] font-sans font-bold tracking-widest uppercase">{order.orderStatus}</span>
                  </div>
                  {order.trackingId && (
                    <span className="text-[10px] font-sans text-[#A3A3A3] tracking-widest uppercase border-l border-[#F0F0F0] pl-3">
                      ID: {order.trackingId}
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden md:block">
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-sans font-bold tracking-widest text-[#A3A3A3] uppercase mb-1">Total Amount</p>
                    <p className="font-sans text-xl font-medium text-[#0A0A0A]">{formatPrice(order.totalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container-page py-12">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
          {/* Left Column: Tracking & Items */}
          <div className="space-y-10">
            {/* Order Items */}
            <section className="space-y-6">
              <h2 className="text-[11px] font-sans font-bold tracking-[0.2em] text-[#0A0A0A] uppercase px-2">Shipment details</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)] group hover:border-[#0A0A0A]/10 transition-all duration-500"
                  >
                    <div className="flex gap-6">
                      <div className="w-24 h-32 bg-[#F9F9F9] rounded overflow-hidden flex-shrink-0 relative">
                         {/* We don't have images in snapshot, but we provide the support structure */}
                        <div className="w-full h-full flex items-center justify-center text-[#E5E5E5]">
                          <Package size={24} strokeWidth={1} />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-sans text-base font-medium text-[#0A0A0A] tracking-tight">{item.productName}</h3>
                            <span className="font-sans text-sm font-medium text-[#0A0A0A]">{formatPrice(item.subtotal)}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] font-sans text-[#737373] tracking-wide">
                            <span className="bg-[#F5F5F5] px-2 py-0.5 rounded text-[#525252] uppercase font-bold">{item.color}</span>
                            <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
                            <span className="bg-[#F5F5F5] px-2 py-0.5 rounded text-[#525252] uppercase font-bold">Size {item.size}</span>
                            <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
                            <span>Qty {item.quantity}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-sans font-bold tracking-widest text-[#15803D] uppercase">
                          <CheckCircle2 size={10} />
                          Ready for dispatch
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Cards */}
          <div className="space-y-6 lg:sticky lg:top-32">
            {/* Delivery Address Card */}
            <section className="bg-white p-8 rounded-xl border border-[#F0F0F0] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#F9F9F9] flex items-center justify-center text-[#0A0A0A]">
                  <MapPin size={14} />
                </div>
                <h2 className="text-[11px] font-sans font-bold tracking-[0.2em] text-[#0A0A0A] uppercase">Delivery details</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="font-sans text-sm font-semibold text-[#0A0A0A]">{order.addressSnapshot?.fullName}</p>
                  <div className="font-sans text-[13px] text-[#525252] leading-relaxed">
                    <p>{order.addressSnapshot?.addressLine1}</p>
                    <p>{order.addressSnapshot?.city}, {order.addressSnapshot?.state}</p>
                    <p>{order.addressSnapshot?.pincode}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-[#F0F0F0]">
                  <p className="text-[10px] font-sans font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Contact number</p>
                  <p className="font-sans text-[13px] text-[#0A0A0A] font-medium">{order.addressSnapshot?.phone}</p>
                </div>
              </div>
            </section>

            {/* Payment Summary Card */}
            <section className="bg-[#0A0A0A] p-8 rounded-xl shadow-xl text-white overflow-hidden relative">
              {/* Decorative background element */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <CreditCard size={14} />
                  </div>
                  <h2 className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase opacity-80">Payment Summary</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-[13px] font-sans opacity-70">
                    <span>Payment method</span>
                    <span className="font-medium text-white">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-sans opacity-70">
                    <span>Subtotal</span>
                    <span className="font-medium text-white">{formatPrice(order.totalAmount - (order.shippingCharge || 0))}</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-sans opacity-70">
                    <span>Shipping</span>
                    <span className="font-medium text-white">{order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}</span>
                  </div>
                  
                  <div className="pt-6 mt-2 border-t border-white/10 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-sans font-bold tracking-[0.2em] uppercase opacity-50">Total Paid</p>
                      <p className="font-display text-3xl tracking-tight leading-none">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <Badge variant="success" className="bg-white/10 text-white border-white/20 text-[9px] px-3">
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </section>

            {/* Support Link */}
            <div className="px-2">
              <p className="font-sans text-[11px] text-[#A3A3A3] text-center">
                Need help with this order? <Link href="/support" className="text-[#0A0A0A] font-bold hover:underline">Contact Support</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
