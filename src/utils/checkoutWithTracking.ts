// src/utils/checkoutWithTracking.ts
import { shopifyService } from '@/services/shopifyService';

/**
 * Reads GA4, Facebook Pixel Browser ID (_fbp), and Facebook Click ID (_fbc)
 * cookies from the browser, attaches them as Shopify cart attributes via
 * cartAttributesUpdate, then navigates to the Shopify checkoutUrl.
 *
 * The Storefront API call is best-effort — if it fails (network error, expired
 * cart, etc.) the redirect still happens so checkout is never blocked.
 */

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

/**
 * Extracts the GA4 client_id from the _ga cookie.
 * _ga format: GA1.1.XXXXXXXXXX.XXXXXXXXXX
 * client_id  = "XXXXXXXXXX.XXXXXXXXXX" (last two dot-separated segments)
 */
function extractGaClientId(gaCookie: string): string | null {
  const parts = gaCookie.split('.');
  if (parts.length >= 4) {
    return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  }
  return null;
}

export interface CheckoutTrackingItem {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
  currency?: string;
}

export async function checkoutWithTracking(
  cartId: string,
  checkoutUrl: string,
  cartItems?: CheckoutTrackingItem[],
  cartTotal?: number
): Promise<void> {
  // --- GA4: begin_checkout  |  Meta Pixel: InitiateCheckout ---
  try {
    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'begin_checkout', {
          currency: 'INR',
          value: cartTotal ?? 0,
          items: cartItems ?? [],
        });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          content_ids: (cartItems ?? []).map((i) => i.item_id),
          content_type: 'product',
          value: cartTotal ?? 0,
          currency: 'INR',
          num_items: (cartItems ?? []).reduce((s, i) => s + i.quantity, 0),
        });
      }
    }
  } catch {
    // best-effort
  }

  try {
    if (cartId && !cartId.startsWith('local')) {
      const attributes: { key: string; value: string }[] = [];

      // GA4 client_id
      const gaCookie = getCookie('_ga');
      if (gaCookie) {
        const clientId = extractGaClientId(gaCookie);
        if (clientId) attributes.push({ key: 'ga_client_id', value: clientId });
      }

      // Facebook Pixel Browser ID
      const fbp = getCookie('_fbp');
      if (fbp) attributes.push({ key: 'fbp', value: fbp });

      // Facebook Click ID
      const fbc = getCookie('_fbc');
      if (fbc) attributes.push({ key: 'fbc', value: fbc });

      if (attributes.length > 0) {
        await shopifyService.updateCartAttributes(cartId, attributes);
      }
    }
  } catch (err) {
    // Tracking attachment is best-effort — never block checkout
    console.warn('[checkoutWithTracking] Failed to attach tracking attributes:', err);
  }

  window.location.href = checkoutUrl;
}
