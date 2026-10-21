'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, X, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Discount {
  id: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  value: number;
  min_order_amount: number;
  active: boolean;
  created_at: string;
}

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'flat'>('percentage');
  const [value, setValue] = useState('10');
  const [minOrder, setMinOrder] = useState('499');
  const [saving, setSaving] = useState(false);

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/discounts');
      const data = await res.json();
      setDiscounts(Array.isArray(data) ? data : []);
    } catch {
      setDiscounts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const toggleDiscountActive = async (id: string, currentActive: boolean) => {
    const res = await fetch('/api/admin/discounts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !currentActive }),
    });
    if (res.ok) {
      setDiscounts((prev) =>
        prev.map((d) => (d.id === id ? { ...d, active: !currentActive } : d))
      );
    }
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setSaving(true);

    const res = await fetch('/api/admin/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        discount_type: type,
        value: parseFloat(value) || 10,
        min_order_amount: parseFloat(minOrder) || 499,
      }),
    });

    if (res.ok) {
      const newDisc = await res.json();
      setDiscounts((prev) => [newDisc, ...prev]);
      setIsModalOpen(false);
      setCode('');
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Discounts & Referral Rules</h1>
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5">
            Control promo codes, first-order discounts, and seasonal offers.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5">
            <Plus className="w-4 h-4 mr-1 shrink-0" /> Create Discount Rule
          </Button>
        </div>
      </div>

      {/* Main Content: Mobile Cards + Desktop Table */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs">
        {loading ? (
          <div className="text-center py-12 text-stone-400">
            <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2" />
            <p className="text-xs sm:text-sm font-medium">Loading discounts from Supabase…</p>
          </div>
        ) : discounts.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-xs sm:text-sm font-medium">
            No discount rules created yet.
          </div>
        ) : (
          <>
            {/* Mobile View: Cards */}
            <div className="block md:hidden space-y-3">
              {discounts.map((disc) => (
                <div key={disc.id} className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-[#8B1E10] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-lg">
                      {disc.code}
                    </span>
                    <button onClick={() => toggleDiscountActive(disc.id, disc.active)}>
                      {disc.active ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">Inactive</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-sm">
                        {disc.discount_type === 'percentage' ? `${disc.value}% OFF` : formatCurrency(disc.value)}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded">
                        {disc.discount_type}
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Min: {formatCurrency(disc.min_order_amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-[#8B1E10] uppercase font-extrabold text-[10px] tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Discount Value</th>
                    <th className="p-3">Min Order Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {discounts.map((disc) => (
                    <tr key={disc.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-extrabold text-[#8B1E10]">{disc.code}</td>
                      <td className="p-3 uppercase font-semibold text-stone-700">{disc.discount_type}</td>
                      <td className="p-3 font-extrabold text-stone-900">
                        {disc.discount_type === 'percentage' ? `${disc.value}% OFF` : formatCurrency(disc.value)}
                      </td>
                      <td className="p-3 font-medium text-stone-600">{formatCurrency(disc.min_order_amount)}</td>
                      <td className="p-3">
                        <button onClick={() => toggleDiscountActive(disc.id, disc.active)}>
                          {disc.active ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">Active</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">Inactive</span>
                          )}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-stone-500 hover:text-[#8B1E10] font-bold p-1">
                          <Edit className="w-4 h-4" />
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900">Create Discount Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDiscount} className="space-y-3">
              <Input label="Coupon Code *" placeholder="e.g. FIRSTBOX15" value={code} onChange={(e) => setCode(e.target.value)} required />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'percentage' | 'flat')}
                    className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:border-[#8B1E10] focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <Input label="Discount Value *" type="number" value={value} onChange={(e) => setValue(e.target.value)} required />
              </div>

              <Input label="Minimum Order Amount (₹)" type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto bg-[#8B1E10] text-white font-bold" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Discount'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
