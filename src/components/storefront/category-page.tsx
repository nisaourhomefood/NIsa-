import Link from 'next/link';
import { PackageX } from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductWithVariants } from '@/types/database.types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.nisaourhomefood.in';

interface FaqItem {
  q: string;
  a: string;
}

interface CategoryPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  seoNote?: string;
  products: ProductWithVariants[];
  otherProducts: ProductWithVariants[];
  faqs?: FaqItem[];
  breadcrumbLabel: string;
  path: string;
}

// Centered auto-fit grid: a category with 1–2 items never leaves a wall of dead
// whitespace the way a fixed grid-cols-4 does — the row only takes the width it needs.
const PRODUCT_GRID_CLASS = 'grid gap-2.5 sm:gap-5 justify-center';
const PRODUCT_GRID_STYLE = { gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 230px))' };

export function CategoryPage({
  eyebrow,
  title,
  intro,
  body,
  seoNote,
  products,
  otherProducts,
  faqs,
  breadcrumbLabel,
  path,
}: CategoryPageProps) {
  // A category with very few items reads as a dead end on its own — fill the rest of the
  // page with the rest of the catalogue so there's always something to browse next.
  const showMore = products.length < 4 && otherProducts.length > 0;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: breadcrumbLabel, item: `${BASE_URL}${path}` },
    ],
  };

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <div className="bg-[#FAF6F0] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-xs text-stone-500 font-medium">
        <Link href="/" className="hover:text-[#8B1E10]">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-stone-800 font-bold">{breadcrumbLabel}</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-6 text-center space-y-3">
        <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest">{eyebrow}</span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">{title}</h1>
        <p className="text-sm text-stone-600 font-medium max-w-2xl mx-auto">{intro}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {products.length === 0 ? (
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-10 text-center space-y-3 max-w-md mx-auto">
            <PackageX className="w-10 h-10 text-[#8B1E10] mx-auto" />
            <h3 className="text-base font-bold text-stone-900">Nothing listed here right now</h3>
            <p className="text-xs text-stone-500">Check back soon, or browse the full catalogue.</p>
            <Link href="/products" className="inline-block bg-[#8B1E10] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl">
              View Full Catalogue
            </Link>
          </div>
        ) : (
          <div className={PRODUCT_GRID_CLASS} style={PRODUCT_GRID_STYLE}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 space-y-4">
        <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 sm:p-8 text-sm text-stone-700 leading-relaxed font-medium">
          {body}
        </div>
        {seoNote && (
          <div className="text-xs text-stone-500 leading-relaxed font-medium px-1">
            {seoNote}
          </div>
        )}
      </div>

      {faqs && faqs.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white border border-[#E8DFC9] rounded-xl p-5">
                <h3 className="text-sm font-extrabold text-stone-900">{f.q}</h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1.5">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showMore && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">More From NISA</h2>
          <div className={PRODUCT_GRID_CLASS} style={PRODUCT_GRID_STYLE}>
            {otherProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center pt-2">
            <Link href="/products" className="inline-block bg-white border border-[#E8DFC9] text-stone-900 text-xs font-extrabold px-5 py-2.5 rounded-xl hover:border-[#8B1E10]/40">
              View Full Catalogue
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
