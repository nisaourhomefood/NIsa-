import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateShippingFee } from '@/lib/utils/shipping';

// POST /api/orders/create — write real order + order_items to Supabase
export async function POST(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();

  const {
    customer,
    address,
    items,
    subtotal,
    discount_amount,
    discount_code,
    payment_method,
  } = body;

  // Recompute shipping server-side from the delivery pincode — never trust a client-sent fee
  const shipping = calculateShippingFee(address?.postal_code, subtotal);
  const shipping_fee = shipping.fee;
  const total_amount = Math.max(0, subtotal - (discount_amount || 0) + shipping_fee);

  // Generate a readable order number
  const orderNumber = `NISA-${Date.now().toString().slice(-8)}`;

  // 1. Upsert customer (by email)
  let customerId: string | null = null;
  if (customer?.email) {
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, total_orders, lifetime_value')
      .eq('email', customer.email)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
      // Best-effort: increment order count and lifetime value
      try {
        await supabase
          .from('customers')
          .update({
            total_orders: existingCustomer.total_orders + 1,
            lifetime_value: existingCustomer.lifetime_value + total_amount,
          })
          .eq('id', customerId);
      } catch (_) {
        // Non-critical update, ignore if fails
      }
    } else {
      const { data: newCustomer } = await supabase
        .from('customers')
        .insert({
          full_name: customer.full_name,
          email: customer.email,
          phone: customer.phone || null,
          total_orders: 1,
          lifetime_value: total_amount,
        })
        .select('id')
        .single();
      if (newCustomer) customerId = newCustomer.id;
    }
  }

  // 2. Create order
  const shippingAddress = {
    full_name: address.full_name,
    phone: address.phone,
    email: customer?.email,
    address_line1: address.address_line1,
    address_line2: address.address_line2 || null,
    city: address.city,
    state: address.state,
    postal_code: address.postal_code,
    landmark: address.landmark || null,
    country: 'India',
  };

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      guest_email: customer?.email || null,
      guest_phone: customer?.phone || null,
      status: 'placed',
      payment_status: 'pending',
      payment_method: payment_method || 'cod',
      subtotal,
      discount_amount: discount_amount || 0,
      shipping_fee: shipping_fee || 0,
      total_amount,
      shipping_address: shippingAddress,
      discount_code: discount_code || null,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  // 3. Insert order items
  const orderItems = items.map((item: {
    product_id: string;
    variant_id: string;
    name: string;
    size_label: string;
    price: number;
    quantity: number;
    image: string;
  }) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    product_name: item.name,
    variant_label: item.size_label,
    price: item.price,
    quantity: item.quantity,
    total_price: item.price * item.quantity,
    image_url: item.image || null,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    // Rollback order on item insert failure
    await supabase.from('orders').delete().eq('id', order.id);
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  return NextResponse.json({
    order_id: order.id,
    order_number: order.order_number,
    status: order.status,
  }, { status: 201 });
}
