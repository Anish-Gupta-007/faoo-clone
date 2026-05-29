'use client';
// src/components/shared/HeartButton.tsx
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/cn';

interface HeartButtonProps {
  productId: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function HeartButton({ productId, size = 'md', className }: HeartButtonProps) {
  const router = useRouter();
  const { isInWishlist, toggle } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const inWishlist = isInWishlist(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save to wishlist');
      router.push('/login');
      return;
    }

    await toggle(productId);
    const added = !inWishlist;
    toast.success(added ? 'Added to wishlist' : 'Removed from wishlist');
    if (added) {
      router.push('/account/wishlist');
    }
  };

  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={cn(
        'flex items-center justify-center rounded-none transition-all duration-300',
        size === 'sm' ? 'w-8 h-8' : 'w-10 h-10',
        className
      )}
    >
      <Heart
        size={iconSize}
        strokeWidth={1.5}
        className={cn(
          'transition-all duration-300',
          inWishlist ? 'fill-[#8b0026] stroke-[#8b0026] scale-110' : 'stroke-[#151515] fill-none group-hover:stroke-[#8b0026]'
        )}
      />
    </motion.button>
  );
}
