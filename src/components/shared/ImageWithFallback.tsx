'use client';
// src/components/shared/ImageWithFallback.tsx
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
  alt: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc = '/images/placeholder-product.webp',
  alt,
  ...props
}: ImageWithFallbackProps) {
  // Only show fallback if src is empty/undefined, not for valid URLs that fail
  const [imgSrc, setImgSrc] = useState(src && src.trim() ? src : fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && src && src.trim()) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
