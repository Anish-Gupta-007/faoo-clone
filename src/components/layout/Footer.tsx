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

// ─── Payment method logos ───────────────────────────────────────────────────

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

const PAYMENT_METHODS = [
  { id: 'visa', label: 'Visa', src: '/footer_logo/visa.png', heightClass: 'h-[40px]' },
  { id: 'mastercard', label: 'Mastercard', src: '/footer_logo/mastercard.png', heightClass: 'h-[24px]' },
  { id: 'upi', label: 'UPI', src: '/footer_logo/upi.png', heightClass: 'h-[24px]' },
  { id: 'gpay', label: 'Google Pay', src: '/footer_logo/gpay.png', heightClass: 'h-[24px]' },
  { id: 'rupay', label: 'RuPay', src: '/footer_logo/rupay.png', heightClass: 'h-[40px]' },
  { id: 'razorpay', label: 'Razorpay', src: '/footer_logo/razorpay.png', heightClass: 'h-[40px]' },
  { id: 'netbanking', label: 'Net Banking', Icon: NetBankingSVG },
];

function PaymentSection() {
  return (
    <div className="py-8 border-b border-white/[0.06]">
      <p className="text-[8px] font-sans font-semibold tracking-[0.35em] uppercase text-white/25 mb-4">
        We Accept
      </p>
      <div className="flex flex-wrap items-center gap-2.5">
        {PAYMENT_METHODS.map(({ id, label, src, heightClass, Icon }) => (
          <div
            key={id}
            title={label}
            className="w-[80px] h-[40px] rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center hover:border-white/[0.18] hover:bg-white/[0.09] transition-all duration-200 cursor-default"
          >
            {Icon ? (
              <Icon />
            ) : (
              <img src={src} alt={label} className={cn(heightClass, "max-w-[150%] w-auto object-contain shrink-0")} />
            )}
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
