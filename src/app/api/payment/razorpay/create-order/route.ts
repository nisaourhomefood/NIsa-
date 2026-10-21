import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: Request) {
  try {
    const { amount, receipt, notes } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Convert amount to paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // If real credentials are provided, create official Razorpay order
    if (keyId && keySecret) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rec_${Date.now().toString().slice(-8)}`,
        notes: notes || {},
      };

      const order = await razorpay.orders.create(options);

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        isSandbox: false,
      });
    }

    // Fallback/Sandbox mode if env keys haven't been added yet
    const mockOrderId = `order_demo_${Date.now()}`;
    return NextResponse.json({
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_placeholder',
      isSandbox: true,
    });
  } catch (error: unknown) {
    console.error('Razorpay order creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create payment order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
