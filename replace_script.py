import sys

with open('src/components/homepage/NewCollection.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = 17 # line 18
end_idx = 314 # line 315

new_code = """export function NewCollection() {
  const MENS_SEQ = [
    "effortless abstract",
    "denim look",
    "all occasion",
    "satin shirt",
    "all star black",
    "night anthem"
  ];
  const WOMENS_SEQ = [
    "victoria tie",
    "beach wave resort set",
    "aura blue half sleeves top",
    "aura blue full sleeves top",
    "aura blue striaght leg pants",
    "floral peplum top"
  ];
  const WOMENS_LAST = [
    "aura blue half sleeve set",
    "aura blue full sleeve set"
  ];

  return (
    <div className="flex flex-col gap-0">
      <CollectionSection gender="men" title="MEN'S NEW COLLECTION" sequence={MENS_SEQ} lastItems={[]} />
      <CollectionSection gender="women" title="WOMEN'S NEW COLLECTION" sequence={WOMENS_SEQ} lastItems={WOMENS_LAST} hideTopPadding={true} />
    </div>
  );
}

function CollectionSection({ gender, title, sequence, lastItems, hideTopPadding = false }: { gender: 'men'|'women', title: string, sequence: string[], lastItems: string[], hideTopPadding?: boolean }) {
  const { categories, fetchCategories } = useCategoryStore();
  const [displayItems, setDisplayItems] = useState<{ product: ProductType; gender: 'men' | 'women' }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileCarouselIndex, setMobileCarouselIndex] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const getCategoryPath = () => {
    const match = categories.find((c) =>
      (c.name || '').toLowerCase().startsWith(gender) || (c.slug || '').toLowerCase().startsWith(gender)
    );
    const slug = match?.slug ?? gender;
    return `/${slug}?isNewCollection=true`;
  };

  const getCategorySlug = () => {
    const match = categories.find((c) =>
      (c.name || '').toLowerCase().startsWith(gender) || (c.slug || '').toLowerCase().startsWith(gender)
    );
    return match?.slug ?? gender;
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const slug = getCategorySlug();
        const res = await productService.getProducts({ category: slug, isNewCollection: true, limit: 100 });
        let allProducts = res.data.map((p: any) => ({ product: p, gender }));

        const selectedItems: any[] = [];
        
        // Find desired ones first
        sequence.forEach(nameSub => {
          let idx = allProducts.findIndex((item: any) => (item.product?.name || '').toLowerCase().includes(nameSub.toLowerCase()));
          if (idx !== -1) {
            selectedItems.push(allProducts[idx]);
            allProducts.splice(idx, 1);
          }
        });

        // Find last items and remove from allProducts
        const lastItemsFound: any[] = [];
        lastItems.forEach(nameSub => {
          let idx = allProducts.findIndex((item: any) => (item.product?.name || '').toLowerCase().includes(nameSub.toLowerCase()));
          if (idx !== -1) {
            lastItemsFound.push(allProducts[idx]);
            allProducts.splice(idx, 1);
          }
        });

        // Add remaining
        selectedItems.push(...allProducts);
        
        // Add last items
        selectedItems.push(...lastItemsFound);

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
        let gap = 24;
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
      const cardWidth = 280 + 24; 
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
    <section className={cn("bg-white pb-12 md:pb-24 overflow-hidden", hideTopPadding ? "pt-0" : "pt-12 md:pt-20")}>
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
            {title}
            <span className="h-[1px] w-8 md:w-16 bg-black/10"></span>
          </motion.h2>

          <div className="flex flex-col items-center md:items-end gap-3.5">
            <div className="flex gap-3 justify-center md:justify-end items-center">
              <Link
                href={getCategoryPath()}
                className="px-6 py-2.5 rounded-full text-[10px] font-sans font-bold tracking-[0.2em] uppercase border border-black/10 text-black hover:bg-black hover:text-white transition-all duration-300 whitespace-nowrap"
              >
                Shop {gender === 'men' ? "Men's" : "Women's"}
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
"""

lines = lines[:start_idx] + [new_code + "\\n"] + lines[end_idx:]

with open('src/components/homepage/NewCollection.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
