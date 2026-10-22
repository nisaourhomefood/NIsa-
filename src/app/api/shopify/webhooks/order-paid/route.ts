import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { formatCurrency } from '@/lib/utils';
import { sendWhatsAppOrderConfirmation } from '@/lib/services/whatsapp-service';

// POST /api/shopify/webhooks/order-paid
// Registered in Shopify Admin -> Settings -> Notifications -> Webhooks
// Event: "Order payment" (or "Order creation", filtered to paid orders below), Format: JSON
//
// The moment Shopify marks an order as paid, this sends the customer an automatic
// WhatsApp order confirmation. Requires WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN
// to actually send (gracefully skipped otherwise — see whatsapp-service.ts).

function verifyShopifyWebhook(rawBody: string, hmacHeader: string | null): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !hmacHeader) return false;

  const digest = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64');

  const a = Buffer.from(digest);
  const b = Buffer.from(hmacHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

interface ShopifyLineItem {
  title: string;
  quantity: number;
}

interface ShopifyOrderPayload {
  name?: string;
  order_number?: number | string;
  financial_status?: string;
  total_price?: string;
  currency?: string;
  customer?: { first_name?: string; last_name?: string; phone?: string };
  shipping_address?: { phone?: string };
  phone?: string;
  email?: string;
  line_items?: ShopifyLineItem[];
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const hmacHeader = req.headers.get('x-shopify-hmac-sha256');

  if (!verifyShopifyWebhook(rawBody, hmacHeader)) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
  }

  let order: ShopifyOrderPayload;
  try {
    order = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Only act on orders that are actually paid (relevant if the webhook is registered
  // on "Order creation" rather than a payment-specific event).
  if (order.financial_status && order.financial_status !== 'paid') {
    return NextResponse.json({ skipped: true, reason: 'Order not paid' });
  }

  const customerName = [order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(' ') || 'there';
  const customerPhone = order.shipping_address?.phone || order.customer?.phone || order.phone || '';
  const orderNumber = order.name || String(order.order_number || '');
  const totalAmount = order.total_price ? formatCurrency(parseFloat(order.total_price)) : '';
  const itemSummary = (order.line_items || [])
    .map((item) => `${item.title} x${item.quantity}`)
    .join(', ');

  if (!customerPhone) {
    console.warn(`[Order Webhook] No phone number on order ${orderNumber}, skipping WhatsApp confirmation.`);
    return NextResponse.json({ received: true, whatsapp: { success: false, skipped: true } });
  }

  const whatsapp = await sendWhatsAppOrderConfirmation({
    customerName,
    customerPhone,
    orderNumber,
    totalAmount,
    itemSummary,
  });

  return NextResponse.json({ received: true, whatsapp });
}
