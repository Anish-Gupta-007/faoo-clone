'use client';
// src/components/layout/Footer.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Linkedin } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { cn } from '@/lib/cn';
import { Coin3D } from '@/components/layout/Coin3D';

const infoLinks = [
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Careers', href: '/careers' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/faoo.official', icon: Instagram, color: '#E4405F' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/faoo/', icon: Linkedin, color: '#0077B5' },
  { label: 'WhatsApp', href: 'https://wa.me/918510099666', icon: null, color: '#25D366' },
];

// ─── Payment method SVG icons — clean, professional, on-brand ─────────────────

/** VISA — geometric letterforms, gold underline */
function VisaSVG() {
  return (
    <svg viewBox="0 0 80 26" xmlns="http://www.w3.org/2000/svg" className="h-[17px] w-auto">
      {/* V */}
      <polygon points="0,1 8,1 14,19 20,1 28,1 19,25 9,25" fill="white" opacity="0.88" />
      {/* I */}
      <rect x="30" y="1" width="6" height="24" fill="white" opacity="0.88" />
      {/* S */}
      <path d="M40,1 h16c3,0 5,2 5,4s-2,4-5,4h-10c-1.5,0-2.5,1-2.5,2.5s1,2.5,2.5,2.5h11v4h-11c-4,0-7-3-7-7s3-7,7-7h10c.8,0,1.5-.6,1.5-1.5S57.8,2,57,2h-17Z" fill="white" opacity="0.88" />
      {/* A */}
      <path d="M64,1 l12,24h-7l-2-5h-9l-2,5h-7L61,1h3Z M65,16l-2.5-7.5L60,16Z" fill="white" opacity="0.88" />
      {/* Gold accent line */}
      <rect x="0" y="24.5" width="80" height="1.5" rx="0.75" fill="#F7A600" opacity="0.45" />
    </svg>
  );
}

/** Mastercard — iconic two-circle lockup */
function MastercardSVG() {
  return (
    <svg viewBox="0 0 54 34" xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-auto">
      <circle cx="19" cy="17" r="15" fill="#EB001B" opacity="0.9" />
      <circle cx="35" cy="17" r="15" fill="#F79E1B" opacity="0.9" />
      {/* Overlap zone — FF5F00 blend */}
      <path d="M27 4.5a15 15 0 0 1 0 25 15 15 0 0 1 0-25Z" fill="#FF5F00" opacity="0.9" />
    </svg>
  );
}

/** UPI — proper diagonal-arrow mark (orange up-left + teal down-right) + wordmark */
function UpiSVG() {
  return (
    <svg viewBox="0 0 70 28" xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-auto">
      {/* Orange arrow — slanted up-left chevron */}
      <path
        d="M2,24 L10,4 L15,4 L11,14 L20,14 L12,28 L7,28 L10.5,20 Z"
        fill="#F47920" opacity="0.95"
      />
      {/* Teal arrow — slanted down-right chevron */}
      <path
        d="M17,0 L22,0 L14,12 L23,12 L15,28 L20,28 L28,8 L23,8 Z"
        fill="#009CDE" opacity="0.95"
      />
      {/* UPI wordmark */}
      <text
        x="37" y="21"
        fontFamily="Arial, sans-serif" fontWeight="900" fontSize="15"
        fill="white" opacity="0.88" letterSpacing="1.5"
      >UPI</text>
    </svg>
  );
}

/** RuPay — bold wordmark + red base stripe */
function RupayLogoSVG() {
  return (
    <svg viewBox="0 0 68 26" xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-auto">
      {/* "R" mark simplified */}
      <path d="M2,2 L2,24 L8,24 L8,16 L14,24 L21,24 L13,14 c4-1 6-4 6-8 0-5-4-4-4-4 Z M8,6 h4c2,0 3,1 3,3s-1,3-3,3 H8 Z" fill="#E63329" opacity="0.9" />
      {/* Wordmark */}
      <text x="25" y="19" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="12.5" fill="white" opacity="0.88" letterSpacing="0.4">RuPay</text>
      {/* Bottom stripe */}
      <rect x="25" y="22" width="42" height="1.5" rx="0.75" fill="#E63329" opacity="0.5" />
    </svg>
  );
}

