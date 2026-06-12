// src/types/product.types.ts

import { Category } from './category.types';

export type SizeOption =
  | 'Free Size'
  | 'XXS'
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | '3XL';

export type FittingType = 'Fitted' | 'Regular' | 'Relaxed' | 'Oversized';

export type MediaType =
  | 'catalogue'
  | 'model'
  | 'fabric_closeup'
  | 'faoo_focus'
  | 'irl'
  | 'video';

export interface ProductUSP {
  text: string;
  iconUrl: string;
}

export interface ProductMedia {
  _id: string;
  url: string;
  publicId: string;
  mediaType: MediaType;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ModelInfo {
  modelName: string;
  sizeWearing: string;
  height: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  productNote: string;
  price: number;
  category: Category;
  subCategory: Category;
  usps: ProductUSP[];
  media: ProductMedia[];
  modelInfo: string;
  isActive: boolean;
  isLimitedEdition: boolean;
  isNewCollection: boolean;
  launchedAt: string;
  averageRating: number;
  totalReviews: number;
  deliveryTimeline: string;
  isCODAvailable: boolean;
  isFreeShipping: boolean;
  sizesAvailable: SizeOption[];
  createdAt: string;
}

export interface ProductVariant {
  _id: string;
  productId: string;
  color: string;
  colorHex: string;
  size: SizeOption;
  fittingType: FittingType;
  sku: string;
  stockQuantity: number;
  price: number | null;
  isActive: boolean;
}

export interface Review {
  _id: string;
  userId: { _id: string; fullName: string; profileIcon: string };
  productId: string;
  rating: number;
  title: string;
  comment: string;
  media: { url: string; publicId: string }[];
  publishedAt: string;
}

export interface ProductDetailResponse {
  product: Product;
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface ProductCard {
  _id: string;
  name: string;
  slug: string;
  price: number;
  isAvailable?: boolean;
  isLimitedEdition: boolean;
  isNewCollection: boolean;
  tags?: string[];
  primaryImage: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  sizesAvailable: SizeOption[];
  isFreeShipping: boolean;
  isCODAvailable: boolean;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subCategory?: string;
  size?: string;
  color?: string;
  fittingType?: FittingType;
  minPrice?: number;
  maxPrice?: number;
  isLimitedEdition?: boolean;
  isNewCollection?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}

export interface SelectedVariantState {
  selectedColor: string | null;
  selectedSize: SizeOption | null;
  selectedFitting: FittingType | null;
  currentVariant: ProductVariant | null;
}
