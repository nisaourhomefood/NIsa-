// Builds the customer -> store WhatsApp order message for NISA (Tenali Kitchen).
// Pre-fills order details, calculated pincode shipping fee, customer details & UPI instructions.
// 100% Prepaid Order Flow — Live courier tracking link sent to customer within 48 hours.

import { formatCurrency } from '@/lib/utils';

export interface WhatsAppOrderItem {
  name: string;
  size_label: string;
  price: number;
  quantity: number;
}

export interface WhatsAppOrderAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface WhatsAppOrderDetails {
  orderNumber: string;
  items: WhatsAppOrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  shippingZoneLabel: string;
  totalAmount: number;
  address: WhatsAppOrderAddress;
}

export function buildWhatsAppOrderMessage(details: WhatsAppOrderDetails): string {
  const upiId = process.env.NEXT_PUBLIC_STORE_UPI_ID || '7569344938@ybl';

  const itemLines = details.items
    .map((item) => `• ${item.name} (${item.size_label}) × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}`)
    .join('\n');

  const addressLines = [
    details.address.address_line1,
    details.address.address_line2 || null,
    details.address.landmark ? `Near: ${details.address.landmark}` : null,
    `${details.address.city}, ${details.address.state} — ${details.address.postal_code}`,
  ]
    .filter(Boolean)
    .join('\n');

  const lines = [
    '🛒 *New Order — NISA Authentic Pickles (Tenali)*',
    '━━━━━━━━━━━━━━━━━━━━━',
    `📦 *Order ID:* ${details.orderNumber}`,
    '',
    '*Ordered Items:*',
    itemLines,
    '',
    `*Subtotal:* ${formatCurrency(details.subtotal)}`,
    details.discountAmount > 0 ? `*Coupon Savings:* -${formatCurrency(details.discountAmount)}` : null,
    `*Delivery (${details.shippingZoneLabel}):* ${details.shippingFee === 0 ? 'FREE' : formatCurrency(details.shippingFee)}`,
    `*Total Payable:* ${formatCurrency(details.totalAmount)}`,
    '',
    '📍 *Delivery Address:*',
    details.address.full_name,
    addressLines,
    `📞 ${details.address.phone}`,
    '',
    '💳 *Payment Method: 100% Prepaid via UPI*',
    `👉 *Pay ${formatCurrency(details.totalAmount)} to UPI:* ${upiId}`,
    '(Google Pay / PhonePe / Paytm / BHIM UPI)',
    '━━━━━━━━━━━━━━━━━━━━━',
    '✅ *Next Steps:*',
    '1. Please reply here with your *Payment Screenshot*.',
    '2. Saraswati will prepare and oil-seal your fresh batch in Tenali.',
    '3. Your *Courier Tracking ID* will be shared right here within 48 hours for live tracking.',
  ];

  return lines.filter((line) => line !== null).join('\n');
}

export function getStoreWhatsAppLink(message: string): string {
  const storeNumber = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '917569344938';
  return `https://wa.me/${storeNumber}?text=${encodeURIComponent(message)}`;
}
