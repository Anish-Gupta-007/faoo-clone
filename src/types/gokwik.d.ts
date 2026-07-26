export {};

declare global {
  interface Window {
    gokwikSdk?: any;
    merchantInfo?: {
      mid: string;
      environment: string;
      type: string;
      storeId: string;
      fbPixel: any[];
      cart?: {
        id: string;
      };
    };
    triggerGokwikCustomCheckout?: () => void;
  }
}
