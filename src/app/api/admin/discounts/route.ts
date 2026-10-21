import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/discounts
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/admin/discounts — create new discount
export async function POST(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('discounts')
    .insert({
      code: body.code.toUpperCase().trim(),
      discount_type: body.discount_type,
      value: body.value,
      min_order_amount: body.min_order_amount || 0,
      active: true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/admin/discounts — toggle active status
export async function PATCH(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { data, error } = await supabase
    .from('discounts')
    .update({ active: body.active })
    .eq('id', body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
