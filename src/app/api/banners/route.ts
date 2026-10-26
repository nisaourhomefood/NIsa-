import { NextResponse } from 'next/server';
import { getShopifyBanners } from '@/lib/shopify/api';

// GET /api/banners — public read of homepage hero banners, managed in Shopify
// Admin as "hero_banner" Metaobject entries. Empty array falls back to the
// site's 3 built-in defaults (see banner-carousel.tsx).
export async function GET() {
  const banners = await getShopifyBanners();
  return NextResponse.json(banners);
}
