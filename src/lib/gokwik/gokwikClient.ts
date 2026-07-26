import { useState, useEffect } from 'react';

// TODO: Integrate GoKwik Health Service checks here once the Health Service 
// Document specifics are provided (endpoint availability / response-time 
// validation before allowing checkout). Not yet implemented — do not remove 
// this comment until that doc is reviewed.

export function isGokwikEnabled(): boolean {
  return process.env.NEXT_PUBLIC_GOKWIK_ENABLED === 'true';
}

export function isGokwikSdkReady(): boolean {
  return typeof window !== 'undefined' && !!window.gokwikSdk;
}

/**
 * React hook to check and dynamically react to GoKwik SDK loading status.
 * Starts checking on mount and polls for the SDK. Safely times out after
 * 5 seconds to prevent users from being permanently locked in a loading state.
 */
export function useGokwikSdk(): boolean {
  const [isReady, setIsReady] = useState(false);
  const enabled = isGokwikEnabled();

  useEffect(() => {
    if (!enabled) return;
    if (isGokwikSdkReady()) {
      setIsReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (isGokwikSdkReady()) {
        setIsReady(true);
        clearInterval(interval);
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      // Fallback: mark as ready so the button becomes clickable.
      // If the SDK is actually missing when clicked, triggerGokwikCheckout
      // will fail and fallback to Shopify checkout.
      setIsReady(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [enabled]);

  return isReady;
}

export function triggerGokwikCheckout(cartId: string): boolean {
  if (!isGokwikEnabled() || !isGokwikSdkReady()) {
    return false;
  }

  try {
    if (!window.merchantInfo) {
      window.merchantInfo = {
        mid: process.env.NEXT_PUBLIC_GOKWIK_MID || '',
        environment: process.env.NEXT_PUBLIC_GOKWIK_ENVIRONMENT || 'sandbox',
        type: 'merchantInfo',
        storeId: process.env.NEXT_PUBLIC_GOKWIK_STORE_ID || '',
        fbPixel: [],
      };
    }

    window.merchantInfo.cart = { id: cartId };

    if (typeof window.triggerGokwikCustomCheckout === 'function') {
      window.triggerGokwikCustomCheckout();
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("GoKwik checkout failed:", err);
    return false;
  }
}
