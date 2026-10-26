import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { calculateShippingFee } from '@/lib/utils/shipping';
import { getShopifyVariantPrices } from '@/lib/shopify/api';

export async function POST(req: Request) {
  try {
    const { amount, customer, items, discount_code, order_id, address } = await req.json();

    let validatedAmount = amount;

    // Security: Recalculate price on the server if items are provided to prevent client-side price tampering
    if (Array.isArray(items) && items.length > 0) {
      const variantIds = items.map((item) => item.variant_id).filter(Boolean);
      const realPrices = await getShopifyVariantPrices(variantIds);

      let calculatedSubtotal = 0;

      for (const item of items) {
        const itemPrice = realPrices.get(item.variant_id) ?? item.price;
        if (!itemPrice) {
          return NextResponse.json({ error: `Could not verify price for item ${item.variant_id}` }, { status: 400 });
        }
        calculatedSubtotal += itemPrice * (item.quantity || 1);
      }

      let discountVal = 0;
      if (discount_code) {
        try {
          const supabase = createAdminClient();
          const { data: promo } = await supabase
            .from('discounts')
            .select('*')
            .eq('code', discount_code.toUpperCase().trim())
            .eq('active', true)
            .single();

          if (promo && calculatedSubtotal >= promo.min_order_amount) {
            discountVal = promo.discount_type === 'percentage'
              ? Math.round((calculatedSubtotal * promo.value) / 100)
              : promo.value;
          }
        } catch {
          // fallback if discount check fails
        }
      }

      const shipping = calculateShippingFee(address?.postal_code, calculatedSubtotal);
      validatedAmount = Math.max(1, calculatedSubtotal - discountVal + shipping.fee);
    }

    if (!validatedAmount || validatedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const environment = process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION';

    const orderId = order_id || `nisa_${Date.now().toString().slice(-8)}`;
    const cleanPhone = (customer?.phone || '7569344938').replace(/\D/g, '').slice(-10);
    const cleanCustomerId = (customer?.email || `cust_${cleanPhone}`).replace(/[^a-zA-Z0-9_-]/g, '_');

    // 1. Production or Sandbox Cashfree Orders API
    if (appId && secretKey && appId !== 'YOUR_CASHFREE_APP_ID') {
      const baseUrl = environment === 'PRODUCTION'
        ? 'https://api.cashfree.com/pg/orders'
        : 'https://sandbox.cashfree.com/pg/orders';

      const payload = {
        order_id: orderId,
        order_amount: Number(validatedAmount.toFixed(2)),
        order_currency: 'INR',
        customer_details: {
          customer_id: cleanCustomerId,
          customer_name: (customer?.full_name || 'Customer').trim(),
          customer_email: (customer?.email || 'nisaourhomefood@gmail.com').trim(),
          customer_phone: cleanPhone.length === 10 ? cleanPhone : '7569344938',
        },
        order_meta: {
          notify_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nisaourhomefood.in'}/api/payment/cashfree/webhook`,
        },
        order_note: 'Authentic Small-Batch Andhra Food - NISA Tenali',
      };

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'x-client-id': appId,
          'x-client-secret': secretKey,
          'x-api-version': '2023-08-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Cashfree order creation error:', data);
        return NextResponse.json({
          error: data.message || 'Cashfree gateway error. Please verify your merchant account settings.',
        }, { status: response.status });
      }

      return NextResponse.json({
        order_id: data.order_id,
        payment_session_id: data.payment_session_id,
        environment: environment.toLowerCase(),
        isSandbox: environment !== 'PRODUCTION',
        validatedAmount,
      });
    }

    // 2. Demo mode
    return NextResponse.json({
      order_id: orderId,
      payment_session_id: `session_demo_${Date.now()}`,
      environment: 'sandbox',
      isSandbox: true,
      demoMode: true,
      validatedAmount,
    });
  } catch (error: unknown) {
    console.error('Cashfree create-order error:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
