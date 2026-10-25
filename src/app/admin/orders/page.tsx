'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle2, Truck, Package, Clock, XCircle, RefreshCw, ExternalLink, MessageSquare, BadgeCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  product_name: string;
  variant_label: string;
  price: number;
  quantity: number;
  total_price: number;
}

interface Order {
  id: string;
  order_number: string;
  guest_email: string | null;
  guest_phone: string | null;
  status: OrderStatus;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  shipping_address: Record<string, string>;
  discount_code: string | null;
  created_at: string;
  order_items: OrderItem[];
  awb_code?: string;
  tracking_url?: string;
  courier_name?: string;
}

const STATUS_COLORS: Record<string, string> = {
  placed: 'bg-stone-100 text-stone-700 border-stone-200',
  confirmed: 'bg-blue-50 text-blue-900 border-blue-200',
  preparing: 'bg-amber-50 text-amber-900 border-amber-200',
  packed: 'bg-purple-50 text-purple-900 border-purple-200',
  shipped: 'bg-indigo-50 text-indigo-900 border-indigo-200',
  delivered: 'bg-emerald-50 text-emerald-900 border-emerald-200',
  cancelled: 'bg-red-50 text-red-900 border-red-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [shippingLoadingId, setShippingLoadingId] = useState<string | null>(null);
  const [shipmentResults, setShipmentResults] = useState<Record<string, any>>({});

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingId(null);
  };

  const markAsPaid = async (orderId: string) => {
    setUpdatingId(orderId);
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, payment_status: 'paid' }),
    });
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, payment_status: 'paid' } : o))
      );
    }
    setUpdatingId(null);
  };

  const getCustomerWhatsAppLink = (order: Order) => {
    const addr = order.shipping_address || {};
    const phone = (addr.phone || order.guest_phone || '').replace(/\D/g, '').slice(-10);
    const shipment = shipmentResults[order.id];

    const message = shipment
      ? `Hi ${addr.full_name || 'there'}! Your NISA order ${order.order_number} has shipped 📦\nCourier: ${shipment.courier_name}\nAWB: ${shipment.awb_code}\nTrack here: ${shipment.tracking_url}`
      : order.awb_code
      ? `Hi ${addr.full_name || 'there'}! Your NISA order ${order.order_number} has shipped 📦\nCourier: ${order.courier_name || 'Our courier partner'}\nAWB: ${order.awb_code}\nTrack here: ${order.tracking_url || ''}`
      : `Hi ${addr.full_name || 'there'}! This is NISA Foods regarding your order ${order.order_number}.`;

    return `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleBookShipment = async (order: Order) => {
    setShippingLoadingId(order.id);
    try {
      const res = await fetch('/api/admin/delivery/create-shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, order_id: order.id }),
      });

      const data = await res.json();
      if (data.success && data.shipment) {
        setShipmentResults((prev) => ({ ...prev, [order.id]: data.shipment }));
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, status: 'shipped' } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
    setShippingLoadingId(null);
  };

  const filteredOrders = orders.filter((o) =>
    activeTab === 'all' ? true : o.status === activeTab
  );

  // WhatsApp lead funnel — every "Order via WhatsApp" click creates a pending order here,
  // but not everyone who messages actually pays, so track leads vs. paid conversions separately.
  const whatsappLeads = orders.filter((o) => o.payment_method === 'upi');
  const whatsappConverted = whatsappLeads.filter((o) => o.payment_status === 'paid');
  const whatsappConversionRate = whatsappLeads.length > 0
    ? Math.round((whatsappConverted.length / whatsappLeads.length) * 100)
    : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Order Fulfillment ({orders.length})
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
            WhatsApp UPI checkout orders only. Orders paid via the main Shopify checkout button
            appear in Shopify Admin → Orders, not here.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#8B1E10] hover:text-[#72160B] border border-[#8B1E10]/30 rounded-xl px-3.5 py-2 w-full sm:w-auto bg-white"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Orders
        </button>
      </div>

      {/* WhatsApp Lead Funnel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wide">WhatsApp Leads</p>
          <p className="text-lg sm:text-2xl font-extrabold text-stone-900 mt-0.5">{whatsappLeads.length}</p>
          <p className="text-[10px] text-stone-400 font-medium">People who reached checkout via WhatsApp</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wide">Converted (Paid)</p>
          <p className="text-lg sm:text-2xl font-extrabold text-emerald-700 mt-0.5">{whatsappConverted.length}</p>
          <p className="text-[10px] text-stone-400 font-medium">Confirmed payment on WhatsApp</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wide">Just Messaged</p>
          <p className="text-lg sm:text-2xl font-extrabold text-amber-700 mt-0.5">{whatsappLeads.length - whatsappConverted.length}</p>
          <p className="text-[10px] text-stone-400 font-medium">Opened WhatsApp, haven&apos;t paid yet</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-wide">Conversion Rate</p>
          <p className="text-lg sm:text-2xl font-extrabold text-[#8B1E10] mt-0.5">{whatsappConversionRate}%</p>
          <p className="text-[10px] text-stone-400 font-medium">Leads who actually paid</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar">
        {['all', 'placed', 'confirmed', 'preparing', 'packed', 'shipped', 'delivered', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-[#8B1E10] text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-[#8B1E10]/30'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-16 text-stone-400 font-medium text-xs sm:text-sm">
          <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2" />
          Loading live orders from Supabase…
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-6">
          <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 font-medium text-xs sm:text-sm">No orders found in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const addr = order.shipping_address || {};
            const shipment = shipmentResults[order.id];

            return (
              <div
                key={order.id}
                className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 border-b border-stone-100 pb-3 sm:pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-[#8B1E10] text-sm sm:text-base">
                        {order.order_number}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase border ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-IN')} •{' '}
                      {order.guest_email || '—'}
                    </p>
                  </div>

                  {/* Status Dropdown + Courier Button */}
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
                    <button
                      onClick={() => handleBookShipment(order)}
                      disabled={shippingLoadingId === order.id || order.status === 'shipped' || order.status === 'delivered'}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      {shippingLoadingId === order.id ? 'Booking…' : order.status === 'shipped' ? 'Courier Assigned' : 'Book Delivery (Shiprocket)'}
                    </button>

                    <a
                      href={getCustomerWhatsAppLink(order)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message Customer
                    </a>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] sm:text-xs font-bold text-stone-600 shrink-0">Status:</span>
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white border border-[#D8CCA8] rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-900 focus:border-[#8B1E10] focus:outline-none"
                      >
                        {['placed','confirmed','preparing','packed','shipped','delivered','cancelled'].map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Tracking Info Badge if booked */}
                {shipment && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📦</span>
                      <div>
                        <span className="font-bold text-emerald-900 block">{shipment.courier_name}</span>
                        <span className="text-emerald-700 font-mono text-[11px]">AWB: {shipment.awb_code}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {shipment.label_url && (
                        <a
                          href={shipment.label_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-stone-800 hover:text-black flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-stone-300 shadow-2xs"
                        >
                          Print Label 🏷️
                        </a>
                      )}
                      {shipment.tracking_url && (
                        <a
                          href={shipment.tracking_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-extrabold text-emerald-800 hover:underline flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-emerald-200 shadow-2xs"
                        >
                          Track Shipment <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Body: Address + Items */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 text-xs">
                  {/* Shipping Address */}
                  <div className="md:col-span-4 bg-stone-50/80 p-3 sm:p-4 rounded-xl border border-stone-100 space-y-1">
                    <span className="font-extrabold text-[#8B1E10] uppercase tracking-wider block text-[10px]">
                      Shipping Address
                    </span>
                    <p className="text-stone-900 font-bold">{addr.full_name || '—'}</p>
                    <p className="text-stone-600 text-[11px]">{addr.address_line1}</p>
                    {addr.address_line2 && <p className="text-stone-500 text-[11px]">{addr.address_line2}</p>}
                    {addr.landmark && <p className="text-stone-500 text-[11px]">Near: {addr.landmark}</p>}
                    <p className="text-stone-600 text-[11px]">{addr.city}, {addr.state} – {addr.postal_code}</p>
                    <p className="text-stone-700 font-medium pt-1 text-[11px]">📞 {addr.phone || order.guest_phone || '—'}</p>
                  </div>

                  {/* Order Items */}
                  <div className="md:col-span-8 space-y-2">
                    <span className="font-extrabold text-[#8B1E10] uppercase tracking-wider block text-[10px]">
                      Order Items
                    </span>
                    <div className="space-y-1.5">
                      {(order.order_items || []).map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-stone-50/80 p-2 sm:p-2.5 rounded-xl border border-stone-100 text-xs">
                          <div>
                            <span className="font-semibold text-stone-900">{item.product_name}</span>
                            <span className="text-stone-500 block text-[10px]">
                              {item.variant_label} × {item.quantity}
                            </span>
                          </div>
                          <span className="font-bold text-stone-900">{formatCurrency(item.total_price)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 text-xs font-bold text-stone-900 border-t border-stone-100">
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                        <span>Payment:</span>
                        <span className="text-stone-700 uppercase font-semibold">{order.payment_method}</span>
                        <span>•</span>
                        <span className={order.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-700'}>
                          {order.payment_status?.toUpperCase()}
                        </span>
                        {order.payment_status !== 'paid' && (
                          <button
                            onClick={() => markAsPaid(order.id)}
                            disabled={updatingId === order.id}
                            className="flex items-center gap-1 px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white rounded-lg text-[10px] font-bold"
                          >
                            <BadgeCheck className="w-3 h-3" /> Mark as Paid
                          </button>
                        )}
                        {order.discount_code && (
                          <span className="text-stone-500 font-mono">({order.discount_code})</span>
                        )}
                      </div>
                      <span className="text-sm sm:text-base text-[#8B1E10]">
                        Total: {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
