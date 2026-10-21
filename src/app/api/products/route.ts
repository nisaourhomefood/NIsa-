import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isShopifyConfigured, getShopifyProducts, getShopifyProductBySlug } from '@/lib/shopify/api';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-products';

// GET /api/products — fetch products dynamically from Shopify (or Supabase / mock fallback)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const featured = searchParams.get('featured');
  const bestseller = searchParams.get('bestseller');
  const sort = searchParams.get('sort') || 'bestseller';

  // 1. Try Shopify Storefront API if configured
  if (isShopifyConfigured()) {
    try {
      if (slug) {
        const shopifyProduct = await getShopifyProductBySlug(slug);
        if (shopifyProduct) {
          return NextResponse.json(shopifyProduct);
        }
      } else {
        let products = await getShopifyProducts({
          sortKey: sort === 'newest' ? 'CREATED_AT' : 'BEST_SELLING',
          reverse: sort === 'newest',
        });

        if (products && products.length > 0) {
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
      }
    } catch (shopifyErr) {
      console.warn('[API /api/products] Shopify fetch failed, falling back to Supabase:', shopifyErr);
    }
  }

  // 2. Fallback to Supabase
  try {
    const supabase = createAdminClient();

    let query = supabase
      .from('products')
      .select('*, product_variants(*), categories(id,name,slug)')
      .eq('active_status', true);

    if (slug) {
      query = query.eq('slug', slug);
    }
    if (category && category !== 'all') {
      query = query.eq('categories.slug', category);
    }
    if (featured === 'true') {
      query = query.eq('featured_status', true);
    }
    if (bestseller === 'true') {
      query = query.eq('bestseller_status', true);
    }

    if (sort === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      // Normalize variants and category fields
      const formatted = data.map((p: any) => ({
        ...p,
        variants: Array.isArray(p.product_variants) && p.product_variants.length > 0
          ? p.product_variants.sort((a: any, b: any) => a.weight_g - b.weight_g)
          : [
              {
                id: `var-${p.id}-250`,
                product_id: p.id,
                size_label: '250g',
                weight_g: 250,
                price: 349,
                compare_at_price: 399,
                stock: 30,
                is_default: true,
              },
            ],
        category: p.categories || null,
      }));

      if (slug) {
        return NextResponse.json(formatted[0] || null);
      }

      return NextResponse.json(formatted);
    }
  } catch (err: any) {
    console.error('API /api/products Supabase failure:', err);
  }

  // 3. Fallback to Mock Data
  if (slug) {
    const mock = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    return NextResponse.json(mock || null);
  }

  let result = [...INITIAL_PRODUCTS];
  if (category && category !== 'all') {
    result = result.filter((p) => p.product_type === category);
  }
  if (featured === 'true') {
    result = result.filter((p) => p.featured_status);
  }
  if (bestseller === 'true') {
    result = result.filter((p) => p.bestseller_status);
  }

  return NextResponse.json(result);
}
