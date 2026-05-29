'use client';
// src/components/plp/ProductCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Loader2 } from 'lucide-react';
import { ProductCard as ProductType } from '@/types/product.types';
import { formatPrice } from '@/utils/formatPrice';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { HeartButton } from '@/components/shared/HeartButton';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { productService } from '@/services/productService';
import { getTagBadges } from '@/utils/shopifyTags';


interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const derivedTags = product.tags && product.tags.length > 0
    ? product.tags
    : [
        ...(product.isNewCollection ? ['new_collection'] : []),
        ...(product.isLimitedEdition ? ['limited_edition'] : []),
      ];
  const badges = getTagBadges(derivedTags);
  const isSoldOut = product.isAvailable === false;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col h-full bg-transparent"
    >
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-[#F5F4F1] mb-3.5 rounded-[20px] border border-[#151515]/5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        {/* Badges Stack */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none flex flex-col gap-[5px]">
          {badges.map((badge) => (
            <div
              key={badge.type}
              style={{ backgroundColor: badge.bg, color: badge.color }}
              className="inline-flex items-center h-[18px] px-[7px] rounded-full"
            >
              <span className="font-sans text-[7.5px] tracking-[0.08em] uppercase font-semibold leading-none whitespace-nowrap">
                {badge.text}
              </span>
            </div>
          ))}

          {isSoldOut && (
            <div className="inline-flex items-center h-[18px] px-[7px] bg-black/90 text-white rounded-full">
              <span className="font-sans text-[7.5px] tracking-[0.08em] uppercase font-semibold leading-none whitespace-nowrap">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <Image
          src={product.primaryImage || '/placeholder.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 33vw"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-1.5 group-hover:translate-y-0">
          <div className="w-8 h-8 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:scale-105 transition-transform cursor-pointer border border-[#151515]/5">
            <HeartButton 
              productId={product._id} 
              className="bg-transparent border-none text-black hover:bg-transparent shadow-none"
            />
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
      </Link>

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
          {product.category?.name || 'Collection'}
        </p>
      </div>
    </motion.div>
  );
}
