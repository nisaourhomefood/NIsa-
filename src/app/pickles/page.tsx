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
  const otherProducts = allProducts.filter((p) => p.product_type !== 'non-veg-pickle');

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
        seoNote="Often searched for as Andhra achar, Telugu-style non-veg pickle, or simply 'chicken pickle online' — NISA's jars are cooked in Tenali, in Guntur district, the belt known for Guntur red chili and traditional Andhra non-veg pickle making. Whether you're after boneless chicken pickle, gongura chicken or mutton pickle, or prawns pickle made without vinegar or artificial preservatives, each jar is cooked the way it's made at home."
        products={products}
        otherProducts={otherProducts}
        breadcrumbLabel="Pickles"
        path="/pickles"
        faqs={[
          {
            q: "Is NISA's non-veg pickle made with oil or vinegar?",
            a: "Oil-based, using cold wood-pressed sesame oil (nuvvula nune) — no vinegar, no chemical preservatives. This is the traditional Andhra method, not the vinegar-based pickling used in many commercial brands.",
          },
          {
            q: 'How spicy are Andhra non-veg pickles?',
            a: "Made with hand-pounded Guntur red chilies, true to Andhra style they lean spicier than most Indian pickles. If you're new to Andhra heat, start with a smaller spoon mixed into hot rice.",
          },
          {
            q: 'Is the chicken or mutton pickle ready to eat, or does it need cooking?',
            a: "Ready to eat straight from the jar — it's already slow-cooked in the brass Uruli before jarring, so it just needs a spoon over hot rice, dosa, or parathas.",
          },
          {
            q: 'Do you ship non-veg pickles pan-India?',
            a: 'Yes — every jar is oil-sealed and shipped nationwide, typically arriving in 3–5 business days.',
          },
          {
            q: "What's the difference between boneless chicken pickle and gongura chicken pickle?",
            a: 'Boneless chicken pickle is pure meat in sesame-oil masala; gongura versions add the tangy sorrel-leaf (gongura) paste Andhra is known for, cutting through the richness of the meat.',
          },
        ]}
      />
    </>
  );
}
