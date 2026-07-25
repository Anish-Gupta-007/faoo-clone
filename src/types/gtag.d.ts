// src/types/gtag.d.ts
// Minimal type augmentation for the Google Analytics gtag global function
// and the Meta Pixel fbq global function.
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
    fbq: (
      command: 'init' | 'track' | 'trackCustom',
      eventNameOrPixelId: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq: unknown;
  }
}

export {};