/** Razorpay — blue lightning-bolt mark + lowercase wordmark */
function RazorpaySVG() {
  return (
    <svg viewBox="0 0 82 26" xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-auto">
      {/* Lightning bolt */}
      <polygon points="5,2 17,2 11,13 19,13 5,26 9,17 1,17" fill="#3395FF" opacity="0.95" />
      {/* wordmark */}
      <text x="25" y="19" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11.5" fill="white" opacity="0.82" letterSpacing="0.2">razorpay</text>
    </svg>
  );
}

/** Net Banking — columned bank building */
function NetBankingSVG() {
  return (
    <svg viewBox="0 0 44 28" xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-auto">
      {/* Pediment / roof */}
      <polygon points="22,1 1,9 43,9" fill="white" opacity="0.75" />
      {/* 4 columns */}
      <rect x="3" y="11" width="5" height="11" rx="1" fill="white" opacity="0.7" />
      <rect x="11" y="11" width="5" height="11" rx="1" fill="white" opacity="0.7" />
      <rect x="19" y="11" width="5" height="11" rx="1" fill="white" opacity="0.7" />
      <rect x="27" y="11" width="5" height="11" rx="1" fill="white" opacity="0.7" />
      <rect x="35" y="11" width="5" height="11" rx="1" fill="white" opacity="0.7" />
      {/* Base */}
      <rect x="0" y="23" width="44" height="3" rx="1.5" fill="white" opacity="0.7" />
    </svg>
  );
}

/** GPay — Google G logo + Pay wordmark */
function GPaySVG() {
  return (
    <svg viewBox="0 0 62 26" xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-auto">
      {/* Google "G" */}
      <g transform="translate(8, -4.2) scale(1.35)">
        <path d="M12.1 10.8h-5.8v2.7h3.3c-.2 1.3-1.3 2.5-3.3 2.5-2 0-3.7-1.7-3.7-3.7s1.7-3.7 3.7-3.7c1 0 1.8.4 2.5 1l2-2C9.7 6.4 8.2 5.8 6.3 5.8 2.8 5.8 0 8.6 0 12.1s2.8 6.3 6.3 6.3c3.6 0 6-2.5 6-6.1 0-.6-.1-1-.2-1.5z" fill="#4285F4"/>
        <path d="M6.3 18.4c1.6 0 3-.6 4-1.5l-2.4-1.9c-.5.4-1.1.6-1.6.6-1.7 0-3.1-1.1-3.6-2.6H.2v2C1.6 17 3.8 18.4 6.3 18.4z" fill="#34A853"/>
        <path d="M2.7 13c-.1-.4-.2-.9-.2-1.4s.1-1 .2-1.4v-2H.2C0 9.2 0 10.4 0 11.6s.2 2.4.6 3.5l2.1-2.1z" fill="#FBBC05"/>
        <path d="M6.3 8.3c1 0 1.8.3 2.5 1l1.8-1.8C9.4 6.4 8 5.8 6.3 5.8 3.8 5.8 1.6 7.2.2 9.2l2.5 2c.5-1.6 1.9-2.9 3.6-2.9z" fill="#EA4335"/>
      </g>
      {/* "Pay" wordmark */}
      <text x="28" y="17.5" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="13" fill="white" opacity="0.88">Pay</text>
    </svg>
  );
}

const PAYMENT_METHODS = [
  { id: 'visa', label: 'Visa', Icon: VisaSVG },
  { id: 'mastercard', label: 'Mastercard', Icon: MastercardSVG },
  { id: 'upi', label: 'UPI', Icon: UpiSVG },
  { id: 'gpay', label: 'Google Pay', Icon: GPaySVG },
  { id: 'rupay', label: 'RuPay', Icon: RupayLogoSVG },
  { id: 'razorpay', label: 'Razorpay', Icon: RazorpaySVG },
  { id: 'netbanking', label: 'Net Banking', Icon: NetBankingSVG },
];

