import type { Metadata } from 'next';
import { getShopifyProducts } from '@/lib/shopify/api';
import { CategoryPage } from '@/components/storefront/category-page';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nisaourhomefood.in';

export const metadata: Metadata = {
  title: 'Traditional Andhra Sweets Online',
  description:
    'Buy traditional Andhra sweets online from NISA — hand-made in Tenali with no refined sugar or artificial syrup. Shipped pan-India.',
  alternates: { canonical: '/sweets' },
};

export default async function SweetsPage() {
  const allProducts = await getShopifyProducts({ first: 250 });
  const products = allProducts.filter((p) => p.product_type === 'sweet');
  const otherProducts = allProducts.filter((p) => p.product_type !== 'sweet');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Traditional Andhra Sweets Online',
    url: `${BASE_URL}/sweets`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE_URL}/products/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <CategoryPage
        eyebrow="Tenali Sweets"
        title="Traditional Andhra Sweets"
        intro="Hand-made traditional sweets from Saraswati's kitchen in Tenali — real ingredients, no refined sugar or artificial syrup shortcuts."
        body="NISA's sweets are made the way they'd be made for a festival at home — real nuts, seeds, and natural sweeteners like palm jaggery, hand-rolled in small batches rather than mass-produced. No refined sugar, no artificial syrup, no shortcuts."
        products={products}
        otherProducts={otherProducts}
      />
    </>
  );
}
