'use client';
// src/components/layout/MobileMenu.tsx
import Link from 'next/link';
import { ChevronDown, Heart, User, Package, MapPin, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from '@/components/ui/Drawer';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useCategoryStore } from '@/store/categoryStore';
import { QUICK_LINKS } from '@/constants/routes';
import { cn } from '@/lib/cn';

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { categories: rawCategories } = useCategoryStore();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const CATEGORY_ORDER = ['men', 'women', 'accessories'];
  const getCatOrder = (cat: { slug?: string; name?: string }) => {
    const nameStr = (cat.name || '').toLowerCase();
    const slugStr = (cat.slug || '').toLowerCase();
    const idx = CATEGORY_ORDER.findIndex((o) => nameStr.startsWith(o) || slugStr.startsWith(o));
    return idx === -1 ? 99 : idx;
  };
  const categories = [...rawCategories].sort((a, b) => getCatOrder(a) - getCatOrder(b));

  return (
    <Drawer isOpen={isMobileMenuOpen} onClose={closeMobileMenu} title="Menu" side="left" width="min(80vw, 300px)">
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4">
          {categories.map((cat) => (
            <div key={cat._id}>
              {cat.subcategories && cat.subcategories.length > 0 ? (
                <>
                  <button
                    onClick={() => setOpenSection(openSection === cat.name ? null : cat.name)}
                    className="flex items-center justify-between w-full px-6 py-4 text-xl font-display font-light text-[#0A0A0A] hover:bg-gray-50"
                  >
                    {cat.name.toLowerCase().startsWith('men') ? 'Mens' :
                      cat.name.toLowerCase().startsWith('women') ? 'Women' :
                        cat.name.toLowerCase().startsWith('accessories') ? 'Accessories' :
                          cat.name}
                    <ChevronDown size={16} className={cn('transition-transform text-[#A3A3A3]', openSection === cat.name && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {openSection === cat.name && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-[#F9F9F7]">
                        <Link
                          href={`/${cat.slug}`}
                          onClick={() => {
                            closeMobileMenu();
                            if (typeof window !== 'undefined') {
                              sessionStorage.removeItem(`faoo-filters-${cat.slug}`);
                            }
                          }}
                          className="block px-8 py-2.5 text-sm font-sans text-[#525252] hover:text-[#0A0A0A]"
                        >
                          All Collection
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={`/${cat.slug}`}
                  onClick={() => {
                    closeMobileMenu();
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem(`faoo-filters-${cat.slug}`);
                    }
                  }}
                  className="flex items-center w-full px-6 py-4 text-xl font-display font-light text-[#0A0A0A] hover:bg-gray-50"
                >
                  {cat.name.toLowerCase().startsWith('men') ? 'Mens' :
                    cat.name.toLowerCase().startsWith('women') ? 'Women' :
                      cat.name.toLowerCase().startsWith('accessories') ? 'Accessories' :
                        cat.name}
                </Link>
              )}
            </div>
          ))}

          <div className="border-t border-[#EFEFEF] mt-2 pt-2">
            {QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMobileMenu} className="block px-6 py-3.5 text-sm font-sans text-[#525252] hover:text-[#0A0A0A]">{link.label}</Link>
            ))}
          </div>
        </div>
        <div className="border-t border-[#EFEFEF] p-4">
          {isAuthenticated ? (
            <div className="flex flex-col gap-1">
              <div className="px-2 py-2">
                <p className="text-sm font-medium text-[#0A0A0A]">{user?.fullName}</p>
                <p className="text-xs text-[#A3A3A3]">{user?.email}</p>
              </div>
              <Link href="/account/orders" onClick={closeMobileMenu} className="flex items-center gap-3 px-2 py-2.5 text-sm text-[#525252]"><Package size={15} /> Orders</Link>
              <Link href="/account/wishlist" onClick={closeMobileMenu} className="flex items-center gap-3 px-2 py-2.5 text-sm text-[#525252]"><Heart size={15} /> Wishlist</Link>
              <Link href="/account/addresses" onClick={closeMobileMenu} className="flex items-center gap-3 px-2 py-2.5 text-sm text-[#525252]"><MapPin size={15} /> Addresses</Link>
              <button onClick={() => { logout(); closeMobileMenu(); }} className="flex items-center gap-3 px-2 py-2.5 text-sm text-[#C0392B]"><LogOut size={15} /> Logout</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href="https://shopify.com/100271948085/account"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 w-full h-11 bg-[#0A0A0A] text-white text-sm font-medium rounded tracking-widest uppercase"
              >
                <User size={16} /> Login
              </Link>
              <Link
                href="https://shopify.com/100271948085/account"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="flex items-center justify-center w-full h-11 border border-[#E5E5E5] text-sm text-[#525252] rounded"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
