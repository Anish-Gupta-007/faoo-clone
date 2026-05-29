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
  const [menProducts, setMenProducts] = useState<ProductType[]>([]);
  const [womenProducts, setWomenProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

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
          productService.getProducts({ category: menSlug, isNewCollection: true, limit: 8 }),
          productService.getProducts({ category: womenSlug, isNewCollection: true, limit: 8 }),
        ]);
        setMenProducts(menRes.data.slice(0, 4));
        setWomenProducts(womenRes.data.slice(0, 4));
      } catch {
        setMenProducts([]);
        setWomenProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  // Interleave: men[0], women[0], men[1], women[1], men[2], women[2], men[3], women[3]
  const interleaved = Array.from({ length: 4 }, (_, i) => [
    { product: menProducts[i], gender: 'men' as const },
    { product: womenProducts[i], gender: 'women' as const },
  ]).flat().filter((item) => item.product);

  const scrollMobileCarousel = (direction: 'left' | 'right') => {
    if (mobileCarouselRef.current) {
      const cardWidth = 280 + 24; // Card width + gap
      const newIndex = direction === 'left'
        ? Math.max(0, mobileCarouselIndex - 1)
        : Math.min(interleaved.length - 1, mobileCarouselIndex + 1);

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
        <div className="flex flex-col md:flex-row md:items-end justify-center md:justify-between mb-16 gap-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-xl md:text-4xl text-[#151515] tracking-[0.1em] flex items-center gap-4 justify-center"
          >
            <span className="h-[1px] w-8 md:w-16 bg-black/10"></span>
            NEW COLLECTION
            <span className="h-[1px] w-8 md:w-16 bg-black/10"></span>
          </motion.h2>

          <div className="flex gap-3 self-start md:self-auto">
            <Link
              href={getCategoryPath('men')}
              className="px-6 py-2.5 rounded-full text-[10px] font-sans font-bold tracking-[0.2em] uppercase border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300"
            >
              Shop Mens
            </Link>
            <Link
              href={getCategoryPath('women')}
              className="px-6 py-2.5 rounded-full text-[10px] font-sans font-bold tracking-[0.2em] uppercase border border-[#8b0026]/30 text-black hover:bg-[#8b0026] hover:text-white transition-all duration-300"
            >
              Shop Womens
            </Link>
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
                    {interleaved.map((item, idx) => (
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
                    disabled={mobileCarouselIndex === interleaved.length - 1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 w-10 h-10 rounded-full bg-[#151515] text-white flex items-center justify-center hover:bg-[#8b0026] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#151515]"
                    aria-label="Next"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Desktop Grid (2 rows × 4 columns) */}
              <div className="hidden md:block mt-8">
                <div className="grid grid-cols-4 gap-6 lg:gap-8">
                  {interleaved.map((item, idx) => (
                    <motion.div
                      key={`${item.product._id}-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      // 1. Fetch full product to get variants
      const { product: fullProduct, variants } = await productService.getProductBySlug(product.slug);

      // 2. Determine best size (Priority: Free Size > M > L > first available)
      const availableVariants = variants.filter(v => v.isActive && v.stockQuantity > 0);

      let targetVariant = availableVariants.find(v => v.size === 'Free Size') ||
        availableVariants.find(v => v.size === 'M') ||
        availableVariants.find(v => v.size === 'L') ||
        availableVariants[0];

      // 3. Fallback to Free Size if nothing in stock (using first variant as placeholder)
      let sizeOverride = '';
      if (!targetVariant && variants.length > 0) {
        targetVariant = variants[0];
        sizeOverride = 'Free Size';
      }

      if (!targetVariant) {
        toast.error('Product currently unavailable');
        return;
      }

      // 4. Add to cart
      await addItem(
        targetVariant._id,
        fullProduct._id,
        1,
        fullProduct,
        targetVariant,
        sizeOverride || targetVariant.size
      );

      toast.success(`${product.name} added to cart`);
      openCart();
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col h-full bg-transparent"
    >
      <div className="relative w-full aspect-[3/4] rounded-[20px] overflow-hidden bg-[#F5F4F1] mb-3.5 border border-[#151515]/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <Link href={`/products/${product.slug}`} className="block absolute inset-0">
          {/* Product Image */}
          <motion.div
            className="absolute inset-0 w-full h-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          >
            <img
              src={product.primaryImage}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover",
                (product.name.toLowerCase().includes('sunglass') || product.name.toLowerCase().includes('watch')) && "object-contain p-8"
              )}
            />
            {/* Subtle dark overlay on hover */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </Link>

        {/* Gender & Tag Badges Stack */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[#151515] text-[8px] font-sans font-bold tracking-[0.15em] uppercase shadow-sm border border-[#151515]/5">
            {gender === 'men' ? "Mens" : "Womens"}
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

        {/* Sizes Overlay */}
        {product.sizesAvailable && product.sizesAvailable.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md py-2.5 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0 pointer-events-none shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-[#151515]/5">
            <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-[#737373] uppercase mr-0.5">Sizes:</span>
            {product.sizesAvailable.map((size) => (
              <span key={size} className="text-[9px] font-sans font-bold text-[#151515]">
                {size}
              </span>
            ))}
          </div>
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
          {gender === 'men' ? 'Mens' : 'Womens'} Collection
        </p>
      </div>
    </motion.div>
  );
}



