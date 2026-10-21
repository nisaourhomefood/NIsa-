'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, Tag, PlusCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-products';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    addItem,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    proceedToShopifyCheckout,
    isShopifyCheckoutLoading,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput) return;

    const res = applyDiscountCode(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const crossSellProducts = INITIAL_PRODUCTS.filter(
    (p) => !items.some((item) => item.product_id === p.id)
  ).slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 bg-[#FAF6F0]">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto text-stone-400 border border-[#E8DFC9]">
          <ShoppingBag className="w-8 h-8 text-[#8B1E10]" />
        </div>
        <h1 className="text-2xl font-bold text-stone-900">Your Shopping Cart is Empty</h1>
        <p className="text-stone-600 text-sm">Discover our authentic homemade Andhra non-veg pickles, podis, and sweets.</p>
        <Link href="/products">
          <Button className="bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold">Browse Catalogue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAF6F0]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">Your Shopping Cart</h1>
          <p className="text-xs text-stone-600 font-medium">Review your items before proceeding to checkout</p>
        </div>
        <Link href="/products" className="text-xs text-[#8B1E10] hover:underline flex items-center gap-1 font-bold">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="divide-y divide-stone-100">
              {items.map((item, idx) => (
                <div key={`${item.variant_id}-${item.product_id || ''}-${idx}`} className="py-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <Link href={`/products/${item.slug}`} className="text-base font-extrabold text-stone-900 hover:text-[#8B1E10]">
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#8B1E10] font-bold mt-0.5">Size: {item.size_label}</p>
                      <p className="text-xs text-stone-500 mt-0.5">Unit Price: {formatCurrency(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shadow-xs">
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                        className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                        className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-[#8B1E10]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.variant_id)}
                      className="text-stone-400 hover:text-red-600 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Cross-Selling / Complete Your Andhra Box Section */}
          {crossSellProducts.length > 0 && (
            <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="border-b border-stone-100 pb-2">
                <h3 className="text-base font-extrabold text-stone-900">
                  Complete Your Andhra Box — "If you like this, try..."
                </h3>
                <p className="text-xs text-stone-500 font-medium">Add complementary authentic Tenali items to your box</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {crossSellProducts.map((prod) => {
                  const variant = prod.variants[0];
                  return (
                    <div key={prod.id} className="bg-[#FAF6F0] border border-[#E8DFC9] rounded-xl p-3.5 flex flex-col justify-between space-y-2">
                      <div className="relative aspect-4/3 w-full rounded-lg overflow-hidden bg-stone-100">
                        <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-stone-900 line-clamp-1">{prod.name}</h4>
                        <span className="text-[11px] font-bold text-[#8B1E10]">{variant.size_label} • {formatCurrency(variant.price)}</span>
                      </div>
                      <button
                        onClick={() => addItem(prod, variant, 1)}
                        className="w-full bg-[#8B1E10] hover:bg-[#72160B] text-white text-xs font-bold py-1.5 rounded-lg flex items-center justify-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 space-y-6 shadow-xs sticky top-24">
            <h3 className="text-lg font-extrabold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            {/* Coupon Code Section */}
            <div className="space-y-2">
              {appliedDiscount ? (
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs text-emerald-900">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Tag className="w-4 h-4 text-emerald-700" /> Coupon: <strong>{appliedDiscount.code}</strong>
                  </span>
                  <button onClick={removeDiscountCode} className="text-stone-500 hover:text-red-600 underline text-[11px]">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-white border border-[#D8CCA8] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 uppercase focus:outline-none focus:border-[#8B1E10] focus:ring-2 focus:ring-[#8B1E10]/20 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-xs text-red-600 font-medium">{couponError}</p>}
              {couponSuccess && <p className="text-xs text-emerald-700 font-medium">{couponSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-stone-700 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Discount Savings</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Estimate</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatCurrency(shippingFee)}</span>
              </div>

              <div className="flex justify-between items-center text-base font-extrabold text-stone-900 border-t border-stone-200 pt-3">
                <span>Total Amount</span>
                <span className="text-[#8B1E10]">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Proceed to Shopify Checkout Button */}
            <div className="space-y-2">
              <Button
                size="lg"
                onClick={async () => {
                  const redirected = await proceedToShopifyCheckout();
                  if (!redirected) {
                    window.location.href = '/checkout';
                  }
                }}
                disabled={isShopifyCheckoutLoading}
                className="w-full bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold py-3.5 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isShopifyCheckoutLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : null}
                <span>{isShopifyCheckoutLoading ? 'Connecting to Shopify...' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Link
                href="/checkout"
                className="block text-center text-xs text-stone-600 hover:text-[#8B1E10] font-semibold py-1 hover:underline"
              >
                Or use Direct WhatsApp UPI Order
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
