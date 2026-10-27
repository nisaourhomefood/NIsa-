import type { Metadata } from 'next';
import { getShopifyProducts } from '@/lib/shopify/api';
import { CategoryPage } from '@/components/storefront/category-page';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nisaourhomefood.in';

export const metadata: Metadata = {
  title: 'Andhra Podi (Spice Powder) Online',
  description:
    'Buy authentic Andhra podis online — roasted chicken podi and traditional spice powders hand-pounded in Tenali, perfect with hot rice, ghee, dosa, or idli. Shipped pan-India.',
  alternates: { canonical: '/podis' },
};

export default async function PodisPage() {
  const allProducts = await getShopifyProducts({ first: 250 });
  const products = allProducts.filter((p) => p.product_type === 'podi');
  const otherProducts = allProducts.filter((p) => p.product_type !== 'podi');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Andhra Podi (Spice Powder) Online',
    url: `${BASE_URL}/podis`,
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
        eyebrow="Tenali Podis"
        title="Andhra Podis & Spice Powders"
        intro="Roasted, hand-pounded Andhra podis made in Tenali — the kind that turns plain hot rice, dosa, or idli into a proper meal with just a spoon of ghee."
        body="NISA's podis are roasted and ground in small batches the same way they're made at home in Tenali — dry-roasted lentils and spices, hand-pounded rather than machine-milled, with no added preservatives. They keep well for months in an airtight jar and are meant to be mixed generously with ghee or sesame oil over hot rice, or sprinkled over dosa and idli."
        seoNote="Searched across India as Andhra podi, kaaram podi, gunpowder podi, or chicken podi — these dry roasted spice powders are a Telugu kitchen staple, meant to be mixed with ghee or sesame oil over hot rice, or sprinkled over dosa and idli for an instant Andhra-style meal."
        products={products}
        otherProducts={otherProducts}
        breadcrumbLabel="Podis"
        path="/podis"
        faqs={[
          {
            q: 'Is Andhra podi the same as gunpowder or kaaram podi?',
            a: "Yes — podi (also called kaaram, or 'gunpowder' in some regions) is the dry roasted lentil-and-chili powder Andhra households mix with ghee or sesame oil over rice.",
          },
          {
            q: 'How do I eat chicken podi?',
            a: 'Mix 1–2 spoons with hot rice and a spoon of ghee or sesame oil, or sprinkle over dosa and idli. It\'s dry and ready to use straight out of the jar — no cooking needed.',
          },
          {
            q: 'Is podi spicy?',
            a: "Yes, true to Andhra style — it's roasted with dried red chilies. Start with a smaller spoon if you're not used to Andhra-level heat.",
          },
          {
            q: 'How long does podi stay fresh?',
            a: 'Being a dry roasted powder rather than an oil pickle, it keeps well for months in an airtight jar — check the specific product page for the exact shelf life.',
          },
          {
            q: 'Do you ship podi and spice powders pan-India?',
            a: 'Yes, shipped nationwide and typically arriving in 3–5 business days.',
          },
        ]}
      />
    </>
  );
}
