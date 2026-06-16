// src/constants/sizes.ts

export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
] as const;

export const ALL_SIZES = [
  'Free Size', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL',
] as const;

export const FITTING_TYPES = ['Fitted', 'Regular', 'Oversized'] as const;

export const SIZE_GUIDE_TABLE = [
  { size: 'XS', chest: '34"', waist: '28"', hip: '36"', length: '27"' },
  { size: 'S', chest: '36"', waist: '30"', hip: '38"', length: '28"' },
  { size: 'M', chest: '38"', waist: '32"', hip: '40"', length: '29"' },
  { size: 'L', chest: '40"', waist: '34"', hip: '42"', length: '29.5"' },
  { size: 'XL', chest: '42"', waist: '36"', hip: '44"', length: '30"' },
  { size: 'XXL', chest: '44"', waist: '38"', hip: '46"', length: '30.5"' },
  { size: '3XL', chest: '46"', waist: '40"', hip: '48"', length: '31"' },
];

export const PRICE_RANGE = { min: 0, max: 10000 };
