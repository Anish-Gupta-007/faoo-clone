'use client';
// src/app/products/[slug]/page.tsx
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect } from 'react';
import { productService } from '@/services/productService';
import { shopifyService, ShopifyProductWithMeta } from '@/services/shopifyService';
import { getTagBadge } from '@/utils/shopifyTags';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { HeartButton } from '@/components/shared/HeartButton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SizeGuideModal } from '@/components/pdp/SizeGuideModal';
import { ProductUSPs } from '@/components/pdp/ProductUSPs';
import { FittingScale } from '@/components/pdp/FittingScale';
import { AddToCartSection } from '@/components/pdp/AddToCartSection';
import { Spinner } from '@/components/ui/Spinner';
import { SupportSection } from '@/components/pdp/SupportSection';
import { FocusWithFaoo } from '@/components/pdp/FocusWithFaoo';
import { IRLSection } from '@/components/pdp/IRLSection';
import { ReviewsSection } from '@/components/pdp/ReviewsSection';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { ProductVariant, SizeOption, FittingType } from '@/types/product.types';
import { formatPrice } from '@/utils/formatPrice';
import { cn } from '@/lib/cn';
import { Truck, CreditCard, Package, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';


function PDPContent() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedFitting, setSelectedFitting] = useState<FittingType | null>(null);
  const [descOpen, setDescOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [careOpen, setCareOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== activeImage) {
        setActiveImage(newIndex);
      }
    }
  };

  const handleDotClick = (idx: number) => {
    setActiveImage(idx);
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollTo({
        left: idx * mobileScrollRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (thumbStripRef.current) {
      const activeBtn = thumbStripRef.current.children[activeImage] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [activeImage]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
  });

  const { data: shopifyData } = useQuery({
    queryKey: ['shopify-product', slug],
    queryFn: () => shopifyService.getProductByHandle(slug),
  });

  const variants = data?.variants || [];

  useEffect(() => {
    if (variants && variants.length > 0) {
      const firstColor = variants[0]?.color;
      if (firstColor && !selectedColor) {
        setSelectedColor(firstColor);
      }
    }
  }, [variants, selectedColor]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );

  if (error || !data) return (
    <div className="container-page py-20 text-center">
      <p className="font-sans text-[#A3A3A3]">Product not found.</p>
    </div>
  );

  const { product } = data;

  const shopifyProduct = shopifyData?.data as ShopifyProductWithMeta | undefined;

  const shopifyVariants = (
    Array.isArray(shopifyProduct?.variants)
      ? shopifyProduct.variants
      : (shopifyProduct?.variants as any)?.edges?.map((edge: any) => edge.node) ?? []
  ) as any[];

  const isProductAvailable = shopifyProduct
    ? (shopifyProduct.isAvailable ?? true)
    : true;

  const isOutOfStockOverall = !isProductAvailable || variants.filter(v => v.isActive).every(v => v.stockQuantity <= 0);

  const colorGroups = variants.reduce<Record<string, { color: string; hex: string; variants: ProductVariant[] }>>(
    (acc, v) => {
      if (!acc[v.color]) acc[v.color] = { color: v.color, hex: v.colorHex, variants: [] };
      acc[v.color].variants.push(v);
      return acc;
    },
    {}
  );

  const availableSizes = selectedColor && colorGroups[selectedColor]
    ? Array.from(new Set((colorGroups[selectedColor].variants || []).filter((v) => v.stockQuantity > 0 && v.isActive).map((v) => v.size)))
    : Array.from(new Set((variants || []).filter((v) => v.stockQuantity > 0 && v.isActive).map((v) => v.size)));

  const hasSizes = (product.sizesAvailable || []).length > 0;

  const availableFittings = selectedColor && selectedSize && colorGroups[selectedColor]
    ? Array.from(new Set(
      (colorGroups[selectedColor].variants || [])
        .filter((v) => v.size === selectedSize && v.stockQuantity > 0)
        .map((v) => v.fittingType)
    ))
    : [];

  const currentVariant = variants.find(
    (v) =>
      v.color === selectedColor &&
      v.size === selectedSize &&
      (availableFittings.length <= 1 || v.fittingType === selectedFitting) &&
      v.isActive &&
      v.stockQuantity > 0
  ) ?? null;

  const hasColors = Object.keys(colorGroups).length > 0;
  const canAddToCart = (!hasColors || selectedColor !== null) && (!hasSizes || selectedSize !== null) && (availableFittings.length <= 1 || selectedFitting !== null);

  const handleAddToCart = async () => {
    if (isOutOfStockOverall) {
      toast.error('This product is currently out of stock');
      return;
    }
    if (hasSizes && !selectedSize && !product.sizesAvailable?.includes('Free Size')) {
      toast.error('Please select a size');
      return;
    }

    const targetSize = selectedSize || (product.sizesAvailable?.includes('Free Size') ? 'Free Size' as SizeOption : null);
    const targetVariant = currentVariant || variants.find(v => v.isActive && v.stockQuantity > 0) || variants.find(v => v.isActive);
    if (!targetVariant) {
      toast.error('Product currently unavailable');
      return;
    }

    setAddingToCart(true);
    try {
      await addItem(targetVariant._id, product._id, 1, product, targetVariant, targetSize as string);
      toast.success('Added to cart!');
      openCart();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStockOverall) {
      toast.error('This product is currently out of stock');
      return;
    }
    if (hasSizes && !selectedSize && !product.sizesAvailable?.includes('Free Size')) {
      toast.error('Please select a size');
      return;
    }

    const targetSize = selectedSize || (product.sizesAvailable?.includes('Free Size') ? 'Free Size' as SizeOption : null);
    const targetVariant = currentVariant || variants.find(v => v.isActive && v.stockQuantity > 0) || variants.find(v => v.isActive);
    if (!targetVariant) {
      toast.error('Product currently unavailable');
      return;
    }
    setAddingToCart(true);
    try {
      await addItem(targetVariant._id, product._id, 1, product, targetVariant, targetSize as string);
      const { cart } = useCartStore.getState();
      if (cart?.checkoutUrl) {
        window.location.href = cart.checkoutUrl;
      } else {
        toast.error('Unable to proceed to checkout');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to proceed to checkout');
    } finally {
      setAddingToCart(false);
    }
  };

  const sortedMedia = [...(product.media || [])].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const price = currentVariant?.price ?? product.price;

  // Never show dummy images – if no real media, displayImages will be empty
  const displayImages = sortedMedia.map(m => m.url).filter(Boolean);

  const getShopifyVariantStatus = (variantTitle: string): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    const match = shopifyVariants.find(v =>
      v.title.toLowerCase() === variantTitle.toLowerCase() ||
      v.selectedOptions?.some((o: any) => o.value.toLowerCase() === variantTitle.toLowerCase())
    );
    if (!match) return 'in_stock';
    return match.stockStatus || (match.availableForSale ? 'in_stock' : 'out_of_stock');
  };

  const focusMedia = shopifyProduct?.focusImages?.length
    ? shopifyProduct.focusImages.map((img, idx) => ({
      id: String(idx),
      title: shopifyProduct.focusTitles?.[idx] || 'Focus',
      description: shopifyProduct.title || '',
      image: img,
    }))
    : (product.media || [])
      .filter((m: any) => m.mediaType === 'faoo_focus')
      .map((m: any, idx: number) => ({
        id: m._id || String(idx),
        title: 'Precision Focus',
        description: product.name,
        image: m.url,
      }));

  const irlMedia = shopifyProduct?.irlImages?.length
    ? shopifyProduct.irlImages.map((img, idx) => ({
      id: String(idx),
      url: img,
      handle: shopifyProduct.irlHandles?.[idx] || '@faoo_irl',
    }))
    : (product.media || [])
      .filter((m: any) => m.mediaType === 'irl')
      .map((m: any, idx: number) => ({
        id: m._id || String(idx),
        url: m.url,
        handle: '@faoo_irl',
      }));

  return (
    <>
      <div className="container-page pt-8 md:pt-12 pb-0">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: product.category?.name || 'Shop', href: `/${product.category?.slug || 'men'}` },
            { label: product.name },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 mt-6 md:mt-8">
          {/* Left Column: Gallery & Model Info */}
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col md:flex-row gap-3 lg:gap-4">
              {/* Vertical Thumbnails (Desktop Only) */}
              <div
                ref={thumbStripRef}
                className="hidden md:flex flex-col gap-2.5 w-[72px] lg:w-[84px] max-h-[500px] overflow-y-auto select-none [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative flex-shrink-0 w-full aspect-square overflow-hidden bg-[#F5F5F5] transition-all duration-300 ease-out cursor-pointer focus:outline-none border",
                      activeImage === idx
                        ? "opacity-100 border-[#151515]"
                        : "opacity-60 hover:opacity-100 border-transparent"
                    )}
                  >
                    <img
                      src={url}
                      alt={`View ${idx + 1}`}
                      className={cn(
                        "w-full h-full transition-transform duration-700 ease-out",
                        activeImage === idx ? "scale-105" : "scale-100",
                        (product.name.toLowerCase().includes('sunglass') || product.name.toLowerCase().includes('watch') || product.name.toLowerCase().includes('goggle'))
                          ? "object-contain p-1.5"
                          : "object-cover"
                      )}
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Container */}
              <div className="flex-1 relative w-full min-h-[500px] md:min-h-auto md:max-h-[600px] lg:max-h-[700px] overflow-hidden bg-[#FAFAFA] border border-[#151515]/5 flex items-center justify-center">
                {/* Desktop View: Single Main Image with Fade Transition */}
                <div className="hidden md:flex w-full h-full relative items-center justify-center">
                  <AnimatePresence mode="wait">
                    {displayImages[activeImage] ? (
                      <motion.img
                        key={activeImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                        src={displayImages[activeImage]}
                        alt={`${product.name} - view ${activeImage + 1}`}
                        className="max-w-full max-h-full w-auto h-auto object-contain p-4 md:p-6 lg:p-8"
                      />
                    ) : (
                      <motion.div
                        key="empty"
                        className="w-full h-full flex items-center justify-center"
                      >
                        <span className="font-display text-6xl text-[#151515]/10">F</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile View: Swipeable Carousel */}
                <div className="block md:hidden w-full h-full relative">
                  <div
                    ref={mobileScrollRef}
                    onScroll={handleScroll}
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {displayImages.map((url, idx) => (
                      <div key={idx} className="w-full h-full flex-shrink-0 snap-start relative bg-[#FAFAFA] flex items-center justify-center">
                        <img
                          src={url}
                          alt={`${product.name} - view ${idx + 1}`}
                          className="max-w-full max-h-full w-auto h-auto object-contain p-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Badges */}
                {product.isNewCollection && (
                  <div className="absolute top-4 left-4 z-10"><Badge variant="new">New</Badge></div>
                )}
                {product.isLimitedEdition && (
                  <div className="absolute top-4 left-4 z-10"><Badge variant="limited">Limited</Badge></div>
                )}
              </div>
            </div>

            {/* Mobile Pagination Dots */}
            <div className="flex md:hidden justify-center items-center gap-1.5 py-1">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-out focus:outline-none",
                    activeImage === idx
                      ? "bg-[#151515] w-5"
                      : "bg-[#151515]/20 w-1.5 hover:bg-[#151515]/40"
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>

            {/* Model Info Bar Below Image */}
            {(product.modelInfo?.modelName || product.modelInfo?.height || product.modelInfo?.sizeWearing) && (
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 mt-2 bg-[#F5F4F1] text-[10px] font-sans text-[#151515]/60 uppercase tracking-[0.2em] border border-[#151515]/5">
                {product.modelInfo.modelName && <span>Model: <span className="text-[#151515] font-semibold">{product.modelInfo.modelName}</span></span>}
                {product.modelInfo.height && <span>Height: <span className="text-[#151515] font-semibold">{product.modelInfo.height}</span></span>}
                {product.modelInfo.sizeWearing && <span>Wearing Size: <span className="text-[#151515] font-semibold">{product.modelInfo.sizeWearing}</span></span>}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-4xl md:text-5xl lg:text-[56px] text-[#151515] leading-[1.1]">{product.name}</h1>
            </div>

            {shopifyProduct?.tags && getTagBadge(shopifyProduct.tags) && (() => {
              const badge = getTagBadge(shopifyProduct.tags)!;
              return (
                <div className="flex items-center gap-2 mt-2">
                  <div
                    style={{ backgroundColor: badge.bg, color: badge.color }}
                    className="inline-flex px-3 py-1"
                  >
                    <span className="font-sans text-[9px] tracking-[0.2em] uppercase font-bold">
                      {badge.text}
                    </span>
                  </div>
                </div>
              );
            })()}

            <p className="font-sans text-xl font-medium text-[#0A0A0A]">{formatPrice(price)}</p>

            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-1 bg-[#0A0A0A] text-white rounded-sm">
                  10% Off · First Order · Code: FIRST10
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-1 bg-[#F5F5F5] text-[#737373] border border-[#E5E5E5] rounded-sm">
                  Extra ₹150 Off · Prepaid Orders
                </span>
              </div>

              {/* Rating Section
              <div className="flex items-center gap-3 py-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={cn(
                        "transition-colors",
                        i < 5 ? "fill-amber-400 text-amber-400" : "text-[#D4D4D4]"
                      )}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#A3A3A3] font-medium">
                  <span>5.0 Rating</span>
                  <span className="w-[1px] h-3 bg-[#E5E5E5]" />
                  <span>124 Reviews</span>
                </div>
              </div>
              */}
            </div>

            <ProductUSPs usps={product.usps} className="mt-2" />

            {Object.keys(colorGroups).length > 0 && (
              <div className="pt-4">
                <p className="text-xs font-sans font-medium tracking-widest uppercase text-[#A3A3A3] mb-3">
                  Select a Color{selectedColor ? `: ${selectedColor}` : ''}
                </p>
                <div className="flex gap-3">
                  {Object.values(colorGroups).map(({ color, hex }) => (
                    <button
                      key={color}
                      onClick={() => { setSelectedColor(color); setSelectedSize(null); setSelectedFitting(null); }}
                      aria-label={`Select color ${color}`}
                      style={{ backgroundColor: hex }}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all',
                        selectedColor === color ? 'border-[#0A0A0A] scale-110' : 'border-[#D4D4D4] hover:border-[#A3A3A3]'
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2">
              {isOutOfStockOverall && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FEF2F2] border border-[#C0392B]/20 rounded-sm mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#C0392B] font-medium">
                    Out of Stock
                  </span>
                </div>
              )}

              {!isOutOfStockOverall && shopifyVariants.some(v => v.stockStatus === 'low_stock') && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFFBEB] border border-amber-400/30 rounded-sm mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-amber-600 font-medium">
                    Only a few left
                  </span>
                </div>
              )}

              <AddToCartSection
                sizes={(product.sizesAvailable || []).filter(s => s !== 'Free Size') as any}
                selectedSize={selectedSize as any}
                outOfStockSizes={(product.sizesAvailable || []).filter(s => !availableSizes.includes(s as any)) as any}
                onSizeSelect={(size) => setSelectedSize(size as any)}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isLoading={addingToCart}
                fitType={(
                  (shopifyProduct?.fitType?.toLowerCase()) ||
                  ((product as any).fittingType?.toLowerCase()) ||
                  'regular'
                ) as any}
                isFreeSize={product.sizesAvailable?.includes('Free Size')}
                onSizeGuideClick={() => setSizeGuideOpen(true)}
                showValidation={hasSizes && !selectedSize && !product.sizesAvailable?.includes('Free Size')}
                productId={product._id}
                isOutOfStock={isOutOfStockOverall}
              />
            </div>

            <div className="flex flex-col gap-2 py-3 border-t border-[#EFEFEF]">
              <div className="flex items-center gap-2.5 text-sm font-sans text-[#525252]">
                <Truck size={15} className="text-[#A3A3A3]" />
                Delivery in 7–10 business days
              </div>
              <div className="flex items-center gap-2.5 text-sm font-sans text-[#525252]">
                <CreditCard size={15} className="text-[#A3A3A3]" />
                Extra discount on prepaid orders
              </div>
              {product.isCODAvailable && (
                <div className="flex items-center gap-2.5 text-sm font-sans text-[#525252]">
                  <Package size={15} className="text-[#A3A3A3]" />
                  Cash on Delivery Available
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm font-sans text-[#525252]">
                <Truck size={15} className="text-[#A3A3A3]" />
                Free Shipping PAN India
              </div>
            </div>

            {product.productNote && (
              <p className="text-xs font-sans text-[#A3A3A3] italic">
                {product.productNote?.includes('Print may vary')
                  ? 'Print may vary garment to garment'
                  : product.productNote}
              </p>
            )}

            <div className="border-t border-[#EFEFEF]">
              <button
                onClick={() => setDescOpen((o) => !o)}
                className="flex items-center justify-between w-full py-4 text-sm font-sans font-medium text-[#0A0A0A]"
              >
                Product Details
                {descOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {descOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm font-sans text-[#525252] leading-relaxed pb-4">
                      {product.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-[#EFEFEF]">
              <button
                onClick={() => setDisclaimerOpen((o) => !o)}
                className="flex items-center justify-between w-full py-4 text-sm font-sans font-medium text-[#0A0A0A]"
              >
                Disclaimer
                {disclaimerOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {disclaimerOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="flex flex-col gap-2 pb-4">
                      {[
                        'The actual colour may slightly vary on different screens.',
                        'The design on each article may slightly vary.',
                        'Each article is made to order.',
                        ...(
                          (
                            (product as any).tags?.some((t: string) => t.toLowerCase().includes('accessories') || t.toLowerCase() === 'accessory') ||
                            shopifyProduct?.tags?.some((t: string) => t.toLowerCase().includes('accessories') || t.toLowerCase() === 'accessory')
                          )
                            ? ['Accessories are non-refundable.'] : []
                        ),
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-sans text-[#737373] leading-relaxed">
                          <span className="mt-[5px] w-1 h-1 rounded-full bg-[#A3A3A3] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Care Instructions */}
            <div className="border-t border-b border-[#EFEFEF]">
              <button
                onClick={() => setCareOpen((o) => !o)}
                className="flex items-center justify-between w-full py-4 text-sm font-sans font-medium text-[#0A0A0A]"
              >
                Care Instructions
                {careOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <AnimatePresence>
                {careOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="flex flex-col gap-2 pb-4">
                      {['Dry Clean only', 'Steam Iron'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-sans text-[#737373]">
                          <span className="w-1 h-1 rounded-full bg-[#A3A3A3] flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      </div>
      {focusMedia.length > 0 && <FocusWithFaoo details={focusMedia} />}
      {irlMedia.length > 0 && <IRLSection images={irlMedia} />}
      <SupportSection />
      <ReviewsSection productId={slug} />
    </>
  );
}

export default function ProductPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>}><PDPContent /></Suspense>;
}
