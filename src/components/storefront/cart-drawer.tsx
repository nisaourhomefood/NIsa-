'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Gift,
  MessageSquare,
} from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { formatCurrency } from '@/lib/utils';
import { calculateShippingFee, FREE_SHIPPING_THRESHOLD } from '@/lib/utils/shipping';

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discountAmount,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    proceedToShopifyCheckout,
    isShopifyCheckoutLoading,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!isCartOpen) return null;

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

  // 3-Tier Dynamic Milestone Rewards
  // Tier 1: ₹999 -> Free 100g Podi Goodie 🎁
  // Tier 2: ₹1,499 -> ₹99 OFF Coupon + Free 100g Podi 🏷️
  // Tier 3: ₹2,499 -> Free Express Delivery + 2x 100g Free Podis 🚚
  const TIER_1 = 999;
  const TIER_2 = 1499;
  const TIER_3 = 2499;

  const getRewardProgress = () => {
    if (subtotal >= TIER_3) return 100;
    return Math.min(100, Math.round((subtotal / TIER_3) * 100));
  };

  const getNextRewardText = () => {
    if (subtotal < TIER_1) {
      return `Add ${formatCurrency(TIER_1 - subtotal)} more to unlock a FREE 100g Podi Sample 🎁`;
    }
    if (subtotal < TIER_2) {
      return `Add ${formatCurrency(TIER_2 - subtotal)} more to get ₹99 OFF with code FIRSTORDER99 🏷️`;
    }
    if (subtotal < TIER_3) {
      return `Add ${formatCurrency(TIER_3 - subtotal)} more for FREE Delivery + 2x 100g Free Podis 🚚`;
    }
    return `🎉 VIP Unlocked: FREE Express Delivery + 2x 100g Free Podis Goodies!`;
  };

  const shippingEst = calculateShippingFee('522201', subtotal);
  const shippingFee = shippingEst.fee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white text-stone-900 shadow-2xl border-l border-[#E8DFC9] flex flex-col h-full animate-slideLeft">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-[#FAF6F0] border-b border-[#E8DFC9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B1E10]" />
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900">Your Cart</h2>
              <span className="text-xs bg-[#8B1E10] text-white font-bold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Top Ticker Bar */}
          <div className="bg-[#1C0A08] text-amber-200 px-3 py-1.5 text-center text-[11px] font-extrabold tracking-wide flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>🎁 FREE 100g Podi Above ₹999 | ₹99 OFF Above ₹1,499 (CODE: <strong className="text-white underline">FIRSTORDER99</strong>)</span>
          </div>

          {/* Interactive Multi-Tier Milestone Progress Bar */}
          <div className="bg-amber-50/90 border-b border-amber-200/80 p-3 sm:p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#8B1E10] text-[11px] sm:text-xs leading-tight">
                {getNextRewardText()}
              </span>
              <span className="text-[10px] font-bold text-stone-500 font-mono shrink-0 ml-2">
                {formatCurrency(subtotal)} / {formatCurrency(TIER_3)}
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="relative w-full h-2.5 bg-amber-200/70 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#8B1E10] via-amber-600 to-emerald-600 transition-all duration-500 rounded-full"
                style={{ width: `${getRewardProgress()}%` }}
              />
            </div>

            {/* 3 Milestone Checkpoints */}
            <div className="grid grid-cols-3 text-center text-[10px] font-bold pt-1 gap-1">
              <div className={`flex flex-col items-center gap-0.5 ${subtotal >= TIER_1 ? 'text-emerald-800' : 'text-stone-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${subtotal >= TIER_1 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  {subtotal >= TIER_1 ? '✓' : '🎁'}
                </span>
                <span className="font-extrabold">₹999</span>
                <span className="text-[9px] text-stone-500 font-medium">100g Free Podi</span>
              </div>

              <div className={`flex flex-col items-center gap-0.5 ${subtotal >= TIER_2 ? 'text-emerald-800' : 'text-stone-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${subtotal >= TIER_2 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  {subtotal >= TIER_2 ? '✓' : '🏷️'}
                </span>
                <span className="font-extrabold">₹1,499</span>
                <span className="text-[9px] text-stone-500 font-medium">₹99 OFF + Podi</span>
              </div>

              <div className={`flex flex-col items-center gap-0.5 ${subtotal >= TIER_3 ? 'text-emerald-800' : 'text-stone-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${subtotal >= TIER_3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                  {subtotal >= TIER_3 ? '✓' : '🚚'}
                </span>
                <span className="font-extrabold">₹2,499</span>
                <span className="text-[9px] text-stone-500 font-medium">Free Delivery + 2 Podis</span>
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="text-base font-extrabold text-stone-800">Your cart is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Add Saraswati&apos;s fresh home-cooked Andhra pickles or podis to get started!
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-[#8B1E10] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md"
                >
                  Explore Tenali Specials
                </Link>
              </div>
            ) : (
              <>
                <div className="divide-y divide-stone-100">
                  {items.map((item, idx) => {
                    return (
                      <div key={`${item.variant_id}-${item.product_id || ''}-${idx}`} className="py-3.5 first:pt-0 space-y-2.5">
                        <div className="flex gap-3 items-start">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 truncate pr-2">
                                {item.name}
                              </h4>
                              <button
                                onClick={() => removeItem(item.variant_id)}
                                className="text-stone-400 hover:text-red-600 transition-colors p-1"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Wood-Pressed Oil
                              </span>
                              <span className="text-stone-400 font-medium">Tenali Home Made</span>
                            </div>
                          </div>
                        </div>

                        {/* Pack Size (edit size/variant on the product page) */}
                        <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#E8DFC9] flex items-center justify-between">
                          <span className="text-[9px] font-extrabold text-stone-600 uppercase tracking-wider">
                            Pack Size
                          </span>
                          <span className="text-xs font-black text-[#8B1E10]">{item.size_label}</span>
                        </div>

                        {/* Quantity & Item Total Row */}
                        <div className="flex items-center justify-between pt-0.5">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
                              className="p-1 text-stone-600 hover:bg-stone-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-extrabold text-stone-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
                              className="p-1 text-stone-600 hover:bg-stone-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <span className="text-xs sm:text-sm font-extrabold text-[#8B1E10]">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            {item.compare_at_price && (
                              <span className="block text-[10px] text-stone-400 line-through">
                                {formatCurrency(item.compare_at_price * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 🎁 Unlocked Free Goodies Visual Representation */}
                {subtotal >= TIER_3 ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-emerald-700" />
                        <span>2x FREE 100g Podis + Free Express Delivery Unlocked!</span>
                      </span>
                      <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        VIP GIFT
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-emerald-100">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                          <Image src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop" alt="100g Gongura Podi" fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-stone-900 block truncate">100g Gongura Podi</span>
                          <span className="text-[10px] text-emerald-700 font-extrabold">₹0 <span className="line-through text-stone-400 text-[9px]">₹99</span></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-emerald-100">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                          <Image src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=400&auto=format&fit=crop" alt="100g Nallakaram Podi" fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-stone-900 block truncate">100g Karam Podi</span>
                          <span className="text-[10px] text-emerald-700 font-extrabold">₹0 <span className="line-through text-stone-400 text-[9px]">₹99</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : subtotal >= TIER_1 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                        <Gift className="w-4 h-4 text-[#8B1E10]" />
                        <span>FREE 100g Podi Sample Goodie Unlocked!</span>
                      </span>
                      <span className="text-[9px] font-black uppercase bg-[#8B1E10] text-white px-2 py-0.5 rounded-full">
                        FREE GIFT
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-amber-100">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                        <Image src="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=400&auto=format&fit=crop" alt="100g Tenali Karam Podi" fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-stone-900 block truncate">100g Tenali Nallakaram Podi</span>
                        <p className="text-[10px] text-stone-500">Hand-ground in stone pestle with garlic & wood-pressed oil</p>
                      </div>
                      <span className="text-xs text-emerald-700 font-black shrink-0">₹0 <span className="line-through text-stone-400 text-[10px] font-normal">₹99</span></span>
                    </div>
                  </div>
                ) : null}

                {/* Promo Code Input */}
                <div className="pt-2 border-t border-stone-100">
                  {appliedDiscount ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-700" />
                        <div>
                          <span className="font-extrabold text-emerald-900 uppercase">{appliedDiscount.code}</span>
                          <span className="text-emerald-700 block text-[10px]">
                            {appliedDiscount.discount_type === 'flat'
                              ? `₹${appliedDiscount.value} discount applied`
                              : `${appliedDiscount.value}% discount applied`}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={removeDiscountCode}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter Coupon (e.g. FIRSTORDER99)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 bg-[#FAF6F0] border border-[#E8DFC9] rounded-xl px-3 py-2 text-xs font-bold uppercase text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#8B1E10]"
                      />
                      <button
                        type="submit"
                        className="bg-[#8B1E10] hover:bg-[#72160B] text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-colors shadow-xs"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && <p className="mt-1 text-[11px] text-red-600 font-medium">{couponError}</p>}
                  {couponSuccess && <p className="mt-1 text-[11px] text-emerald-700 font-medium">{couponSuccess}</p>}
                </div>

                {/* Collapsible Special Instructions / Packing Notes */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="flex items-center justify-between w-full text-[11px] font-bold text-stone-600 hover:text-[#8B1E10] transition-colors py-1"
                  >
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#8B1E10]" /> Add Special Cooking or Delivery Instructions
                    </span>
                    {showInstructions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showInstructions && (
                    <textarea
                      placeholder="e.g. Extra spicy, Less oil, Packing instructions for travel, or Doorstep notes..."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={2}
                      className="w-full bg-[#FAF6F0] border border-[#E8DFC9] rounded-xl p-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#8B1E10] mt-1 resize-none"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Sticky High-Converting Footer (100% Prepaid UPI Branding, Zero COD) */}
          {items.length > 0 && (
            <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200 space-y-2.5 shadow-xl">
              
              {/* Expandable Estimated Total Bar */}
              <div className="border border-stone-200 rounded-xl p-2.5 bg-stone-50/80">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="flex justify-between items-center w-full text-xs font-extrabold text-stone-900"
                >
                  <span className="flex items-center gap-1">
                    <span>Estimated Total</span>
                    {showBreakdown ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
                  </span>
                  <span className="text-base font-extrabold text-[#8B1E10]">
                    {formatCurrency(totalAmount)}
                  </span>
                </button>

                <p className="text-[10px] text-stone-500 mt-0.5">
                  📦 Incl. {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE Express Delivery' : `~${formatCurrency(shippingFee)} est. shipping`} (Calculated at checkout)
                </p>

                {showBreakdown && (
                  <div className="space-y-1 text-xs text-stone-600 border-t border-stone-200 mt-2 pt-2">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-bold">
                        <span>Coupon Savings</span>
                        <span>-{formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? <strong className="text-emerald-700">FREE</strong> : formatCurrency(shippingFee)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Big High-Converting Shopify Checkout Button */}
              <button
                type="button"
                onClick={async () => {
                  const redirected = await proceedToShopifyCheckout();
                  if (!redirected) {
                    setIsCartOpen(false);
                    window.location.href = '/checkout';
                  }
                }}
                disabled={isShopifyCheckoutLoading}
                className="w-full min-h-[56px] bg-[#1C0A08] hover:bg-[#2C100D] active:scale-[0.99] text-white font-extrabold py-3 px-4 rounded-xl shadow-lg flex flex-col items-center justify-center gap-1 group transition-all cursor-pointer disabled:opacity-75"
              >
                <span className="flex items-center gap-2">
                  {isShopifyCheckoutLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm tracking-wider uppercase font-black">
                    {isShopifyCheckoutLoading ? 'Connecting to Shopify...' : 'Proceed to Checkout'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </span>

                {/* Supported Payment Trust Badge */}
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-white/80">
                  <span className="text-emerald-300">Shopify Secure</span>
                  <span className="text-white/40">•</span>
                  <span className="text-amber-300">UPI / Cards / NetBanking</span>
                </span>
              </button>

              {/* Direct WhatsApp UPI Alternative */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full min-h-[44px] flex items-center justify-center gap-2 border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 active:scale-[0.99] font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Or Pay via WhatsApp UPI</span>
                <span className="text-[10px] text-emerald-600 font-semibold">(100% Encrypted)</span>
              </Link>

              {/* New Customer / Saraswati Kitchen Trust Stamp */}
              <div className="text-center bg-[#FAF6F0] border border-[#E8DFC9] rounded-xl p-2">
                <p className="text-[10px] text-stone-700 font-bold flex items-center justify-center gap-1">
                  <span>🛡️</span> Handcrafted in Tenali • 100% Prepaid via WhatsApp UPI • Dispatched in 48h
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
