// src/app/layout.tsx
import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { SearchDrawer } from '@/components/layout/SearchDrawer';
import { FirstUserPopup } from '@/components/popup/FirstUserPopup';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Faoo — Premium Minimalist Clothing',
    template: '%s | Faoo',
  },
  description:
    'Faoo is a premium D2C clothing brand offering refined minimalist essentials for men and women. Shop T-Shirts, Hoodies, Tanks, and Accessories.',
  keywords: ['faoo', 'premium clothing', 'minimalist fashion', 'D2C brand India'],
  icons: {
    icon: '/fav.png',
    shortcut: '/favicon.ico',
    apple: '/fav.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.faoo.in',
    siteName: 'Faoo',
    title: 'Faoo — Fashion Apparel for Men and Women',
    description: 'Premium D2C clothing. Crafted for those who let the fabric speak.',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.faoo.in'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-white text-[#0A0A0A] antialiased">
        <Providers>
          <Navbar />
          <main style={{ paddingTop: 'var(--navbar-height)' }}>{children}</main>
          <Footer />
          <CartDrawer />
          <MobileMenu />
          <SearchDrawer />
          <FirstUserPopup />
        </Providers>
      </body>
    </html>
  );
}
