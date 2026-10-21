import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const timestamp = req.headers.get('x-webhook-timestamp');
    const secretKey = process.env.CASHFREE_SECRET_KEY;

    // Verify webhook signature if secret key is present
    if (secretKey && signature && timestamp) {
      const signaturePayload = `${timestamp}${rawBody}`;
      const expectedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(signaturePayload)
        .digest('base64');

      if (signature !== expectedSignature) {
        console.warn('Invalid Cashfree webhook signature received');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type;
    const orderData = payload.data?.order;
    const paymentData = payload.data?.payment;

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK' || paymentData?.payment_status === 'SUCCESS') {
      const orderId = orderData?.order_id || payload.data?.order_id;
      if (orderId) {
        try {
          const supabase = createAdminClient();
          await supabase
            .from('orders')
            .update({
              payment_status: 'paid',
              payment_method: 'cashfree',
            })
            .eq('order_number', orderId);
        } catch (err) {
          console.error('Error updating order on webhook:', err);
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Cashfree webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
