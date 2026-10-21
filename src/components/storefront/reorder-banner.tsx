'use client';

import React, { useState } from 'react';
import { RotateCcw, Check, Flame } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-products';
import { useCart } from '@/lib/store/cart-context';
import { Button } from '@/components/ui/button';

export function ReorderBanner() {
  const { addItem } = useCart();
  const [reordered, setReordered] = useState(false);

  const favoriteProduct = INITIAL_PRODUCTS[0]; // Boneless Chicken
  const favoriteVariant = favoriteProduct.variants[1] || favoriteProduct.variants[0]; // 500g

  const handleQuickReorder = () => {
    addItem(favoriteProduct, favoriteVariant, 1);
    setReordered(true);
    setTimeout(() => setReordered(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-[#8B1E10] to-[#72160B] text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-300 block">
            Running Low?
          </span>
          <h4 className="text-sm font-extrabold text-white">
            Reorder {favoriteProduct.name} ({favoriteVariant.size_label})
          </h4>
        </div>
      </div>

      <Button
        onClick={handleQuickReorder}
        size="sm"
        className={`font-bold shrink-0 ${
          reordered ? 'bg-emerald-700 text-white' : 'bg-[#C68B27] hover:bg-amber-600 text-stone-950 font-extrabold'
        }`}
      >
        {reordered ? (
          <>
            <Check className="w-4 h-4 mr-1" /> Added!
          </>
        ) : (
          <>
            <RotateCcw className="w-4 h-4 mr-1" /> 1-Click Reorder
          </>
        )}
      </Button>
    </div>
  );
}
