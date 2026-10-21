'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, DollarSign, ArrowRight, Plus, RefreshCw, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  guest_email: string | null;
  shipping_address: Record<string, string>;
  order_items: { product_name: string; variant_label: string }[];
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/products'),
      ]);

      const ordersData = await ordersRes.json();
      const productsData = await productsRes.json();

      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProductCount(Array.isArray(productsData) ? productsData.length : 0);
    } catch {
      setOrders([]);
      setProductCount(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

  const pendingOrders = orders.filter((o) =>
    ['placed', 'confirmed', 'preparing'].includes(o.status)
  ).length;

  const metrics = [
    {
      title: 'Total Revenue',
      value: loading ? '—' : formatCurrency(totalRevenue),
      subtext: `${orders.length} order${orders.length === 1 ? '' : 's'}`,
      icon: DollarSign,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Total Orders',
      value: loading ? '—' : `${orders.length}`,
      subtext: `${pendingOrders} pending`,
      icon: ShoppingCart,
      color: 'text-amber-800 bg-amber-50 border-amber-200',
    },
    {
      title: 'Active Products',
      value: loading || productCount === null ? '—' : `${productCount}`,
      subtext: 'In Catalogue',
      icon: Package,
      color: 'text-[#8B1E10] bg-red-50 border-red-200',
    },
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    const style =
      status === 'delivered' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
      status === 'shipped' ? 'bg-blue-50 text-blue-900 border-blue-200' :
      status === 'cancelled' ? 'bg-red-50 text-red-900 border-red-200' :
      'bg-amber-50 text-amber-900 border-amber-200';
    return (
      <span className={`px-1.5 sm:px-2 py-0.5 rounded-full font-bold uppercase text-[9px] sm:text-[10px] border shrink-0 ${style}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-3 sm:pb-5">
        <div>
          <span className="text-[10px] uppercase font-extrabold text-[#8B1E10] tracking-wider">
            Tenali Kitchen Portal
          </span>
          <h1 className="text-lg sm:text-2xl font-black text-stone-900 mt-0.5">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchDashboardData}
            className="p-2 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-600 transition-colors shrink-0"
            title="Refresh Live Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <Link href="/admin/products" className="flex-1 sm:flex-none">
            <Button size="sm" className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold text-xs py-2 px-3 sm:px-4 rounded-xl">
              <Plus className="w-3.5 h-3.5 mr-1 shrink-0" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* 3 Compact Square-Grid Metric Cards (Optimized for Mobile with Zero Wasted Space) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 flex flex-col justify-between shadow-2xs aspect-square sm:aspect-auto"
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-xs font-extrabold text-stone-500 uppercase tracking-wider line-clamp-1">
                {m.title}
              </span>
              <div className={`w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border flex items-center justify-center shrink-0 ${m.color}`}>
                <m.icon className="w-3 h-3 sm:w-4.5 sm:h-4.5" />
              </div>
            </div>

            <div className="my-auto sm:my-0 sm:pt-2">
              <span className="text-base sm:text-2xl font-black text-stone-900 block leading-tight truncate">
                {m.value}
              </span>
              <span className="text-[9px] sm:text-[11px] text-stone-500 font-bold block mt-0.5 truncate">
                {m.subtext}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 space-y-3 sm:space-y-4 shadow-2xs">
        <div className="flex justify-between items-center border-b border-stone-100 pb-2.5 sm:pb-3">
          <h2 className="text-xs sm:text-base font-extrabold text-stone-900">Recent Customer Orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-[#8B1E10] hover:underline flex items-center gap-1">
            <span>Manage All</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-stone-400 text-xs font-medium">
            <RefreshCw className="w-4 h-4 mx-auto animate-spin mb-2 text-[#8B1E10]" />
            Loading live orders…
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10 text-stone-400 text-xs font-medium bg-stone-50/50 rounded-xl border border-dashed border-stone-200 p-6">
            <p className="font-bold text-stone-700 mb-1">No orders yet</p>
            <p className="text-[11px] text-stone-400">Orders placed by customers via WhatsApp or online checkout will appear here in real-time.</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Compact Cards */}
            <div className="block md:hidden space-y-2.5">
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-stone-50/80 border border-stone-200/90 rounded-xl p-2.5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-[#8B1E10]">{order.order_number}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-stone-900 truncate pr-2">
                      {order.shipping_address?.full_name || order.guest_email || 'Customer'}
                    </span>
                    <span className="font-extrabold text-[#8B1E10] shrink-0">{formatCurrency(order.total_amount)}</span>
                  </div>
                  <p className="text-[10px] text-stone-500 truncate">
                    📍 {order.shipping_address?.city || 'India'}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop View: Clean Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-[#8B1E10] uppercase font-extrabold text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-[#8B1E10]">{order.order_number}</td>
                      <td className="p-3 font-extrabold text-stone-900">
                        {order.shipping_address?.full_name || order.guest_email || '—'}
                      </td>
                      <td className="p-3 text-stone-600 font-medium">{order.shipping_address?.city || '—'}</td>
                      <td className="p-3 text-stone-700 font-medium">
                        {order.order_items?.slice(0, 1).map((i) => `${i.product_name} (${i.variant_label})`).join(', ')}
                        {order.order_items?.length > 1 && ` +${order.order_items.length - 1} more`}
                      </td>
                      <td className="p-3 font-extrabold text-stone-900">{formatCurrency(order.total_amount)}</td>
                      <td className="p-3">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
