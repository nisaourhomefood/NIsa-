import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/banners
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('cms_banners')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/admin/banners — create banner
export async function POST(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('cms_banners')
    .insert({
      title: body.title || '',
      subtitle: body.subtitle || '',
      cta_text: body.cta_text || 'Shop Now',
      cta_link: body.cta_link || '/products',
      image_url: body.image_url || '',
      bg_color: body.bg_color || '#1C0A08',
      sort_order: body.sort_order || 0,
      active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/admin/banners — update or toggle active
export async function PATCH(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { data, error } = await supabase
    .from('cms_banners')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/admin/banners
export async function DELETE(req: Request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { error } = await supabase.from('cms_banners').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
