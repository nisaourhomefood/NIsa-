import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

interface OrderForCustomer {
  customer_id: string | null;
  shipping_address: { city?: string; state?: string; postal_code?: string } | null;
  payment_method: string;
  payment_status: string;
}

// GET /api/admin/customers — fetch all customers, enriched with location + WhatsApp lead status
export async function GET() {
  const supabase = createAdminClient();

  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json([], { status: 200 });

  const { data: orders } = await supabase
    .from('orders')
    .select('customer_id, shipping_address, payment_method, payment_status')
    .order('created_at', { ascending: false });

  const ordersByCustomer = new Map<string, OrderForCustomer[]>();
  ((orders as OrderForCustomer[]) || []).forEach((o) => {
    if (!o.customer_id) return;
    const list = ordersByCustomer.get(o.customer_id) || [];
    list.push(o);
    ordersByCustomer.set(o.customer_id, list);
  });

  const enriched = (customers || []).map((c) => {
    const custOrders = ordersByCustomer.get(c.id) || [];
    const latestAddress = custOrders[0]?.shipping_address;
    const isWhatsAppLead = custOrders.some((o) => o.payment_method === 'upi');
    const converted = custOrders.some((o) => o.payment_method === 'upi' && o.payment_status === 'paid');

    return {
      ...c,
      city: latestAddress?.city || null,
      state: latestAddress?.state || null,
      postal_code: latestAddress?.postal_code || null,
      source: isWhatsAppLead ? 'WhatsApp' : 'Cashfree',
      converted,
    };
  });

  return NextResponse.json(enriched);
}

// DELETE /api/admin/customers — delete customer records (all or specific)
export async function DELETE(req: Request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id === 'all') {
    const { error } = await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: 'All customers cleared' });
  }

  if (id) {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Missing customer id' }, { status: 400 });
}
