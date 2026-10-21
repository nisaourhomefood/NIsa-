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
} from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { formatCurrency } from '@/lib/utils';
import { calculateShippingFee, FREE_SHIPPING_THRESHOLD } from '@/lib/utils/shipping';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-products';

// 5 Relatable Andhra Quick-Add Products (Matching Reference Screenshot)
const RELATABLE_ADDONS = [
  {
    id: 'relatable-tomato-pickle',
    name: 'Tenali Country Tomato Pickle',
    price: 199,
    compare_at_price: 249,
    size_label: '250g Jar',
    tag: 'Homestyle Classic',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop',
    category: 'veg-pickle',
  },
  {
    id: 'relatable-gongura-podi',
    name: 'Gongura Leaf Roasted Podi',
    price: 149,
    compare_at_price: 199,
    size_label: '150g Pouch',
    tag: 'Spicy Rice Mix',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop',
    category: 'podi',
  },
  {
    id: 'relatable-mango-avakaya',
    name: 'Traditional Mango Avakaya',
    price: 229,
    compare_at_price: 279,
    size_label: '250g Jar',
    tag: 'Summer Special',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&auto=format&fit=crop',
    category: 'veg-pickle',
  },
  {
    id: 'relatable-nallakaram-podi',
    name: 'Guntur Nallakaram Karam Podi',
    price: 139,
    compare_at_price: 179,
    size_label: '150g Pouch',
    tag: 'Idli & Dosa Partner',
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=400&auto=format&fit=crop',
    category: 'podi',
  },
  {
    id: 'relatable-ghee-sunnundalu',
    name: 'Pure Ghee Bellam Sunnundalu',
    price: 249,
    compare_at_price: 299,
    size_label: '250g Box',
    tag: 'Urad Dal & Jaggery',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=400&auto=format&fit=crop',
    category: 'sweet',
  },
];

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    changeItemVariant,
    subtotal,
    discountAmount,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
    appliedDiscount,
    applyDiscountCode,
    removeDiscountCode,
    addItem,
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

  const handleQuickAdd = (addon: typeof RELATABLE_ADDONS[0]) => {
    const mockProduct: any = {
      id: addon.id,
      name: addon.name,
      slug: addon.id,
      category_id: addon.category,
      product_type: 'non-veg-pickle',
      short_description: addon.tag,
      description: addon.name,
      images: [addon.image],
      ingredients: [],
      preparation_info: '',
      storage_info: '',
      shelf_life: '6 Months',
      net_quantity: addon.size_label,
      featured_status: false,
      bestseller_status: true,
      active_status: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: { id: 'cat-1', name: addon.category, slug: 'cat', description: '', image_url: addon.image, sort_order: 1, created_at: '', updated_at: '' },
      reviews_count: 24,
      average_rating: 4.9,
      variants: [
        {
          id: `var-${addon.id}`,
          product_id: addon.id,
          sku: `SKU-${addon.id}`,
          size_label: addon.size_label,
          weight_g: 250,
          price: addon.price,
          compare_at_price: addon.compare_at_price,
          stock: 50,
          is_default: true,
          created_at: '',
          updated_at: '',
        },
      ],
    };

    addItem(mockProduct, mockProduct.variants[0], 1);
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
                    const matchingProduct = INITIAL_PRODUCTS.find(
                      (p) => p.id === item.product_id || p.slug === item.slug || p.name === item.name
                    );

                    const availableVariants = matchingProduct?.variants || [
                      { id: `${item.product_id}-250`, size_label: '250g', price: item.price, compare_at_price: item.compare_at_price },
                      { id: `${item.product_id}-500`, size_label: '500g', price: Math.round(item.price * 1.9), compare_at_price: Math.round((item.compare_at_price || item.price * 1.15) * 1.9) },
                      { id: `${item.product_id}-1000`, size_label: '1kg', price: Math.round(item.price * 3.6), compare_at_price: Math.round((item.compare_at_price || item.price * 1.15) * 3.6) },
                    ];

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

                        {/* Interactive Pack Size Selector with Explicit Pricing */}
                        <div className="bg-[#FAF6F0] p-2 rounded-xl border border-[#E8DFC9] space-y-1">
                          <span className="text-[9px] font-extrabold text-stone-600 uppercase tracking-wider block">
                            Choose Pack Size & Price:
                          </span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {availableVariants.map((v) => {
                              const isSelected = item.variant_id === v.id || item.size_label.toLowerCase() === v.size_label.toLowerCase();
                              return (
                                <button
                                  key={v.id || v.size_label}
                                  type="button"
                                  onClick={() => changeItemVariant(item.variant_id, v as any)}
                                  className={`text-left p-1.5 rounded-lg transition-all border cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#8B1E10] text-white border-[#8B1E10] shadow-xs ring-1 ring-[#8B1E10]'
                                      : 'bg-white text-stone-700 border-stone-200 hover:border-[#8B1E10]/40'
                                  }`}
                                >
                                  <span className="block text-[10px] font-black">{v.size_label}</span>
                                  <span className={`block text-[10px] font-extrabold ${isSelected ? 'text-amber-200' : 'text-[#8B1E10]'}`}>
                                    {formatCurrency(v.price)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
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

                {/* 5 Scrollable Relatable Recommendations Carousel */}
                <div className="pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8B1E10] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Relatable Andhra Pairings
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">Swipe →</span>
                  </div>

                  {/* Horizontal Scrollable Carousel */}
                  <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
                    {RELATABLE_ADDONS.map((addon) => (
                      <div
                        key={addon.id}
                        className="w-36 sm:w-40 bg-white border border-stone-200 rounded-xl p-2 space-y-1.5 shrink-0 shadow-2xs hover:border-[#8B1E10]/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-stone-100 border border-stone-100">
                            <Image src={addon.image} alt={addon.name} fill className="object-cover" />
                            <span className="absolute bottom-1 left-1 text-[8px] bg-stone-900/80 text-white px-1 rounded font-bold">
                              {addon.size_label}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-stone-900 line-clamp-1 mt-1.5">{addon.name}</h4>
                          <p className="text-[10px] text-stone-400 font-medium">{addon.tag}</p>
                        </div>

                        <div className="pt-1 border-t border-stone-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-extrabold text-[#8B1E10]">{formatCurrency(addon.price)}</span>
                            {addon.compare_at_price && (
                              <span className="block text-[9px] text-stone-400 line-through">
                                {formatCurrency(addon.compare_at_price)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleQuickAdd(addon)}
                            className="bg-[#8B1E10] hover:bg-[#72160B] text-white text-[10px] font-extrabold px-2 py-1 rounded-lg shadow-xs flex items-center gap-0.5 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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
                className="w-full bg-[#1C0A08] hover:bg-[#2C100D] active:scale-[0.99] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-between group transition-all cursor-pointer disabled:opacity-75"
              >
                <div className="flex items-center gap-2">
                  {isShopifyCheckoutLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-xs sm:text-sm tracking-wider uppercase font-black">
                    {isShopifyCheckoutLoading ? 'Connecting to Shopify...' : 'PROCEED TO CHECKOUT'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Supported Payment Logos / Badges */}
                <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                  <span className="text-emerald-300">Shopify Secure</span>
                  <span>•</span>
                  <span className="text-amber-300">UPI/Cards</span>
                </div>
              </button>

              {/* Direct WhatsApp UPI Alternative */}
              <div className="flex items-center justify-between text-[11px] pt-0.5 px-1">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="text-stone-600 hover:text-[#8B1E10] font-semibold underline flex items-center gap-1"
                >
                  <span>Or pay via Direct WhatsApp UPI</span>
                </Link>
                <span className="text-[10px] text-stone-400 font-medium">100% Encrypted</span>
              </div>

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
