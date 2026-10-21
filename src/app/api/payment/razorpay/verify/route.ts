import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id,
    } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let isValid = true;

    // Verify cryptographic signature if secret is configured
    if (keySecret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    // Update order status in Supabase if order_id is passed
    if (order_id) {
      const supabase = createAdminClient();
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          payment_method: 'razorpay',
        })
        .eq('id', order_id);
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id || `pay_${Date.now()}`,
      status: 'paid',
    });
  } catch (error: unknown) {
    console.error('Razorpay verification error:', error);
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
