'use client';
// src/components/layout/Footer.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Instagram, Facebook, Linkedin } from 'lucide-react';
import { useCategoryStore } from '@/store/categoryStore';
import { cn } from '@/lib/cn';
import { Bag3D } from '@/components/layout/Bag3D';


const infoLinks = [
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Careers', href: '/careers' },
];




const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/faoo.official', icon: Instagram, color: '#E4405F' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/faoo/', icon: Linkedin, color: '#0077B5' },
  { label: 'Facebook', href: 'https://facebook.com/faoo', icon: Facebook, color: '#1877F2' },
];

export function Footer() {
  const pathname = usePathname();
  const { categories: rawCategories } = useCategoryStore();
  
  const CATEGORY_ORDER = ['accessories', 'men', 'women'];
  const getCatOrder = (cat: { slug?: string; name?: string }) => {
    const key = (cat.slug ?? cat.name ?? '').toLowerCase();
    const idx = CATEGORY_ORDER.findIndex((o) => key.startsWith(o));
    return idx === -1 ? 99 : idx;
  };

  const categories = [...rawCategories].sort((a, b) => getCatOrder(a) - getCatOrder(b));

  const shopLinks = categories.map((cat) => ({ 
    label: cat.name.toLowerCase().startsWith('men') ? 'Mens' : 
           cat.name.toLowerCase().startsWith('women') ? 'Women' :
           cat.name.toLowerCase().startsWith('accessories') ? 'Accessories' :
           cat.name, 
    href: `/${cat.slug}` 
  }));

  const isHome = pathname === '/';

  return (
    <footer className={cn("bg-[#0A0A0A] text-white", isHome ? "mt-0" : "mt-20")} style={{ borderTop: '1px solid rgba(139,0,38,0.25)' }}>
      {/* Premium top rule */}
      <div className="w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,0,38,0.4) 30%, rgba(201,168,76,0.25) 70%, transparent)' }} />

      <div className="container-page py-16">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="logo-text font-display text-3xl text-white block mb-4 hover:opacity-70 transition-opacity duration-300">
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
                    "w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-110 overflow-hidden",
                    label === 'Instagram' ? "bg-black border-white/10 hover:border-white/20" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                  )}
                  style={label !== 'Instagram' ? { color: color } : {}}
                >
                  {label === 'Instagram' ? (
                    <img src="/insta.webp" alt="Instagram" className="w-[80%] h-[80%] object-cover" />
                  ) : (
                    <Icon size={16} fill={label === 'WhatsApp' ? 'none' : 'currentColor'} strokeWidth={1.5} />
                  )}
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
                  href="mailto:hello@faoo.in"
                  className="text-sm font-sans text-white/55 hover:text-white transition-colors duration-300"
                >
                  hello@faoo.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+918945678945"
                  className="text-sm font-sans text-white/55 hover:text-white transition-colors duration-300"
                >
                  +91 8945678945
                </a>
              </li>
            </ul>
          </div>

          {/* 3-D Bag — 5th column, beside Contact */}
          <div className="hidden md:flex items-center justify-center">
            <Bag3D />
          </div>
        </div>

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
