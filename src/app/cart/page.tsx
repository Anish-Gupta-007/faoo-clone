'use client';
// src/app/cart/page.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { CartItem } from '@/types/cart.types';
import { Button } from '@/components/ui/Button';
import { QuantityCounter } from '@/components/shared/QuantityCounter';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { formatPrice } from '@/utils/formatPrice';
import { useDebounce } from '@/hooks/useDebounce';
import toast from 'react-hot-toast';
import { trackBeginCheckout } from '@/lib/analytics/gtagEvents';
import { isGokwikEnabled, useGokwikSdk, triggerGokwikCheckout } from '@/lib/gokwik/gokwikClient';


function CartItemRow({ item, isCartBusy }: { item: CartItem; isCartBusy: boolean }) {
  const { updateItem, removeItem } = useCartStore();
  const [qty, setQty] = useState(item.quantity);
  const debounced = useDebounce(qty, 400);

  useEffect(() => {
    if (debounced !== item.quantity) updateItem(item.variantId, debounced);
  }, [debounced]);

  return (
    <div className="flex gap-3 md:gap-4 py-4 md:py-5 border-b border-[#EFEFEF]">
      <div className="relative w-16 md:w-20 h-20 md:h-24 flex-shrink-0 rounded overflow-hidden bg-[#F7F7F7]">
        {item.product.primaryImage && (
          <Image src={item.product.primaryImage} alt={item.product.name} fill className="object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Link href={`/products/${item.product.slug}`} className="font-sans text-sm md:text-base font-medium text-[#0A0A0A] hover:text-[#525252] truncate">{item.product.name}</Link>
        <p className="text-xs text-[#A3A3A3] font-sans">{item.variant.color} · {item.variant.size} · {item.variant.fittingType}</p>
        {item.variant.stockQuantity <= 5 && item.variant.stockQuantity > 0 && (
          <span className="text-[9px] font-sans tracking-[0.15em] uppercase text-amber-500">
            Only {item.variant.stockQuantity} left
          </span>
        )}
        <p className="text-sm md:text-base font-medium font-sans">{formatPrice(item.price)}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-1 mt-2 sm:mt-1">
          <QuantityCounter value={qty} onChange={setQty} max={item.variant.stockQuantity} disabled={isCartBusy} />
          <button 
            disabled={isCartBusy}
            onClick={() => removeItem(item.variantId)} 
            className="text-xs text-[#A3A3A3] hover:text-[#C0392B] flex items-center gap-1 transition-colors w-fit disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      </div>
      <div className="text-sm md:text-base font-medium font-sans text-[#0A0A0A] flex-shrink-0 whitespace-nowrap">
        {formatPrice(item.price * qty)}
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, isLoading, fetchCart, isCartBusy } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const isGokwik = isGokwikEnabled();
  const isSdkReady = useGokwikSdk();

  useEffect(() => { fetchCart(); }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>
  );

  if (!cart || cart.items.length === 0) return (
    <div className="container-page py-20 flex flex-col items-center gap-5">
      <ShoppingBag size={48} className="text-[#D4D4D4]" />
      <h1 className="font-display text-3xl text-[#0A0A0A]">Your cart is empty</h1>
      <Link href="/men"><Button variant="primary">Start Shopping</Button></Link>
    </div>
  );

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="container-page py-6 md:py-10">
      <h1 className="font-display text-3xl md:text-4xl text-[#0A0A0A] mb-6 md:mb-8">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
        {/* Items */}
        <div className="flex-1 min-w-0">
          {cart.items.map((item) => <CartItemRow key={item._id} item={item} isCartBusy={isCartBusy || false} />)}
          <Link href="/men" className="inline-block mt-4 md:mt-6 text-xs md:text-sm font-sans text-[#525252] hover:text-[#0A0A0A] transition-colors">
            ← Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="border border-[#EFEFEF] rounded-lg p-4 md:p-5 flex flex-col gap-4 lg:sticky lg:top-24">
            <h2 className="font-sans text-base font-medium text-[#0A0A0A]">Order Summary</h2>
            <div className="flex flex-col gap-2 text-sm md:text-base">
              <div className="flex justify-between font-sans">
                <span className="text-[#525252]">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="flex justify-between font-sans text-[#27AE60]">
                  <span>Discount ({cart.couponCode})</span>
                  <span>- {formatPrice(cart.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-sans">
                <span className="text-[#525252]">Shipping</span>
                <span className="text-[#27AE60]">Free</span>
              </div>
              <div className="flex justify-between font-sans text-[#A3A3A3] italic text-xs md:text-sm">
                <span>Prepaid discount</span>
                <span>- ₹150 at checkout</span>
              </div>
              <div className="border-t border-[#EFEFEF] pt-2 flex justify-between font-medium font-sans">
                <span>Total</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
            </div>
            {cart.checkoutUrl ? (
              <Button
                variant="primary"
                fullWidth
                size="lg"
                loading={isGokwik && !isSdkReady}
                onClick={() => {
                  try {
                    trackBeginCheckout(cart);
                  } catch (err) {
                    console.error('[Analytics] Failed to track begin_checkout:', err);
                  }

                  if (isGokwik) {
                    const wentToGokwik = triggerGokwikCheckout(cart?._id || '');
                    if (!wentToGokwik) {
                      toast.error('Something went wrong. Please try again.');
                    }
                  } else {
                    window.location.href = cart.checkoutUrl || '';
                  }
                }}
              >
                {isGokwik ? 'Secure Checkout' : 'Secure Checkout via Shopify'}
              </Button>
            ) : (
              <Button variant="primary" fullWidth size="lg" disabled>
                Secure Checkout via Shopify
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
