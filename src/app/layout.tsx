// src/app/layout.tsx
import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { SearchDrawer } from '@/components/layout/SearchDrawer';
import { FirstUserPopup } from '@/components/popup/FirstUserPopup';
import CanonicalLink from '@/components/CanonicalLink';
import { GaPageTracker } from '@/components/GaPageTracker';

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
  verification: {
    google: '4JO6eBQqEUItrqUc3EVVMCyHpvYp27YAF9IDsdgUhPE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <meta name="facebook-domain-verification" content="vpnogxfkeldix78wu83am56ec8vaol" />
        <CanonicalLink />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
        />
        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="font-sans bg-white text-[#0A0A0A] antialiased">
        <Providers>
          <GaPageTracker />
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
