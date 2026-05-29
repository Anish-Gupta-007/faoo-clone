// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cart, CartItem } from '@/types/cart.types';
import { shopifyService } from '@/services/shopifyService';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  fetchCart: () => Promise<void>;
  migrateCart: () => Promise<void>;
  addItem: (variantId: string, productId: string, quantity?: number, productObj?: any, variantObj?: any, size?: string) => Promise<void>;
  updateItem: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  reset: () => void;
}

const computeItemCount = (cart: Cart | null) =>
  cart ? cart.items.length : 0;

const mapShopifyCart = (sc: any): Cart => {
  if (!sc) return { _id: '', userId: '', items: [], couponCode: '', discountAmount: 0, totalAmount: 0 };
  const items = sc.lines?.map((line: any) => ({
    _id: line.id, // line item id
    variantId: line.merchandise?.id || '',
    productId: '', 
    quantity: line.quantity,
    price: parseFloat(line.merchandise?.price?.amount || '0'),
    product: {
      name: line.merchandise?.product?.title || line.merchandise?.title || 'Product',
      slug: '',
      primaryImage: line.merchandise?.image?.url || '',
      isFreeShipping: true,
    },
    variant: {
      color: '',
      size: line.merchandise?.title || '',
      fittingType: 'Regular',
      sku: line.merchandise?.sku || '',
      stockQuantity: line.merchandise?.quantityAvailable ?? 100,
    }
  })) || [];

  return {
    _id: sc.id, 
    userId: '',
    items,
    couponCode: sc.discountCodes && sc.discountCodes.length > 0 ? sc.discountCodes[0].code : '',
    discountAmount: 0,
    totalAmount: parseFloat(sc.cost?.totalAmount?.amount || '0'),
    checkoutUrl: sc.checkoutUrl,
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      itemCount: 0,

      fetchCart: async () => {
        const { cart } = get();
        if (!cart?._id || cart._id.startsWith('local')) return;

        set({ isLoading: true });
        try {
          const res = await shopifyService.getCart(cart._id);
          const mappedCart = mapShopifyCart(res.data);
          set({ cart: mappedCart, itemCount: computeItemCount(mappedCart), isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      migrateCart: async () => {
        // Handled purely by Shopify via checkout URL now
      },

      addItem: async (variantId, productId, quantity = 1, productObj?: any, variantObj?: any, size?: string) => {
        try {
          let cart = get().cart;
          let res;
          if (!cart || !cart._id || cart._id.startsWith('local')) {
            // Create a new cart
            res = await shopifyService.createCart([{ merchandiseId: variantId, quantity }]);
          } else {
            // Add to existing cart
            try {
              res = await shopifyService.addToCart(cart._id, [{ merchandiseId: variantId, quantity }]);
            } catch (err) {
              // If adding to cart fails (e.g. cart expired or invalid ID), create a new one
              res = await shopifyService.createCart([{ merchandiseId: variantId, quantity }]);
            }
          }
          const mappedCart = mapShopifyCart(res.data);
          set({ cart: mappedCart, itemCount: computeItemCount(mappedCart) });
        } catch (err: any) {
          throw new Error(err.message || 'Failed to add item');
        }
      },

      updateItem: async (variantId, quantity) => {
        try {
          let cart = get().cart;
          if (!cart || !cart._id || cart._id.startsWith('local')) return;

          // Find the lineId corresponding to this variantId
          const lineItem = cart.items.find((i: CartItem) => i.variantId === variantId);
          if (!lineItem) return;

          const res = await shopifyService.updateCartLine(cart._id, [{ id: lineItem._id, quantity }]);
          const mappedCart = mapShopifyCart(res.data);
          set({ cart: mappedCart, itemCount: computeItemCount(mappedCart) });
        } catch (err: any) {
          throw new Error(err.message || 'Failed to update item');
        }
      },

      removeItem: async (variantId) => {
        try {
          let cart = get().cart;
          if (!cart || !cart._id || cart._id.startsWith('local')) return;

          // Find the lineId corresponding to this variantId
          const lineItem = cart.items.find((i: CartItem) => i.variantId === variantId);
          if (!lineItem) return;

          const res = await shopifyService.removeFromCart(cart._id, [lineItem._id]);
          const mappedCart = mapShopifyCart(res.data);
          set({ cart: mappedCart, itemCount: computeItemCount(mappedCart) });
        } catch (err: any) {
          // silent
        }
      },

      clearCart: async () => {
        set({ cart: null, itemCount: 0 });
      },

      applyCoupon: async (code) => {
        try {
          let cart = get().cart;
          if (!cart || !cart._id || cart._id.startsWith('local')) return;
          const res = await shopifyService.applyDiscountCode(cart._id, code);
          const mappedCart = mapShopifyCart(res.data);
          set({ cart: mappedCart, itemCount: computeItemCount(mappedCart) });
        } catch (err: any) {
          throw new Error(err.message || 'Failed to apply coupon');
        }
      },

      removeCoupon: async () => {
        try {
          let cart = get().cart;
          if (!cart || !cart._id || cart._id.startsWith('local')) return;
          const res = await shopifyService.applyDiscountCode(cart._id, "");
          const mappedCart = mapShopifyCart(res.data);
          set({ cart: mappedCart, itemCount: computeItemCount(mappedCart) });
        } catch (err: any) {
          throw new Error(err.message || 'Failed to remove coupon');
        }
      },

      reset: () => set({ cart: null, itemCount: 0, isLoading: false }),
    }),
    {
      name: 'faoo-cart-storage',
      partialize: (state) => ({ cart: state.cart, itemCount: state.itemCount }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        itemCount: persistedState.cart ? computeItemCount(persistedState.cart) : 0,
      }),
    }
  )
);
