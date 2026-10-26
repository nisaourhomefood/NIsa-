import type { Metadata } from 'next';
import { ProductsPageClient } from './products-client';

export const metadata: Metadata = {
  title: 'Shop All Andhra Pickles & Podis',
  description:
    'Browse NISA\'s full catalogue of authentic Andhra non-veg pickles, podis, and sweets — boneless chicken, gongura mutton, prawns, and more, hand-cooked in Tenali and shipped pan-India.',
  alternates: { canonical: '/products' },
};

export default function ProductsPage() {
  return <ProductsPageClient />;
}
