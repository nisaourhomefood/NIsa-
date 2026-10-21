// WhatsApp shipment notifications for NISA via Meta's official WhatsApp Cloud API
// (the same API most Shopify/D2C stores integrate with, directly or via a BSP like Interakt/AiSensy).
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
//
// Requires a one-time setup in Meta Business Manager: a WhatsApp Business phone number
// and one approved message template (e.g. "order_shipped" with 5 body variables — see below).
// Until WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN are set, sends are skipped (logged only).

export interface WhatsAppShipmentDetails {
  customerName: string;
  customerPhone: string;
  orderNumber: string;
  courierName: string;
  awbCode: string;
  trackingUrl: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  skipped?: boolean;
  error?: string;
}

export async function sendWhatsAppShipmentUpdate(details: WhatsAppShipmentDetails): Promise<WhatsAppSendResult> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'order_shipped';
  const templateLang = process.env.WHATSAPP_TEMPLATE_LANG || 'en';

  const cleanPhone = details.customerPhone.replace(/\D/g, '').slice(-10);

  if (!phoneNumberId || !accessToken) {
    console.log(`[WhatsApp] Skipped for order ${details.orderNumber} — WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN not configured.`);
    return { success: false, skipped: true };
  }

  if (cleanPhone.length !== 10) {
    return { success: false, error: 'Invalid customer phone number' };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: `91${cleanPhone}`,
        type: 'template',
        template: {
          name: templateName,
          language: { code: templateLang },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: details.customerName },
                { type: 'text', text: details.orderNumber },
                { type: 'text', text: details.courierName },
                { type: 'text', text: details.awbCode },
                { type: 'text', text: details.trackingUrl },
              ],
            },
          ],
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[WhatsApp] Send failed:', data);
      return { success: false, error: data?.error?.message || 'WhatsApp send failed' };
    }

    return { success: true };
  } catch (err) {
    console.error('[WhatsApp] Send error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
