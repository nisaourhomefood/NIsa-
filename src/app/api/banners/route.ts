import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/banners — public read of active homepage banners, for the storefront carousel
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('cms_banners')
    .select('id, title, subtitle, cta_text, cta_link, image_url, bg_color')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data || []);
}
