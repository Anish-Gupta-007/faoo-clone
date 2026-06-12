'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, RotateCcw, ArrowLeftRight, Package, Calendar, Tag, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { returnService } from '@/services/returnService';
import toast from 'react-hot-toast';

interface OrderDetail {
  id: string;
  productName: string;
  productImage: string;
  size: string;
  status: string;
  date: string;
}

export function ReturnsPortal() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState(false);
  
  const [requestAction, setRequestAction] = useState<'Return' | 'Exchange' | null>(null);
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setOrder(null);
    setSuccess(false);
    setRequestAction(null);
    setReason('');

    try {
      const res = await returnService.checkOrder(orderId.trim().toUpperCase());
      if (res.success && res.order) {
        const item = res.order.items[0];
        setOrder({
          id: res.order.orderId,
          productName: item?.productName || 'Unknown Product',
          productImage: item?.productId?.media?.[0]?.url || 'https://via.placeholder.com/150',
          size: item?.size || 'N/A',
          status: res.order.orderStatus,
          date: new Date(res.order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    setSubmitting(true);
    try {
      await returnService.createReturnRequest({
        orderId: order!.id,
        requestType: requestAction!,
        reason
      });
      setSuccess(true);
      toast.success(`${requestAction} request submitted successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white min-h-[80vh] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {!order ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-center mb-12">
                <h1 className="font-display text-4xl md:text-5xl text-[#0A0A0A] mb-4 tracking-tight uppercase font-light">
                  Returns & Exchanges
                </h1>
                <p className="font-sans text-xs text-[#737373] tracking-[0.2em] uppercase">
                  Manage your recent orders
                </p>
              </div>

              <form onSubmit={handleCheckOrder} className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="ENTER ORDER NUMBER (e.g. #1001)"
                    className={cn(
                      "w-full bg-[#F9F9F9] border-none px-6 py-6 font-sans text-[11px] tracking-[0.2em] uppercase outline-none transition-all duration-500",
                      "placeholder:text-[#A3A3A3] focus:bg-[#F2F2F2]",
                      error && "text-red-500 ring-1 ring-red-500/20"
                    )}
                    required
                  />
                  <div className="absolute bottom-0 left-0 h-[1px] bg-[#0A0A0A] w-0 group-focus-within:w-full transition-all duration-700 ease-in-out" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A0A0A] text-white py-6 font-sans text-[11px] font-black tracking-[0.3em] uppercase overflow-hidden relative group transition-transform active:scale-[0.98]"
                >
                  <span className={cn(
                    "relative z-10 flex items-center justify-center gap-3 transition-opacity duration-300",
                    loading ? "opacity-0" : "opacity-100"
                  )}>
                    Check Order <ArrowRight size={16} />
                  </span>
                  
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-[#8b0026] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                </button>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-center font-sans text-[10px] text-[#8b0026] tracking-[0.1em] uppercase font-bold"
                    >
                      Order not found. Please verify the ID.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-16 pt-8 border-t border-[#F0F0F0] text-center">
                <p className="font-sans text-[10px] text-[#A3A3A3] tracking-[0.1em] uppercase leading-relaxed max-w-xs mx-auto">
                  Items must be in original condition with tags attached. Returns are accepted within 7 days.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-[#F0F0F0]">
                <button 
                  onClick={() => setOrder(null)}
                  className="flex items-center gap-2 font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-[#737373] hover:text-[#0A0A0A] transition-colors"
                >
                  <ArrowRight size={14} className="rotate-180" /> Back
                </button>
                <span className="font-sans text-[10px] font-black tracking-[0.2em] uppercase text-[#0A0A0A]">
                  Order Validated
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-8 bg-[#F9F9F9] p-8 rounded-2xl">
                <div className="w-32 h-40 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                  <img 
                    src={order.productImage} 
                    alt={order.productName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <h3 className="font-display text-xl text-[#0A0A0A] leading-tight">
                    {order.productName}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                    <div className="space-y-1">
                      <p className="font-sans text-[9px] text-[#A3A3A3] tracking-[0.1em] uppercase">Size</p>
                      <p className="font-sans text-[11px] text-[#0A0A0A] font-bold tracking-[0.1em] uppercase">{order.size}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-sans text-[9px] text-[#A3A3A3] tracking-[0.1em] uppercase">Status</p>
                      <p className="font-sans text-[11px] text-[#8b0026] font-bold tracking-[0.1em] uppercase">{order.status}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-sans text-[9px] text-[#A3A3A3] tracking-[0.1em] uppercase">Order Date</p>
                      <p className="font-sans text-[11px] text-[#0A0A0A] font-bold tracking-[0.1em] uppercase">{order.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-sans text-[9px] text-[#A3A3A3] tracking-[0.1em] uppercase">Order ID</p>
                      <p className="font-sans text-[11px] text-[#0A0A0A] font-bold tracking-[0.1em] uppercase">#{order.id.split('-').pop()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {!requestAction && !success && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setRequestAction('Return')} className="flex items-center justify-center gap-4 bg-white border border-[#F0F0F0] py-6 font-sans text-[11px] font-black tracking-[0.3em] uppercase hover:bg-[#F9F9F9] transition-all duration-300">
                    <RotateCcw size={18} /> Return
                  </button>
                  <button onClick={() => setRequestAction('Exchange')} className="flex items-center justify-center gap-4 bg-[#0A0A0A] text-white py-6 font-sans text-[11px] font-black tracking-[0.3em] uppercase hover:bg-[#8b0026] transition-all duration-300">
                    <ArrowLeftRight size={18} /> Exchange
                  </button>
                </div>
              )}

              {requestAction && !success && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between">
                     <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase">Reason for {requestAction}</p>
                     <button onClick={() => setRequestAction(null)} className="text-[10px] text-[#A3A3A3] underline">Cancel</button>
                  </div>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please explain why you want to return or exchange this item..."
                    className="w-full bg-[#F9F9F9] border border-[#EFEFEF] p-4 text-sm font-sans min-h-[100px] outline-none focus:border-[#0A0A0A]"
                  />
                  <button onClick={handleSubmitRequest} disabled={submitting} className="w-full bg-[#0A0A0A] text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#8b0026] transition-colors">
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              )}

              {success && (
                <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-6 text-center rounded-xl space-y-2">
                  <p className="font-sans text-[11px] font-bold tracking-[0.2em] text-green-700 uppercase">Request Received</p>
                  <p className="text-sm text-green-600">Your {requestAction?.toLowerCase()} request has been sent to our team. We will review it and get back to you shortly.</p>
                </div>
              )}

              <div className="pt-8 text-center">
                <p className="font-sans text-[10px] text-[#737373] tracking-[0.1em] uppercase">
                  Need help? Contact <a href="mailto:hello@faooofficial.com" className="text-[#0A0A0A] underline underline-offset-4">hello@faooofficial.com</a>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
