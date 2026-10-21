'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Tag, Plus, Edit, Trash2, Check, X, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { INITIAL_COMBOS, ComboBundle } from '@/lib/data/mock-combos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminCombosPage() {
  const [combos, setCombos] = useState<ComboBundle[]>(INITIAL_COMBOS);
  const [isAddingModal, setIsAddingModal] = useState(false);

  const [name, setName] = useState('');
  const [badge, setBadge] = useState('SPECIAL BUNDLE');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('1199');
  const [comparePrice, setComparePrice] = useState('1399');

  const toggleActive = (id: string) => {
    setCombos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleCreateCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCombo: ComboBundle = {
      id: `combo-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      badge,
      short_description: desc || 'Curated Andhra pickle combo pack.',
      description: desc || 'Curated Andhra pickle combo pack from Tenali.',
      image: imageUrl || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
      price: parseFloat(price) || 1199,
      compare_at_price: parseFloat(comparePrice) || 1399,
      active: true,
      included_items: [
        {
          product_id: 'prod-boneless-chicken-pickle',
          product_name: 'Andhra Boneless Chicken Pickle',
          size_label: '250g Jar',
          image: imageUrl || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&auto=format&fit=crop',
        },
      ],
    };

    setCombos([newCombo, ...combos]);
    setIsAddingModal(false);
    setName('');
    setDesc('');
    setImageUrl('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Manage Combo Bundles</h1>
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5">
            Create, edit, price, or disable curated Andhra product bundles.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={() => setIsAddingModal(true)} className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5">
            <Plus className="w-4 h-4 mr-1 shrink-0" /> Create New Combo
          </Button>
        </div>
      </div>

      {/* 📐 Image Guidelines Box */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs sm:text-sm">
          <Info className="w-4 h-4 text-[#8B1E10] shrink-0" />
          <span>📐 Combo Box / Bundle Photography Guidelines</span>
        </div>
        <p className="text-stone-600 text-xs leading-relaxed">
          Recommended Size: <strong className="text-stone-900 font-mono">1200 × 800 px (3:2)</strong> or <strong className="text-stone-900 font-mono">1000 × 1000 px (1:1)</strong>. Showcase the multi-jar gift packaging or curated arrangement of jars together.
        </p>
      </div>

      {/* Main Content: Mobile Cards + Desktop Table */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs">
        {/* Mobile View: Cards */}
        <div className="block md:hidden space-y-3">
          {combos.map((combo) => (
            <div key={combo.id} className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-3 space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <Image src={combo.image} alt={combo.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <span className="block font-bold text-stone-900 text-xs sm:text-sm truncate">{combo.name}</span>
                    <button className="text-stone-400 hover:text-[#8B1E10] p-1 shrink-0">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono block truncate">{combo.slug}</span>
                  <span className="inline-block mt-1 text-[9px] font-extrabold text-[#8B1E10] bg-red-50 border border-red-200/60 px-1.5 py-0.2 rounded">
                    {combo.badge}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-stone-900 text-sm">{formatCurrency(combo.price)}</span>
                  <span className="text-stone-400 line-through text-[11px] font-medium">{formatCurrency(combo.compare_at_price)}</span>
                </div>
                <button onClick={() => toggleActive(combo.id)}>
                  {combo.active ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">
                      Disabled
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-[#8B1E10] uppercase font-extrabold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3">Combo Name</th>
                <th className="p-3">Badge</th>
                <th className="p-3">Bundle Price</th>
                <th className="p-3">Compare Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {combos.map((combo) => (
                <tr key={combo.id} className="hover:bg-stone-50">
                  <td className="p-3 font-extrabold text-stone-900">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <Image src={combo.image} alt={combo.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="block font-bold text-stone-900 text-sm">{combo.name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">{combo.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-[#8B1E10]">{combo.badge}</td>
                  <td className="p-3 font-extrabold text-stone-900">{formatCurrency(combo.price)}</td>
                  <td className="p-3 text-stone-400 line-through">{formatCurrency(combo.compare_at_price)}</td>
                  <td className="p-3">
                    <button onClick={() => toggleActive(combo.id)} className="flex items-center gap-1">
                      {combo.active ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-500 border border-stone-200">
                          Disabled
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button className="text-stone-500 hover:text-[#8B1E10] font-bold p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isAddingModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900">Create New Combo Bundle</h3>
              <button onClick={() => setIsAddingModal(false)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCombo} className="space-y-3">
              <Input label="Combo Name *" placeholder="e.g. NISA Super Saver Box" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Combo Image URL" placeholder="https://... (image URL)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

              {imageUrl && (
                <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-stone-200">
                  <Image src={imageUrl} alt="Combo preview" fill className="object-cover" />
                </div>
              )}

              <Input label="Badge Label" placeholder="e.g. BEST VALUE" value={badge} onChange={(e) => setBadge(e.target.value)} />
              <Input label="Short Description" placeholder="Brief details..." value={desc} onChange={(e) => setDesc(e.target.value)} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input label="Bundle Price (₹) *" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <Input label="Compare At Price (₹)" type="number" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={() => setIsAddingModal(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto bg-[#8B1E10] text-white font-bold">Save Combo</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
