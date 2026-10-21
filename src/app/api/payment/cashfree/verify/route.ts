import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { order_id, db_order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const environment = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';

    let isPaid = false;
    let paymentDetails: any = null;

    if (appId && secretKey && appId !== 'YOUR_CASHFREE_APP_ID') {
      const baseUrl = environment === 'PRODUCTION'
        ? `https://api.cashfree.com/pg/orders/${order_id}`
        : `https://sandbox.cashfree.com/pg/orders/${order_id}`;

      const response = await fetch(baseUrl, {
        method: 'GET',
        headers: {
          'x-client-id': appId,
          'x-client-secret': secretKey,
          'x-api-version': '2023-08-01',
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.order_status === 'PAID') {
        isPaid = true;
        paymentDetails = data;
      }
    } else {
      // In demo/test mode without API keys
      isPaid = true;
    }

    if (isPaid && db_order_id) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_method: 'cashfree',
          })
          .eq('id', db_order_id);
      } catch (err) {
        console.error('Failed to update order status in Supabase:', err);
      }
    }

    return NextResponse.json({
      success: isPaid,
      order_status: isPaid ? 'PAID' : 'PENDING',
      paymentDetails,
    });
  } catch (error: unknown) {
    console.error('Cashfree verify error:', error);
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
