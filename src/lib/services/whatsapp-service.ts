// WhatsApp order/shipment notifications for NISA via Meta's official WhatsApp Cloud API
// (the same API most Shopify/D2C stores integrate with, directly or via a BSP like Interakt/AiSensy).
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
//
// Requires a one-time setup in Meta Business Manager: a WhatsApp Business phone number,
// and one approved message template per message type (see each function below for its
// expected body variables). Until WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN are set,
// sends are skipped (logged only) — nothing else breaks.

export interface WhatsAppSendResult {
  success: boolean;
  skipped?: boolean;
  error?: string;
}

// Low-level sender: posts one template message to a customer's WhatsApp number.
async function sendWhatsAppTemplate(
  customerPhone: string,
  templateNameEnvVar: string,
  defaultTemplateName: string,
  bodyParams: string[],
  logLabel: string
): Promise<WhatsAppSendResult> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const templateName = process.env[templateNameEnvVar] || defaultTemplateName;
  const templateLang = process.env.WHATSAPP_TEMPLATE_LANG || 'en';

  const cleanPhone = customerPhone.replace(/\D/g, '').slice(-10);

  if (!phoneNumberId || !accessToken) {
    console.log(`[WhatsApp] Skipped ${logLabel} — WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN not configured.`);
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
              parameters: bodyParams.map((text) => ({ type: 'text', text })),
            },
          ],
        },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`[WhatsApp] Send failed (${logLabel}):`, data);
      return { success: false, error: data?.error?.message || 'WhatsApp send failed' };
    }

    return { success: true };
  } catch (err) {
    console.error(`[WhatsApp] Send error (${logLabel}):`, err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export interface WhatsAppShipmentDetails {
  customerName: string;
  customerPhone: string;
  orderNumber: string;
  courierName: string;
  awbCode: string;
  trackingUrl: string;
}

// Template "order_shipped" expected body variables: name, order number, courier, AWB, tracking link
export async function sendWhatsAppShipmentUpdate(details: WhatsAppShipmentDetails): Promise<WhatsAppSendResult> {
  return sendWhatsAppTemplate(
    details.customerPhone,
    'WHATSAPP_TEMPLATE_NAME',
    'order_shipped',
    [details.customerName, details.orderNumber, details.courierName, details.awbCode, details.trackingUrl],
    `shipment update for order ${details.orderNumber}`
  );
}

export interface WhatsAppOrderConfirmationDetails {
  customerName: string;
  customerPhone: string;
  orderNumber: string;
  totalAmount: string;
  itemSummary: string;
}

// Template "order_confirmed" expected body variables: name, order number, item summary, total paid
export async function sendWhatsAppOrderConfirmation(details: WhatsAppOrderConfirmationDetails): Promise<WhatsAppSendResult> {
  return sendWhatsAppTemplate(
    details.customerPhone,
    'WHATSAPP_ORDER_CONFIRMED_TEMPLATE_NAME',
    'order_confirmed',
    [details.customerName, details.orderNumber, details.itemSummary, details.totalAmount],
    `order confirmation for order ${details.orderNumber}`
  );
}
