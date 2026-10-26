'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, Tag, ArrowRight } from 'lucide-react';
import { INITIAL_COMBOS, ComboBundle } from '@/lib/data/mock-combos';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-products';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-context';
import { Button } from '@/components/ui/button';

export function CombosPageClient() {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const handleAddComboToCart = (combo: ComboBundle) => {
    // Add first item of combo to cart as representative variant
    combo.included_items.forEach((item) => {
      const prod = INITIAL_PRODUCTS.find((p) => p.id === item.product_id);
      if (prod && prod.variants[0]) {
        addItem(prod, prod.variants[0], 1);
      }
    });

    setAddedIds((prev) => ({ ...prev, [combo.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [combo.id]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FAF6F0]">
      
      {/* Header */}
      <div className="border-b border-[#E8DFC9] pb-6 space-y-2">
        <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest bg-red-50 px-3 py-1 rounded border border-red-200 inline-block">
          Curated Value Bundles
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          NISA Special Combo Packs
        </h1>
        <p className="text-sm text-stone-600 font-medium">
          Curated family bundles of our bestselling chicken pickles, mutton pickles, and traditional podis. Save up to 15% on combos!
        </p>
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {INITIAL_COMBOS.filter((c) => c.active).map((combo) => {
          const discountPct = calculateDiscountPercentage(combo.compare_at_price, combo.price);
          const isAdded = addedIds[combo.id];

          return (
            <div
              key={combo.id}
              className="bg-white border border-[#E8DFC9] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Main image */}
                <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                  <Image src={combo.image} alt={combo.name} fill className="object-cover" />
                  <div className="absolute top-4 left-4 bg-[#8B1E10] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                    {combo.badge}
                  </div>
                  {discountPct > 0 && (
                    <div className="absolute top-4 right-4 bg-[#C68B27] text-stone-950 text-xs font-extrabold px-3 py-1 rounded-lg shadow-xs">
                      SAVE {discountPct}%
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-stone-900">{combo.name}</h3>
                    <p className="text-xs text-stone-600 font-medium mt-1">{combo.short_description}</p>
                  </div>

                  {/* Included Items List */}
                  <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-[#E8DFC9] space-y-2">
                    <span className="text-[11px] uppercase font-extrabold text-[#8B1E10] tracking-wider block">
                      Included In This Box:
                    </span>
                    <div className="space-y-1.5">
                      {combo.included_items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-800 font-bold">
                          <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{item.product_name} ({item.size_label})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 pt-2">
                    <span className="text-2xl font-extrabold text-[#8B1E10]">
                      {formatCurrency(combo.price)}
                    </span>
                    {combo.compare_at_price > combo.price && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatCurrency(combo.compare_at_price)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button
                  onClick={() => handleAddComboToCart(combo)}
                  className={`w-full font-extrabold py-3 ${
                    isAdded ? 'bg-emerald-700 text-white' : 'bg-[#8B1E10] hover:bg-[#72160B] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Combo Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2" /> Add Bundle to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Link note */}
      <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 text-center space-y-2 shadow-xs">
        <h4 className="text-sm font-extrabold text-stone-900">Are you a NISA Admin?</h4>
        <p className="text-xs text-stone-600 font-medium">Create, edit, or set prices for combos in the admin dashboard.</p>
        <Link href="/admin/combos" className="text-xs text-[#8B1E10] font-bold underline inline-block">
          Go to Admin Combos Portal →
        </Link>
      </div>

    </div>
  );
}
