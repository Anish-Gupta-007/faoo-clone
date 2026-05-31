'use client';
// src/components/layout/Navbar.tsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, LogOut, Package, MapPin, ChevronDown, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { useCategoryStore } from '@/store/categoryStore';
import { cn } from '@/lib/cn';
import { shopifyService, ShopifyAnnouncement } from '@/services/shopifyService';

const ANNOUNCEMENTS = [
  { text: "10% OFF your first order", code: "FIRST10" },
  { text: "Free shipping on selected orders", code: null },
  { text: "Limited Edition drops — live now", code: null },
  { text: "Exclusive collections. Only for a few.", code: null },
];

function AnnouncementBar() {
  const [apiAnnouncements, setApiAnnouncements] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    shopifyService.getAnnouncements()
      .then(res => {
        if (res.success && res.data.length > 0) {
          setApiAnnouncements(res.data.map((a: ShopifyAnnouncement) => a.text));
        }
      })
      .catch(() => {});
  }, []);

  const items = apiAnnouncements.length > 0
    ? apiAnnouncements.map(t => ({ text: t, code: null }))
    : ANNOUNCEMENTS;

  // Reset index to 0 when items size changes to avoid out-of-bounds indices
  useEffect(() => {
    setCurrent(0);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % items.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  const item = items[current] || items[0] || { text: "", code: null };

  return (
    <div
      className="w-full overflow-hidden h-[36px] flex items-center shrink-0"
      style={{
        background: 'linear-gradient(90deg, #0C0C0C 0%, #1C1A16 50%, #0C0C0C 100%)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}
    >
      <div className="flex items-center justify-center w-full gap-4">
        {/* Left decorative diamond */}
        <span className="hidden sm:block text-white/20 text-[8px] select-none">◆</span>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-center gap-3"
          >
            <span className="text-[10px] font-sans font-medium tracking-[0.18em] uppercase text-white/75">
              {item.text}
            </span>
            {item.code && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[#c9a84c]/60 bg-[#c9a84c]/10 text-[#c9a84c] text-[9px] font-bold tracking-[0.15em] uppercase leading-none">
                {item.code}
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right decorative diamond */}
        <span className="hidden sm:block text-white/20 text-[8px] select-none">◆</span>

        {/* Dot indicators */}
        <div className="hidden sm:flex items-center gap-1 absolute right-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setVisible(false); setTimeout(() => { setCurrent(i); setVisible(true); }, 400); }}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${i === current ? 'bg-white/70 w-3' : 'bg-white/20'}`}
              aria-label={`Announcement ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const { wishlistIds } = useWishlistStore();
  const { openCart, openMobileMenu, openSearch } = useUIStore();
  const { categories: rawCategories, fetchCategories } = useCategoryStore();

  const CATEGORY_ORDER = ['men', 'women', 'accessories'];
  const getCatOrder = (cat: { slug?: string; name?: string }) => {
    const nameStr = (cat.name || '').toLowerCase();
    const slugStr = (cat.slug || '').toLowerCase();
    const idx = CATEGORY_ORDER.findIndex((o) => nameStr.startsWith(o) || slugStr.startsWith(o));
    return idx === -1 ? 99 : idx;
  };
  const categories = [...rawCategories].sort((a, b) => getCatOrder(a) - getCatOrder(b));

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    router.push('/');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 transition-all duration-500 ease-out border-b flex flex-col',
        scrolled
          ? 'bg-[#6A001A]/90 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
          : 'bg-[#8b0026] border-transparent'
      )}
      style={{ zIndex: 'var(--z-sticky)', height: 'var(--navbar-height)' }}
    >
      <AnnouncementBar />
      <div className="container-page flex-1 flex items-center justify-between px-4 md:px-8 w-full">

        {/* Mobile: hamburger */}
        <div className="flex-1 lg:hidden">
          <button
            onClick={openMobileMenu}
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors text-white"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Desktop Nav (Left) */}
        <nav className="hidden lg:flex items-center gap-10 flex-1" aria-label="Main navigation">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="relative py-6" // Extended hit area for hover
              onMouseEnter={() => handleDropdownEnter(cat.name)}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href={`/${cat.slug}`}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    sessionStorage.removeItem(`faoo-filters-${cat.slug}`);
                  }
                }}
                className={cn(
                  'flex items-center gap-1.5 text-[11px] font-sans font-bold tracking-[0.2em] uppercase',
                  'text-white/80 hover:text-white transition-colors duration-300'
                )}
              >
                {cat.name.toLowerCase().startsWith('men') ? 'Mens' :
                  cat.name.toLowerCase().startsWith('women') ? 'Womens' :
                    cat.name.toLowerCase().startsWith('accessories') ? 'Accessories' :
                      cat.name}
                <ChevronDown
                  size={12}
                  strokeWidth={2}
                  className={cn(
                    'transition-transform duration-300 ease-out',
                    activeDropdown === cat.name && 'rotate-180 text-white'
                  )}
                />
              </Link>

              <AnimatePresence>
                {activeDropdown === cat.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-[calc(100%-8px)] left-0 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.15)] py-3 min-w-[200px] overflow-hidden"
                  >
                    <Link
                      href={`/${cat.slug}`}
                      onClick={() => {
                        setActiveDropdown(null);
                        if (typeof window !== 'undefined') {
                          sessionStorage.removeItem(`faoo-filters-${cat.slug}`);
                        }
                      }}
                      className="block px-5 py-2.5 text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#151515]/70 hover:text-[#8b0026] hover:bg-[#F5F4F1] transition-all"
                    >
                      All Collection
                    </Link>
                    {cat.subcategories?.map(sub => (
                      <Link
                        key={sub._id}
                        href={`/${sub.slug}`}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-5 py-2.5 text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#151515]/70 hover:text-[#8b0026] hover:bg-[#F5F4F1] transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Logo (Center) */}
        <div className="flex-shrink-0 flex justify-center lg:flex-none lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          <Link href="/" className="block">
            <img
              src="/faoo_logo_1.webp"
              alt="Faoo"
              className="hidden lg:block h-10 w-auto object-contain hover:opacity-80 transition-opacity"
            />
            <img
              src="/faoo_logo_1.webp"
              alt="Faoo"
              className="block lg:hidden h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right icons (Right) */}
        <div className="flex items-center justify-end gap-3 lg:gap-6 flex-1">


          {/* Wishlist (visible on all screens) */}
          <Link
            href="/account/wishlist"
            className="flex relative p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            aria-label={`Wishlist (${wishlistIds.length} items)`}
          >
            <Heart size={18} strokeWidth={1.5} />
            {wishlistIds.length > 0 && (
              <span
                className="absolute top-0 right-0 w-4 h-4 bg-white text-[#8b0026] text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm border border-[#8b0026]/10"
                aria-live="polite"
              >
                {wishlistIds.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            aria-label={`Cart (${itemCount} items)`}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span
                className="absolute top-0 right-0 w-4 h-4 bg-white text-[#8b0026] text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm border border-[#8b0026]/10"
                aria-live="polite"
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div ref={profileRef} className="hidden lg:block relative">
            <button
              onClick={() => setShowProfileMenu((v) => !v)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-white"
              aria-label="Account"
            >
              {isAuthenticated ? (
                <span className="w-6 h-6 rounded-full bg-white text-[#8b0026] text-[10px] font-bold flex items-center justify-center shadow-inner">
                  {initials}
                </span>
              ) : (
                <User size={18} strokeWidth={1.5} />
              )}
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-[calc(100%+8px)] bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.15)] py-3 min-w-[220px] overflow-hidden"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-5 py-3 border-b border-[#151515]/5 mb-1">
                        <p className="text-[12px] font-sans font-bold text-[#151515] tracking-wide truncate">{user?.fullName}</p>
                        <p className="text-[10px] font-sans text-[#A3A3A3] truncate">{user?.email}</p>
                      </div>
                      <Link href="/account/orders" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-sans font-semibold tracking-[0.15em] uppercase text-[#151515]/70 hover:text-[#8b0026] hover:bg-[#F5F4F1] transition-all">
                        <Package size={14} strokeWidth={2} /> My Orders
                      </Link>
                      <Link href="/account/wishlist" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-sans font-semibold tracking-[0.15em] uppercase text-[#151515]/70 hover:text-[#8b0026] hover:bg-[#F5F4F1] transition-all">
                        <Heart size={14} strokeWidth={2} /> Wishlist
                      </Link>
                      <Link href="/account/addresses" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-sans font-semibold tracking-[0.15em] uppercase text-[#151515]/70 hover:text-[#8b0026] hover:bg-[#F5F4F1] transition-all">
                        <MapPin size={14} strokeWidth={2} /> Addresses
                      </Link>
                      <div className="h-[1px] bg-[#151515]/5 my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-5 py-2.5 text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#C0392B] hover:bg-[#C0392B]/5 transition-all">
                        <LogOut size={14} strokeWidth={2} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setShowProfileMenu(false)} className="block px-5 py-2.5 text-[11px] font-sans font-bold tracking-[0.15em] uppercase text-[#151515] hover:text-[#8b0026] hover:bg-[#F5F4F1] transition-all">
                        Login
                      </Link>
                      <Link href="/register" onClick={() => setShowProfileMenu(false)} className="block px-5 py-2.5 text-[11px] font-sans font-semibold tracking-[0.15em] uppercase text-[#151515]/70 hover:text-[#8b0026] hover:bg-[#F5F4F1] transition-all">
                        Create Account
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