function PaymentSection() {
  return (
    <div className="py-8 border-b border-white/[0.06]">
      <p className="text-[8px] font-sans font-semibold tracking-[0.35em] uppercase text-white/25 mb-4">
        We Accept
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        {PAYMENT_METHODS.map(({ id, label, Icon }) => (
          <div
            key={id}
            title={label}
            className="h-10 px-4 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:border-white/[0.18] hover:bg-white/[0.09] transition-all duration-200 cursor-default"
          >
            <Icon />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  const pathname = usePathname();
  const { categories: rawCategories } = useCategoryStore();

  const CATEGORY_ORDER = ['men', 'women', 'accessories'];
  const getCatOrder = (cat: { slug?: string; name?: string }) => {
    const key = (cat.slug ?? cat.name ?? '').toLowerCase();
    const idx = CATEGORY_ORDER.findIndex((o) => key.startsWith(o));
    return idx === -1 ? 99 : idx;
  };

  const categories = [...rawCategories].sort((a, b) => getCatOrder(a) - getCatOrder(b));

  const shopLinks = categories.map((cat) => ({
    label:
      cat.name.toLowerCase().startsWith('men') && !cat.name.toLowerCase().startsWith('women')
        ? 'Mens'
        : cat.name.toLowerCase().startsWith('women')
          ? 'Womens'
          : cat.name.toLowerCase().startsWith('accessories')
            ? 'Accessories'
            : cat.name,
    href: `/${cat.slug}`,
  }));

  const isHome = pathname === '/';

  return (
    <footer
      className={cn('bg-[#0A0A0A] text-white', isHome ? 'mt-0' : 'mt-20')}
      style={{ borderTop: '1px solid rgba(139,0,38,0.25)' }}
    >
      {/* Premium top rule */}
      <div
        className="w-full h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(139,0,38,0.4) 30%, rgba(201,168,76,0.25) 70%, transparent)',
        }}
      />

      <div className="container-page py-16">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="logo-text font-display text-3xl text-white block mb-4 hover:opacity-70 transition-opacity duration-300"
            >
              Faoo
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs font-light">
              You are fashion.
            </p>
            <p className="text-xs font-sans font-bold tracking-[0.25em] uppercase text-[#c9a84c]/60 mt-1">
              #faooforall
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ label, href, icon: Icon, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={cn(
                    'w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden',
                    label === 'Instagram'
                      ? 'bg-black border-white/10 hover:border-white/20'
                      : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                  )}
                  style={label === 'LinkedIn' ? { color } : label === 'WhatsApp' ? { color } : {}}
                >
                  {label === 'Instagram' ? (
                    <img src="/insta.webp" alt="Instagram" className="w-[80%] h-[80%] object-cover" />
                  ) : label === 'WhatsApp' ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                  ) : Icon ? (
                    <Icon size={16} fill="currentColor" strokeWidth={1.5} />
                  ) : null}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[9px] font-sans font-semibold tracking-[0.35em] uppercase text-white/30 mb-5">
              Shop
            </h3>
            <ul className="flex flex-col gap-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const slug = link.href.substring(1);
                        sessionStorage.removeItem(`faoo-filters-${slug}`);
                      }
                    }}
                    className="text-lg font-display font-light text-white/55 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[9px] font-sans font-semibold tracking-[0.35em] uppercase text-white/30 mb-5">
              Info
            </h3>
            <ul className="flex flex-col gap-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-white/55 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[9px] font-sans font-semibold tracking-[0.35em] uppercase text-white/30 mb-5">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:hello@faooofficial.com"
                  className="text-sm font-sans text-white/55 hover:text-white transition-colors duration-300"
                >
                  hello@faooofficial.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918510099666"
                  className="text-sm font-sans text-white/55 hover:text-white transition-colors duration-300"
                >
                  +91 8510099666
                </a>
              </li>
            </ul>
          </div>

          {/* 3-D Coin */}
          <div className="hidden md:flex items-center justify-center">
            <Coin3D />
          </div>
        </div>

        {/* Payment Methods */}
        <PaymentSection />

        {/* Bottom */}
        <div className="pt-8 text-center md:text-left">
          <p className="text-[10px] font-sans text-white/20 tracking-[0.12em] uppercase">
            © {new Date().getFullYear()} Faoo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
