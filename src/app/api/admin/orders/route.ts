import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/orders — fetch all orders with items
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/admin/orders — update order status or payment status
export async function PATCH(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();
  const { id, status, payment_status } = body;

  if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 });

  const updateData: Record<string, string> = { updated_at: new Date().toISOString() };
  if (status) updateData.status = status;
  if (payment_status) updateData.payment_status = payment_status;

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
