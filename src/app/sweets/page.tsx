import type { Metadata } from 'next';
import { getShopifyProducts } from '@/lib/shopify/api';
import { CategoryPage } from '@/components/storefront/category-page';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.nisaourhomefood.in';

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
        seoNote="Looking for Andhra traditional sweets online, Tenali sweets, or a laddu made without refined sugar? NISA's sweets are rolled in small batches using real nuts, seeds, and jaggery — the way Saraswati's kitchen in Tenali has always made them for festivals."
        products={products}
        otherProducts={otherProducts}
        breadcrumbLabel="Sweets"
        path="/sweets"
        faqs={[
          {
            q: 'Are NISA sweets made with refined sugar?',
            a: 'No — natural sweeteners like palm jaggery are used instead of refined sugar or artificial syrup.',
          },
          {
            q: 'Do your sweets contain preservatives?',
            a: "No artificial preservatives — they're made fresh in small batches rather than mass-produced for a long shelf life, so check the product page for how soon to eat them by.",
          },
          {
            q: 'What goes into the Nut & Seed Laddu?',
            a: 'Real nuts and seeds hand-rolled in small batches — see the exact ingredient list on the product page, since it can vary slightly by batch.',
          },
          {
            q: 'Do you ship sweets pan-India?',
            a: 'Yes, shipped nationwide and typically arriving in 3–5 business days.',
          },
        ]}
      />
    </>
  );
}
