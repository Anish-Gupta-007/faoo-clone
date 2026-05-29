'use client';
// src/components/layout/CartDrawer.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { QuantityCounter } from '@/components/shared/QuantityCounter';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { CartItem } from '@/types/cart.types';
import { formatPrice } from '@/utils/formatPrice';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUIStore();
  const { cart, itemCount, removeItem, updateItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <Drawer isOpen={isCartOpen} onClose={closeCart} title={`Your Cart (${itemCount})`} side="right" width="min(90vw, 420px)">
      {!cart || cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 px-6">
          <ShoppingBag size={40} className="text-[#D4D4D4]" />
          <p className="text-sm font-sans text-[#A3A3A3]">Your cart is empty</p>
          <Button variant="primary" size="sm" onClick={closeCart}>
            <Link href="/men">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Premium Banner */}
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="px-6 pt-4"
          >
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-[#F9F8F6] to-[#F2EFEA] border border-[#EBE8E3] py-3 flex items-center justify-center">
              <span className="text-[9px] font-sans font-bold tracking-[0.25em] uppercase text-[#4A4A4A]">
                10% OFF on Your First Order
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, ease: "linear", repeat: Infinity, repeatDelay: 2 }}
              />
            </div>
          </motion.div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
            {cart.items.map((item) => (
              <CartDrawerItem key={item._id} item={item} onRemove={removeItem} onUpdate={updateItem} />
            ))}
          </div>
          {/* Footer */}
          <div className="border-t border-[#EFEFEF] px-6 py-5 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm font-sans">
              <span className="text-[#525252]">Subtotal</span>
              <span className="font-medium text-[#0A0A0A]">{formatPrice(cart.totalAmount)}</span>
            </div>
            {cart.discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm font-sans text-[#27AE60]">
                <span>Discount ({cart.couponCode})</span>
                <span>- {formatPrice(cart.discountAmount)}</span>
              </div>
            )}
            {cart.checkoutUrl ? (
              <a href={cart.checkoutUrl} onClick={closeCart} className="w-full">
                <Button variant="primary" fullWidth size="lg">Checkout</Button>
              </a>
            ) : (
              <Button variant="primary" fullWidth size="lg" disabled>Checkout</Button>
            )}
            <Link href="/cart" onClick={closeCart} className="text-center text-xs font-sans text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors">
              View Full Cart
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
}

function CartDrawerItem({
  item,
  onRemove,
  onUpdate,
}: {
  item: CartItem;
  onRemove: (variantId: string) => Promise<void>;
  onUpdate: (variantId: string, qty: number) => Promise<void>;
}) {
  const [qty, setQty] = useState(item.quantity);
  const debouncedQty = useDebounce(qty, 300);

  useEffect(() => {
    if (debouncedQty !== item.quantity) {
      onUpdate(item.variantId, debouncedQty);
    }
  }, [debouncedQty]);

  return (
    <div className="flex gap-3">
      <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-[#F7F7F7]">
        {item.product.primaryImage && (
          <img src={item.product.primaryImage} alt={item.product.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-[#0A0A0A] truncate">{item.product.name}</p>
        <p className="text-xs text-[#A3A3A3] font-sans mt-0.5">
          {item.variant.color} · {item.variant.size} · {item.variant.fittingType}
        </p>
        <p className="text-sm font-medium font-sans text-[#0A0A0A] mt-1">{formatPrice(item.price)}</p>
        <div className="flex items-center justify-between mt-2">
          <QuantityCounter value={qty} onChange={setQty} min={1} max={item.variant.stockQuantity} />
          <button onClick={() => onRemove(item.variantId)} className="text-xs text-[#A3A3A3] hover:text-[#C0392B] transition-colors flex items-center gap-1">
            <Trash2 size={12} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
