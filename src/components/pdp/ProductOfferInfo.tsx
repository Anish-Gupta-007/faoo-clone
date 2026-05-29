'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/Badge';

interface ProductOfferInfoProps {
  price: string;
  firstOrderDiscount?: string;
  promoCode?: string;
  prepaidDiscount?: string;
  rating?: number;
  reviewCount?: number;
  className?: string;
}

export const ProductOfferInfo: React.FC<ProductOfferInfoProps> = ({
  price = '699/-',
  firstOrderDiscount = '10% Off',
  promoCode = 'FIRST10',
  prepaidDiscount = 'Extra ₹150 Off',
  rating = 5,
  reviewCount = 124,
  className,
}) => {
  return (
    <div className={cn('space-y-6 py-4', className)}>
      {/* Price Section */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-medium tracking-tight text-[#151515]">
          ₹{price}
        </span>
        <span className="text-sm text-[#A3A3A3] line-through">₹999</span>
      </div>

      {/* Promotions Section */}
      <div className="space-y-3">
        {/* Promotion 1 */}
        <div className="flex items-center gap-3">
          <Badge variant="new" className="px-1.5 py-0.5 text-[9px]">
            Offer
          </Badge>
          <div className="text-[11px] uppercase tracking-wider text-[#525252] font-medium flex items-center gap-1.5">
            <span>{firstOrderDiscount}</span>
            <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
            <span>First Order</span>
            <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
            <span className="text-[#151515]">Code: {promoCode}</span>
          </div>
        </div>

        {/* Promotion 2 */}
        <div className="flex items-center gap-3">
          <Badge variant="default" className="px-1.5 py-0.5 text-[9px] bg-[#F5F5F5] text-[#737373]">
            Prepaid
          </Badge>
          <div className="text-[11px] uppercase tracking-wider text-[#525252] font-medium flex items-center gap-1.5">
            <span>{prepaidDiscount}</span>
            <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
            <span>Prepaid Orders</span>
          </div>
        </div>
      </div>

      {/* Rating Section
      <div className="flex items-center gap-4 pt-2 border-t border-[#F7F7F7]">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={cn(
                "transition-colors",
                i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-[#D4D4D4]"
              )}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#A3A3A3] font-medium">
          <span>{rating.toFixed(1)} Rating</span>
          <span className="w-[1px] h-3 bg-[#E5E5E5]" />
          <span>{reviewCount} Reviews</span>
        </div>
      </div>
      */}
    </div>
  );
};

export default ProductOfferInfo;
