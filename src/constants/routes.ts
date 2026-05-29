// src/constants/routes.ts

export const ROUTES = {
  HOME: '/',
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  // Shop
  MEN: '/men',
  WOMEN: '/women',
  ACCESSORIES: '/accessories',
  PRODUCT: (slug: string) => `/products/${slug}`,
  SEARCH: '/search',
  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/checkout/success',
  // Account
  ACCOUNT: '/account',
  ORDERS: '/account/orders',
  ORDER_DETAIL: (orderId: string) => `/account/orders/${orderId}`,
  ADDRESSES: '/account/addresses',
  WISHLIST: '/account/wishlist',
  // Static
  ABOUT: '/about',
  FAQ: '/faq',
  CAREERS: '/careers',
  RETURNS: '/returns',
} as const;

export const NAV_LINKS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Men',
    href: '/men',
    subcategories: [
      { label: 'T-Shirts', href: '/men/t-shirts' },
      { label: 'Hoodies', href: '/men/hoodies' },
      { label: 'Tanks', href: '/men/tanks' },
      { label: 'Joggers', href: '/men/joggers' },
      { label: 'Shorts', href: '/men/shorts' },
    ],
  },
  {
    label: 'Women',
    href: '/women',
    subcategories: [
      { label: 'Tops', href: '/women/tops' },
      { label: 'Hoodies', href: '/women/hoodies' },
      { label: 'Leggings', href: '/women/leggings' },
      { label: 'Dresses', href: '/women/dresses' },
    ],
  },
  {
    label: 'Accessories',
    href: '/accessories',
    subcategories: [
      { label: 'Caps', href: '/accessories/caps' },
      { label: 'Bags', href: '/accessories/bags' },
      { label: 'Bottles', href: '/accessories/bottles' },
    ],
  },
];

export const QUICK_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Return & Exchange', href: '/returns' },
  { label: 'Careers', href: '/careers' },
];

export const FOOTER_SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/faoo.official', icon: 'instagram' },
  { label: 'WhatsApp', href: 'https://wa.me/919999999999', icon: 'message-circle' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/faoo/', icon: 'linkedin' },
  { label: 'Facebook', href: 'https://facebook.com/faoo', icon: 'facebook' },
];
