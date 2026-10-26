import type { Metadata } from 'next';
import { getShopifyProducts } from '@/lib/shopify/api';
import { CategoryPage } from '@/components/storefront/category-page';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nisaourhomefood.in';

export const metadata: Metadata = {
  title: 'Andhra Non-Veg Pickles Online',
  description:
    'Buy authentic Andhra non-veg pickles online — boneless chicken, gongura mutton, prawns and more, hand-cooked in small batches in Tenali with wood-pressed sesame oil. Shipped pan-India.',
  alternates: { canonical: '/pickles' },
};

export default async function PicklesPage() {
  const allProducts = await getShopifyProducts({ first: 250 });
  const products = allProducts.filter((p) => p.product_type === 'non-veg-pickle');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Andhra Non-Veg Pickles Online',
    url: `${BASE_URL}/pickles`,
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
        eyebrow="Tenali Pickles"
        title="Andhra Non-Veg Pickles"
        intro="Boneless chicken, gongura mutton, prawns, and more — hand-cooked in small 5kg brass Uruli batches using wood-pressed sesame oil, Guntur red chilies, and zero artificial preservatives."
        body="Every NISA pickle starts the same way: fresh meat, pure cold wood-pressed sesame oil (nuvvula nune), and hand-pounded Guntur red chilies, slow-cooked in small batches in Saraswati's home kitchen in Tenali, Andhra Pradesh. No commercial vinegar, no chemical preservatives — just the traditional recipe passed down through the family, oil-sealed in jars and shipped fresh across India within 24 hours of cooking."
        products={products}
      />
    </>
  );
}
