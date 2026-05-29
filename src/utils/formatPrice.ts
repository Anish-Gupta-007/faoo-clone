// src/utils/formatPrice.ts

/**
 * Formats a number to Indian Rupee format: ₹1,899/-
 */
export function formatPrice(price: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return `${formatted}/-`;
}

/**
 * Formats a number to plain INR string without suffix: ₹1,899
 */
export function formatPricePlain(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
