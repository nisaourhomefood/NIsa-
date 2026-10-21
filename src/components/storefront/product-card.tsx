'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Check, ShieldCheck } from 'lucide-react';
import { ProductWithVariants, ProductVariant } from '@/types/database.types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-context';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: ProductWithVariants;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const defaultVariant = product.variants.find((v) => v.is_default) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const discountPercent = selectedVariant.compare_at_price
    ? calculateDiscountPercentage(selectedVariant.compare_at_price, selectedVariant.price)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedVariant, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1800);
  };

  return (
    <div className="group bg-white border border-stone-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:border-[#8B1E10]/40 hover:shadow-lg transition-all duration-300 flex flex-col">

      {/* ── Image — square, full width ── */}
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden bg-stone-100 aspect-square cursor-pointer">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600&auto=format&fit=crop'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.bestseller_status && (
            <span className="text-[9px] sm:text-[10px] font-extrabold bg-[#8B1E10] text-white px-1.5 py-0.5 rounded-md leading-tight">
              BESTSELLER
            </span>
          )}
          {product.featured_status && (
            <span className="text-[9px] sm:text-[10px] font-extrabold bg-stone-800/80 text-amber-200 px-1.5 py-0.5 rounded-md leading-tight">
              SMALL BATCH
            </span>
          )}
        </div>

        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded-md z-10 shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Bottom quality bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-2 py-2">
          <span className="flex items-center gap-1 text-[9px] sm:text-[10px] text-white/90 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">Wood-Pressed Sesame Oil</span>
          </span>
        </div>
      </Link>

      {/* ── Card Body ── */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col gap-2">

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.average_rating || 5)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-stone-200'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-stone-900">{product.average_rating || 4.9}</span>
          <span className="text-[10px] text-stone-400">({product.reviews_count || 30})</span>
        </div>

        {/* Product name */}
        <Link href={`/products/${product.slug}`} className="cursor-pointer">
          <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 hover:text-[#8B1E10] transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Description — hidden on very small screens */}
        <p className="hidden sm:block text-xs text-stone-500 line-clamp-2 leading-relaxed">
          {product.short_description}
        </p>

        {/* Size Selector */}
        <div className="space-y-1">
          <span className="text-[9px] sm:text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Size:</span>
          <div className="flex flex-wrap gap-1">
            {product.variants.map((v) => {
              const isSelected = selectedVariant.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-lg font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-[#8B1E10] text-white border-[#8B1E10]'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-[#8B1E10]/40'
                  }`}
                >
                  {v.size_label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between gap-1.5 pt-1 mt-auto border-t border-stone-100">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-[#8B1E10] leading-tight">
                {formatCurrency(selectedVariant.price)}
              </span>
              {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                <span className="text-[10px] text-stone-400 line-through font-medium">
                  {formatCurrency(selectedVariant.compare_at_price)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-stone-400 block">Incl. taxes</span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`shrink-0 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-extrabold text-[10px] sm:text-xs flex items-center gap-1 transition-all cursor-pointer ${
              addedSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-[#8B1E10] hover:bg-[#72160B] text-white active:scale-95'
            }`}
          >
            {addedSuccess ? (
              <><Check className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Added!</span><span className="sm:hidden">✓</span></>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Add to Cart</span><span className="sm:hidden">Add</span></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
