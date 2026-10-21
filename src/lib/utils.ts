import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in INR (₹)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate percentage discount
 */
export function calculateDiscountPercentage(compareAtPrice: number, currentPrice: number): number {
  if (!compareAtPrice || compareAtPrice <= currentPrice) return 0;
  return Math.round(((compareAtPrice - currentPrice) / compareAtPrice) * 100);
}

/**
 * Generate unique order number (e.g. NISA-89412)
 */
export function generateOrderNumber(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  return `NISA-${random}`;
}

/**
 * Format slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Estimate Delivery Date (3-5 business days across India)
 */
export function getEstimatedDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 4);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
