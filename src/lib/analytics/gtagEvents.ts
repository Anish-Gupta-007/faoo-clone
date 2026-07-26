/**
 * Utility for firing GA4 Ecommerce events safely on the client side.
 */

// Safe wrapper for window.gtag
const fireGtag = (eventName: string, params: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, params);
    }
  } catch (error) {
    console.error(`[Analytics] Error firing ${eventName} event:`, error);
  }
};

export function trackViewItem(product: any) {
  if (!product) return;
  
  const price = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);

  fireGtag('view_item', {
    currency: 'INR',
    value: price,
    items: [
      {
        item_id: product._id,
        item_name: product.name,
        item_category: product.category?.name || '',
        price: price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(payload: { product: any; variant: any; quantity: number }) {
  const { product, variant, quantity } = payload;
  if (!product) return;

  const price = variant?.price ?? product.price ?? 0;
  const parsedPrice = typeof price === 'string' ? parseFloat(price) : price;

  fireGtag('add_to_cart', {
    currency: 'INR',
    value: parsedPrice * quantity,
    items: [
      {
        item_id: variant?._id || product._id,
        item_name: product.name,
        item_category: product.category?.name || '',
        item_variant: variant?.color || '',
        item_size: variant?.size || '',
        price: parsedPrice,
        quantity: quantity,
      },
    ],
  });
}

export function trackBeginCheckout(cart: any) {
  if (!cart || !cart.items || !cart.items.length) return;

  const value = typeof cart.totalAmount === 'string' ? parseFloat(cart.totalAmount) : (cart.totalAmount || 0);

  const items = cart.items.map((item: any, index: number) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
    return {
      item_id: item.variantId || item._id,
      item_name: item.product?.name || 'Product',
      item_category: item.product?.categoryName || '',
      item_variant: item.variant?.color || '',
      item_size: item.variant?.size || '',
      price: price,
      quantity: item.quantity,
      index: index,
    };
  });

  fireGtag('begin_checkout', {
    currency: 'INR',
    value: value,
    items: items,
  });
}

export function trackPurchase(order: any) {
  if (!order) return;

  const value = typeof order.totalPrice === 'string' ? parseFloat(order.totalPrice) : (order.totalPrice || 0);

  const items = (order.lineItems || []).map((item: any, index: number) => {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
    return {
      item_id: item.variantId || item.id,
      item_name: item.title,
      price: price,
      quantity: item.quantity,
      index: index,
    };
  });

  fireGtag('purchase', {
    transaction_id: order.id || order.orderNumber || String(Date.now()),
    currency: 'INR',
    value: value,
    items: items,
  });
}
