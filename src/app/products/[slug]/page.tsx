import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShopifyProductBySlug, getShopifyProductRecommendations } from '@/lib/shopify/api';
import { ProductDetailClient } from '@/components/storefront/product-detail-client';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nisaourhomefood.in';

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getShopifyProductBySlug(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const plainDescription = stripHtml(product.description || product.short_description || '').slice(0, 160);
  const url = `${BASE_URL}/products/${product.slug}`;
  const image = product.images[0];

  return {
    title: product.name,
    description: plainDescription || `Buy ${product.name} online from NISA — authentic small-batch Andhra food made in Tenali.`,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: plainDescription,
      url,
      type: 'website',
      images: image ? [{ url: image, width: 800, height: 600, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: plainDescription,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getShopifyProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getShopifyProductRecommendations(product.id);

  const defaultVariant = product.variants.find((v) => v.is_default) || product.variants[0];
  const url = `${BASE_URL}/products/${product.slug}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: stripHtml(product.description || product.short_description || ''),
    image: product.images,
    sku: defaultVariant?.sku,
    brand: { '@type': 'Brand', name: 'NISA' },
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: v.price,
      availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      sku: v.sku,
    })),
    ...(product.average_rating != null && product.reviews_count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.average_rating,
            reviewCount: product.reviews_count,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
