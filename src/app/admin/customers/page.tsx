'use client';

import React, { useState, useEffect } from 'react';
import { Users, RefreshCw, Trash2, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  total_orders: number;
  lifetime_value: number;
  created_at: string;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  source: 'WhatsApp' | 'Cashfree';
  converted: boolean;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = () => {
    setLoading(true);
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((data) => {
        setCustomers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setCustomers([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Delete this customer record?')) return;
    try {
      const res = await fetch(`/api/admin/customers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Clear all customer CRM records from Supabase?')) return;
    try {
      const res = await fetch('/api/admin/customers?id=all', { method: 'DELETE' });
      if (res.ok) {
        setCustomers([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-3 sm:pb-5">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-stone-900">
            Customer CRM ({customers.length})
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
            Real customers who reached checkout via WhatsApp or Online Payment.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchCustomers}
            className="p-2 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-600 transition-colors shrink-0"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {customers.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-extrabold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-colors shrink-0"
            >
              Clear All Records
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Mobile Cards + Desktop Table */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xs">
        {loading ? (
          <div className="text-center py-12 text-stone-400">
            <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2 text-[#8B1E10]" />
            <p className="text-xs font-medium">Loading live customers from Supabase…</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-stone-400 bg-stone-50/50 rounded-xl border border-dashed border-stone-200 p-6">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-stone-300" />
            <h3 className="font-bold text-stone-700 text-sm mb-0.5">No Customer Records Found</h3>
            <p className="font-medium text-xs text-stone-400 max-w-sm mx-auto">
              Customer data will be created automatically as new buyers checkout and place orders.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards (Compact, Responsive Grid) */}
            <div className="block md:hidden space-y-2.5">
              {customers.map((c) => (
                <div key={c.id} className="bg-stone-50/80 border border-stone-200 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm truncate">
                        {c.full_name || 'Customer'}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-stone-400" /> {c.email || '—'}
                      </p>
                      {c.phone && (
                        <p className="text-[11px] text-stone-600 font-bold flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-[#8B1E10]" /> {c.phone}
                        </p>
                      )}
                      {c.city && (
                        <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400" /> {c.city}, {c.state}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-[#8B1E10] block">
                        {formatCurrency(c.lifetime_value)}
                      </span>
                      <button
                        onClick={() => handleDeleteCustomer(c.id)}
                        className="mt-1 p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                        title="Delete customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-stone-200/60 font-bold">
                    <div className="flex items-center gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold">{c.source}</span>
                      <span className={`px-1.5 py-0.5 rounded ${c.converted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {c.converted ? 'Converted' : 'Not Paid Yet'}
                      </span>
                    </div>
                    <span className="text-stone-400 font-medium">
                      {c.total_orders} order{c.total_orders !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-[#8B1E10] uppercase font-extrabold text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Orders</th>
                    <th className="p-3">Lifetime Value</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50">
                      <td className="p-3">
                        <span className="font-extrabold text-stone-900 block">{c.full_name || 'Customer'}</span>
                        <span className="text-stone-500 font-medium text-[11px]">{c.email || '—'}</span>
                      </td>
                      <td className="p-3 text-stone-600 font-bold">{c.phone || '—'}</td>
                      <td className="p-3 text-stone-600 font-medium">{c.city ? `${c.city}, ${c.state}` : '—'}</td>
                      <td className="p-3">
                        <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-bold text-[10px]">{c.source}</span>
                      </td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${c.converted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {c.converted ? 'Converted' : 'Not Paid Yet'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-stone-900">{c.total_orders}</td>
                      <td className="p-3 font-extrabold text-[#8B1E10]">{formatCurrency(c.lifetime_value)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteCustomer(c.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
