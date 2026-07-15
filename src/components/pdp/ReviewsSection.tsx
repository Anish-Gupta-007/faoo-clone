'use client';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StaticReview {
  name: string;
  image: string;
  rating: number;
  text: string;
  date: string;
}

const STATIC_REVIEWS: Record<string, StaticReview> = {
  'aura-blue-half-sleeves-top': {
    name: 'Aastha',
    image: '/youndfaoo/Aastha.jpg',
    rating: 5,
    text: 'I got this Aura Blue Top and Pants for my vacation and now I have been wearing it everywhere I go. From vacation, to office, to brunch plans—it’s my favourite. Love the fabric and fit.',
    date: 'July 2026'
  },
  'aura-blue-half-sleeves-set': {
    name: 'Aastha',
    image: '/youndfaoo/Aastha.jpg',
    rating: 5,
    text: 'I got this Aura Blue Top and Pants for my vacation and now I have been wearing it everywhere I go. From vacation, to office, to brunch plans—it’s my favourite. Love the fabric and fit.',
    date: 'July 2026'
  },
  'aura-blue-full-sleeves-top': {
    name: 'Aastha',
    image: '/youndfaoo/Aastha.jpg',
    rating: 5,
    text: 'I got this Aura Blue Top and Pants for my vacation and now I have been wearing it everywhere I go. From vacation, to office, to brunch plans—it’s my favourite. Love the fabric and fit.',
    date: 'July 2026'
  },
  'aura-blue-striaght-leg-pants': {
    name: 'Aastha',
    image: '/youndfaoo/Aastha.jpg',
    rating: 5,
    text: 'I got this Aura Blue Top and Pants for my vacation and now I have been wearing it everywhere I go. From vacation, to office, to brunch plans—it’s my favourite. Love the fabric and fit.',
    date: 'July 2026'
  },
  'summer-icon-satin-shirt': {
    name: 'Sarthak',
    image: '/youndfaoo/Sarthak.jpg',
    rating: 5,
    text: 'The Summer Icon Satin Shirt fits and looks so good. I like the quality and look. Worth the money.',
    date: 'July 2026'
  }
};

function StarRow({ rating, size = 13, className }: { rating: number; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={cn(
            'transition-colors',
            s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-[#D4D4D4]'
          )}
        />
      ))}
    </div>
  );
}

export function ReviewsSection({ productId }: { productId: string }) {
  const review = STATIC_REVIEWS[productId];

  if (!review) return null;

  return (
    <section aria-label="Customer Reviews" className="w-full border-t border-[#EFEFEF] py-20 md:py-28 bg-[#FFFFFF]">
      <div className="container-page">
        {/* Header */}
        <div className="flex items-baseline justify-between gap-4 mb-14 md:mb-16">
          <h2 className="font-display font-light" style={{ letterSpacing: '0.28em', fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', textTransform: 'uppercase', color: '#0A0A0A' }}>
            Customer Review
          </h2>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A3A3A3' }}>
            1 Review
          </span>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2.5fr] gap-10 md:gap-16 items-center">
          {/* Customer Image */}
          <div className="relative aspect-[4/5] w-full max-w-[340px] mx-auto md:max-w-none md:w-full rounded-[24px] overflow-hidden bg-[#FAF9F5] border border-[#EAE6DF]/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] group">
            <Image
              src={review.image}
              alt={`${review.name} wearing Faoo`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
          </div>

          {/* Review Details */}
          <div className="flex flex-col items-start">
            <StarRow rating={review.rating} size={16} className="mb-4" />

            <p className="font-display text-xl md:text-2xl lg:text-3xl text-[#151515] italic mb-6 text-balance font-light leading-relaxed">
              &ldquo;{review.text}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0A0A0A', fontWeight: 600 }}>
                {review.name}
              </span>
              <span className="w-[1px] h-3 bg-[#E5E5E5]" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A3A3A3' }}>
                Verified Buyer
              </span>
              <span className="w-[1px] h-3 bg-[#E5E5E5]" />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A3A3A3' }}>
                {review.date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
