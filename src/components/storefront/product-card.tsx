'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { ProductWithVariants, ProductVariant } from '@/types/database.types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-context';

interface ProductCardProps {
  product: ProductWithVariants;
}

const TYPE_LABEL: Record<string, string> = {
  'non-veg-pickle': 'Pickle',
  podi: 'Podi',
  sweet: 'Sweet',
};

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
    <div className="group h-full bg-white border border-stone-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:border-[#8B1E10]/40 hover:shadow-lg transition-all duration-300 flex flex-col">

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
      </Link>

      {/* ── Card Body ── */}
      <div className="p-2 sm:p-3 flex-1 flex flex-col gap-1.5">

        {/* Type label + rating (rating only shows once real reviews exist) */}
        <div className="flex items-center justify-between gap-1 h-[13px]">
          <span className="text-[9px] font-extrabold text-[#8B1E10] uppercase tracking-wider">
            {TYPE_LABEL[product.product_type] || ''}
          </span>
          {product.average_rating != null && product.reviews_count ? (
            <span className="flex items-center gap-0.5 text-[10px] font-bold text-stone-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {product.average_rating}
              <span className="text-stone-400 font-medium">({product.reviews_count})</span>
            </span>
          ) : null}
        </div>

        {/* Product name — compact 2-line reservation so cards align regardless of title length */}
        <Link href={`/products/${product.slug}`} className="cursor-pointer">
          <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 hover:text-[#8B1E10] transition-colors leading-tight line-clamp-2 min-h-[2em]">
            {product.name}
          </h3>
        </Link>

        {/* Size Selector */}
        <div className="grid grid-cols-3 gap-1">
          {product.variants.map((v) => {
            const isSelected = selectedVariant.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`text-[9px] sm:text-xs px-1.5 sm:px-2.5 py-1 rounded-lg font-bold transition-all border cursor-pointer leading-tight ${
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

        {/* Full-width Add to Cart with price inline */}
        <button
          onClick={handleAddToCart}
          className={`mt-auto w-full flex items-center justify-between gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-extrabold text-[11px] sm:text-xs transition-all cursor-pointer ${
            addedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-[#8B1E10] hover:bg-[#72160B] text-white active:scale-95'
          }`}
        >
          {addedSuccess ? (
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Added!
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
            </span>
          )}
          <span className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-black">{formatCurrency(selectedVariant.price)}</span>
            {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
              <span className="text-[10px] text-white/60 line-through font-medium">
                {formatCurrency(selectedVariant.compare_at_price)}
              </span>
            )}
          </span>
        </button>

      </div>
    </div>
  );
}
