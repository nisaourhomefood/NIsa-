import { NextResponse } from 'next/server';
import { createShiprocketShipment } from '@/lib/services/delivery-service';
import { sendWhatsAppShipmentUpdate } from '@/lib/services/whatsapp-service';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { order, order_id } = await req.json();

    if (!order && !order_id) {
      return NextResponse.json({ error: 'Order data is required' }, { status: 400 });
    }

    const addr = order?.shipping_address || {};
    const items = order?.order_items || [];

    const shipmentResult = await createShiprocketShipment({
      order_id: order?.order_number || `ORD_${Date.now()}`,
      order_date: (order?.created_at ? new Date(order.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]) + ' 11:00',
      billing_customer_name: addr.full_name || 'Customer',
      billing_address: `${addr.address_line1 || ''} ${addr.address_line2 || ''}`.trim(),
      billing_city: addr.city || 'Tenali',
      billing_pincode: addr.postal_code || '522201',
      billing_state: addr.state || 'Andhra Pradesh',
      billing_country: 'India',
      billing_email: order?.guest_email || 'nisaourhomefood@gmail.com',
      billing_phone: addr.phone || order?.guest_phone || '7569344938',
      shipping_is_billing: true,
      order_items: items.map((i: any) => ({
        name: i.product_name || 'Andhra Pickle Jar',
        sku: `NISA-${i.variant_label || '250G'}`,
        units: i.quantity || 1,
        selling_price: i.price || 349,
      })),
      payment_method: order?.payment_method === 'cod' ? 'COD' : 'Prepaid',
      sub_total: order?.total_amount || 428,
      length: 15,
      breadth: 12,
      height: 10,
      weight: Math.max(0.5, items.reduce((sum: number, it: any) => sum + (it.quantity || 1) * 0.35, 0)),
    });

    // Update order status in Supabase
    if (order_id || order?.id) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from('orders')
          .update({
            status: 'shipped',
          })
          .eq('id', order_id || order?.id);
      } catch (e) {
        console.error('Supabase update status failed:', e);
      }
    }

    // Notify the customer on WhatsApp with tracking details (no-op until Meta credentials are configured)
    let whatsapp: { success: boolean; skipped?: boolean; error?: string } = { success: false, skipped: true };
    if (shipmentResult.success) {
      whatsapp = await sendWhatsAppShipmentUpdate({
        customerName: addr.full_name || 'Customer',
        customerPhone: addr.phone || order?.guest_phone || '',
        orderNumber: order?.order_number || String(order_id || ''),
        courierName: shipmentResult.courier_name,
        awbCode: shipmentResult.awb_code,
        trackingUrl: shipmentResult.tracking_url,
      });
    }

    return NextResponse.json({
      success: true,
      shipment: shipmentResult,
      whatsapp,
    });
  } catch (error: unknown) {
    console.error('Shipment generation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create shipment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
