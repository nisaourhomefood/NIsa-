import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// POST /api/shopify/revalidate
// Triggered by Shopify Webhooks or manual trigger to revalidate product pages
export async function POST(req: Request) {
  try {
    const secret = req.headers.get('x-shopify-hmac-sha256') || req.headers.get('x-revalidation-secret');
    const expectedSecret = process.env.SHOPIFY_REVALIDATION_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ message: 'Invalid revalidation secret' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const handle = body?.handle || body?.slug;

    // Revalidate paths
    revalidatePath('/', 'layout');
    revalidatePath('/products', 'page');

    if (handle) {
      revalidatePath(`/products/${handle}`, 'page');
    }

    try {
      revalidateTag('shopify_products', 'default');
      revalidateTag('shopify_collections', 'default');
      if (handle) {
        revalidateTag(`shopify_product_${handle}`, 'default');
      }
    } catch {
      // Ignore if cache tag profiles not registered
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: `Revalidated paths for ${handle || 'all products'}`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Revalidation failed' }, { status: 500 });
  }
}
