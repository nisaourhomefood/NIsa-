import { NextResponse } from 'next/server';
import { getShopifyProducts, getShopifyProductBySlug } from '@/lib/shopify/api';

// GET /api/products — fetch products from Shopify only
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const featured = searchParams.get('featured');
  const bestseller = searchParams.get('bestseller');
  const sort = searchParams.get('sort') || 'bestseller';

  if (slug) {
    const shopifyProduct = await getShopifyProductBySlug(slug);
    return NextResponse.json(shopifyProduct);
  }

  let products = await getShopifyProducts({
    sortKey: sort === 'newest' ? 'CREATED_AT' : 'BEST_SELLING',
    reverse: sort === 'newest',
  });

  if (category && category !== 'all') {
    products = products.filter(
      (p) =>
        p.product_type?.toLowerCase() === category.toLowerCase() ||
        p.category?.slug === category
    );
  }
  if (featured === 'true') {
    products = products.filter((p) => p.featured_status);
  }
  if (bestseller === 'true') {
    products = products.filter((p) => p.bestseller_status);
  }

  return NextResponse.json(products);
}
