'use client';
// src/components/homepage/NewCollection.tsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeartButton } from '@/components/shared/HeartButton';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/cn';
import { productService } from '@/services/productService';
import { ProductCard as ProductType } from '@/types/product.types';
import { useCategoryStore } from '@/store/categoryStore';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import toast from 'react-hot-toast';
import { getTagBadge } from '@/utils/shopifyTags';

export function NewCollection() {
  const { categories, fetchCategories } = useCategoryStore();
  const [displayItems, setDisplayItems] = useState<{ product: ProductType; gender: 'men' | 'women' }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const getCategoryPath = (key: 'men' | 'women') => {
    const match = categories.find((c) =>
      (c.name || '').toLowerCase().startsWith(key) || (c.slug || '').toLowerCase().startsWith(key)
    );
    const slug = match?.slug ?? key;
    return `/${slug}?isNewCollection=true`;
  };

  const getCategorySlug = (key: 'men' | 'women') => {
    const match = categories.find((c) =>
      (c.name || '').toLowerCase().startsWith(key) || (c.slug || '').toLowerCase().startsWith(key)
    );
    return match?.slug ?? key;
  };

  // Ensure categories are loaded
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Use category slugs if available, fallback to defaults if categories haven't loaded yet
        const menSlug = getCategorySlug('men');
        const womenSlug = getCategorySlug('women');
        const [menRes, womenRes] = await Promise.all([
          productService.getProducts({ category: menSlug, isNewCollection: true, limit: 50 }),
          productService.getProducts({ category: womenSlug, isNewCollection: true, limit: 50 }),
        ]);

        const allMen = menRes.data.map((p: any) => ({ product: p, gender: 'men' as const }));
        const allWomen = womenRes.data.map((p: any) => ({ product: p, gender: 'women' as const }));

        // Desired items by exact substring match
        const desiredNames = [
          "effortless abstract",
          "victoria tie",
          "denim look super soft",
          "aura blue",
          "ur full"
        ];

        const selectedItems: { product: ProductType; gender: 'men' | 'women' }[] = [];

        // Find desired ones first
        desiredNames.forEach(nameSub => {
          // Search in men
          let idx = allMen.findIndex((item: { product: ProductType; gender: 'men' | 'women' }) => (item.product?.name || '').toLowerCase().includes(nameSub.toLowerCase()));
          if (idx !== -1) {
            selectedItems.push(allMen[idx]);
            allMen.splice(idx, 1);
            return;
          }
          // Search in women
          idx = allWomen.findIndex((item: { product: ProductType; gender: 'men' | 'women' }) => (item.product?.name || '').toLowerCase().includes(nameSub.toLowerCase()));
          if (idx !== -1) {
            selectedItems.push(allWomen[idx]);
            allWomen.splice(idx, 1);
          }
        });

        // Fill remaining spots, alternating men and women
        let toggle = true; // true = men, false = women
        while (allMen.length > 0 || allWomen.length > 0) {
          if (toggle) {
            if (allMen.length > 0) {
              selectedItems.push(allMen.shift()!);
            } else if (allWomen.length > 0) {
              selectedItems.push(allWomen.shift()!);
            }
          } else {
            if (allWomen.length > 0) {
              selectedItems.push(allWomen.shift()!);
            } else if (allMen.length > 0) {
              selectedItems.push(allMen.shift()!);
            }
          }
          toggle = !toggle;
        }

        setDisplayItems(selectedItems);
      } catch {
        setDisplayItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);



  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const firstChild = container.firstElementChild as HTMLElement;
      if (firstChild) {
        const cardWidth = firstChild.getBoundingClientRect().width;
        let gap = 24; // fallback gap
        const secondChild = firstChild.nextElementSibling as HTMLElement;
        if (secondChild) {
          gap = secondChild.getBoundingClientRect().left - firstChild.getBoundingClientRect().right;
        }
        const scrollAmount = cardWidth + gap;
        const targetScroll = direction === 'left'
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth',
        });
      }
    }
  };

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      const timer = setTimeout(updateScrollButtons, 100);
      return () => {
        el.removeEventListener('scroll', updateScrollButtons);
        clearTimeout(timer);
      };
    }
  }, [displayItems, loading]);

  const scrollMobileCarousel = (direction: 'left' | 'right') => {
    if (mobileCarouselRef.current) {
      const cardWidth = 280 + 24; // Card width + gap
      const newIndex = direction === 'left'
        ? Math.max(0, mobileCarouselIndex - 1)
        : Math.min(displayItems.length - 1, mobileCarouselIndex + 1);

      setMobileCarouselIndex(newIndex);
      mobileCarouselRef.current.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="bg-white pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden">
      <div className="container-page px-4 md:px-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-center md:justify-between items-center text-center md:text-left mb-16 gap-6 md:gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl md:text-4xl text-[#151515] tracking-[0.1em] flex items-center gap-4 justify-center md:justify-start"
          >
            <span className="h-[1px] w-8 md:w-16 bg-black/10"></span>
            NEW COLLECTION
            <span className="h-[1px] w-8 md:w-16 bg-black/10"></span>
          </motion.h2>

          <div className="flex flex-col items-center md:items-end gap-3.5">
            <div className="flex gap-3 justify-center md:justify-end items-center">
              <Link
                href={getCategoryPath('men')}
                className="px-6 py-2.5 rounded-full text-[10px] font-sans font-bold tracking-[0.2em] uppercase border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                Shop Men&apos;s
              </Link>
              <Link
                href={getCategoryPath('women')}
                className="px-6 py-2.5 rounded-full text-[10px] font-sans font-bold tracking-[0.2em] uppercase border border-[#8b0026]/30 text-black hover:bg-[#8b0026] hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                Shop Women&apos;s
              </Link>
            </div>

            {/* Left and Right navigation buttons */}
            <div className="hidden md:flex gap-2.5 mt-1.5 md:mr-1">
              <button
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 border border-[#E5E5E5] flex items-center justify-center text-[#151515] hover:border-[#151515] hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous products"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 border border-[#E5E5E5] flex items-center justify-center text-[#151515] hover:border-[#151515] hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next products"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Carousel / Grid */}
        {loading ? (
          <div className="min-h-[600px] flex items-center justify-center">
            <Loader2 className="animate-spin text-[#8b0026]" size={32} />
          </div>
        ) : (() => {
          return (
            <>
              {/* Mobile Carousel (md breakpoint and below) */}
              <div className="md:hidden mt-8">
                <div className="relative">
                  {/* Carousel Container */}
                  <div
                    ref={mobileCarouselRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth pb-4 px-4 -mx-4 snap-x snap-mandatory"
                    style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
                  >
                    {displayItems.map((item, idx) => (
                      <div
                        key={`${item.product._id}-${idx}`}
                        className="relative w-[280px] flex-shrink-0 snap-start"
                      >
                        <MinimalProductCard product={item.product} index={idx} gender={item.gender} />
                      </div>
                    ))}
                  </div>

                  {/* Left Arrow Button */}
                  <button
                    onClick={() => scrollMobileCarousel('left')}
                    disabled={mobileCarouselIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 w-10 h-10 rounded-full bg-[#151515] text-white flex items-center justify-center hover:bg-[#8b0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#151515]"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Right Arrow Button */}
                  <button
                    onClick={() => scrollMobileCarousel('right')}
                    disabled={mobileCarouselIndex === displayItems.length - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 w-10 h-10 rounded-full bg-[#151515] text-white flex items-center justify-center hover:bg-[#8b0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#151515]"
                    aria-label="Next"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Desktop Carousel (md breakpoint and above) */}
              <div className="hidden md:block mt-8 relative">
                <div
                  ref={carouselRef}
                  className="flex gap-6 lg:gap-8 overflow-x-auto scroll-smooth pb-4 px-4 -mx-4 [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {displayItems.map((item, idx) => (
                    <motion.div
                      key={`${item.product._id}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-[280px] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-24px)] flex-shrink-0 snap-start"
                    >
                      <MinimalProductCard product={item.product} index={idx} gender={item.gender} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </section>
  );
}

function MinimalProductCard({ product, index, gender }: { product: ProductType; index: number; gender: 'men' | 'women' }) {
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [showSizeSelector, setShowSizeSelector] = useState(false);

  const handleAddToCartWithSize = async (size: string) => {
    setLoading(true);
    try {
      // 1. Fetch full product to get variants
      const { product: fullProduct, variants } = await productService.getProductBySlug(product.slug);

      // 2. Find variant matching selected size
      const targetVariant = variants.find(v => v.isActive && v.stockQuantity > 0 && v.size === size) ||
        variants.find(v => v.isActive && v.size === size) ||
        variants.find(v => v.isActive && v.stockQuantity > 0) ||
        variants[0];

      if (!targetVariant) {
        toast.error('Product currently unavailable');
        return;
      }

      // 3. Add to cart
      await addItem(
        targetVariant._id,
        fullProduct._id,
        1,
        fullProduct,
        targetVariant,
        size
      );

      toast.success(`${product.name} (${size}) added to cart`);
      openCart();
      setShowSizeSelector(false);
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const isSoldOut = product.isAvailable === false;

  return (
    <div className="group flex flex-col h-full bg-transparent">
      <div className="relative w-full aspect-[3/4] rounded-[20px] overflow-hidden bg-[#F5F4F1] mb-3.5 border border-[#151515]/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <Link href={`/products/${product.slug}`} className="block absolute inset-0">
          {/* Product Image */}
          <div className="absolute inset-0 w-full h-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
            <img
              src={product.primaryImage}
              alt={product.name}
              className={cn(
                "w-full h-full object-contain",
                (product.name.toLowerCase().includes('sunglass') || product.name.toLowerCase().includes('watch')) && "object-contain p-8"
              )}
            />
            {/* Subtle dark overlay on hover */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>

        {/* Gender & Tag Badges Stack */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[#151515] text-[8px] font-sans font-bold tracking-[0.15em] uppercase shadow-sm border border-[#151515]/5">
            {gender === 'men' ? "Men's" : "Women's"}
          </span>
          {(() => {
            const derivedTags = product.tags && product.tags.length > 0
              ? product.tags
              : [
                ...(product.isNewCollection ? ['new_collection'] : []),
                ...(product.isLimitedEdition ? ['limited_edition'] : []),
              ];
            const badge = getTagBadge(derivedTags);
            if (!badge) return null;
            return (
              <span
                style={{ backgroundColor: badge.bg, color: badge.color }}
                className="px-2.5 py-0.5 rounded-full text-[8px] font-sans font-bold tracking-[0.15em] uppercase shadow-sm"
              >
                {badge.text}
              </span>
            );
          })()}
        </div>

        {/* Wishlist Icon */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-1.5 group-hover:translate-y-0">
          <div className="w-8 h-8 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:scale-105 transition-transform cursor-pointer border border-[#151515]/5">
            <HeartButton productId={product._id} size="sm" className="bg-transparent border-none text-black shadow-none" />
          </div>
        </div>

        {/* Interactive Size Selector slide-up on click */}
        {showSizeSelector && product.sizesAvailable && product.sizesAvailable.length > 0 && (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl flex flex-col items-center justify-center gap-2.5 z-30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-[#151515]/5 transition-all duration-300 animate-slide-up"
          >
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#737373] uppercase">Select Size</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSizeSelector(false);
                }}
                className="text-[9px] font-sans font-semibold text-[#151515] underline hover:opacity-60 transition-opacity"
              >
                Cancel
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 w-full">
              {product.sizesAvailable.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCartWithSize(size);
                  }}
                  className="px-3 py-1.5 min-w-[36px] bg-white border border-[#D4D4D4] hover:bg-[#151515] hover:text-white hover:border-[#151515] text-[10px] font-sans font-bold text-[#151515] rounded-md transition-all duration-200"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hover "ADD TO CART" pill button */}
        {!isSoldOut && !showSizeSelector && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (product.sizesAvailable && product.sizesAvailable.length > 0 && !product.sizesAvailable.includes('Free Size')) {
                setShowSizeSelector(true);
              } else {
                handleAddToCartWithSize(product.sizesAvailable?.includes('Free Size') ? 'Free Size' : 'Free Size');
              }
            }}
            disabled={loading}
            className="absolute bottom-3 left-3 right-3 bg-[#151515] hover:bg-[#8b0026] text-white py-3 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 text-[10px] font-sans font-bold tracking-[0.2em] uppercase shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              'ADD TO CART'
            )}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1 px-1 flex-grow">
        <div className="flex items-start justify-between gap-4">
          <Link href={`/products/${product.slug}`} className="text-[13px] md:text-sm font-sans font-medium text-[#151515] tracking-wide group-hover:text-[#8b0026] transition-colors duration-300 line-clamp-1">
            {product.name}
          </Link>
          <span className="text-[13px] md:text-sm font-sans font-semibold text-[#151515] whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="text-[10px] text-[#A3A3A3] font-sans tracking-[0.15em] uppercase mt-0.5">
          {gender === 'men' ? 'Men\'s' : 'Women\'s'} Collection
        </p>
      </div>
    </div>
  );
}



