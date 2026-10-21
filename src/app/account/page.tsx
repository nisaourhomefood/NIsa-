'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Package, MapPin, Share2, RotateCcw, ShoppingBag, Check, Copy } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-context';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-products';
import { Button } from '@/components/ui/button';

export default function CustomerAccountPage() {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile' | 'referral'>('orders');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  // Mock previous orders history
  const previousOrders = [
    {
      id: 'NISA-89412',
      date: '2026-08-15',
      status: 'delivered',
      total: 649,
      item: {
        product: INITIAL_PRODUCTS[0], // Boneless chicken
        variant: INITIAL_PRODUCTS[0].variants[1], // 500g
        quantity: 1,
      },
    },
    {
      id: 'NISA-89301',
      date: '2026-07-28',
      status: 'delivered',
      total: 999,
      item: {
        product: INITIAL_PRODUCTS[8], // Nut & Seed Laddu
        variant: INITIAL_PRODUCTS[8].variants[2], // 1kg
        quantity: 1,
      },
    },
  ];

  const referralCode = 'REFER-SRINI50';

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`Use my NISA referral code ${referralCode} to get ₹50 off your first Andhra pickle box! https://nisafoods.com`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  const handleReorder = (order: typeof previousOrders[0]) => {
    addItem(order.item.product, order.item.variant, order.item.quantity);
    setReorderedId(order.id);
    setTimeout(() => setReorderedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#FAF6F0]">
      
      {/* Header */}
      <div className="bg-white border border-[#E8DFC9] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#8B1E10] font-extrabold text-xl shrink-0">
            SR
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">Srinivas Rao K.</h1>
            <p className="text-xs text-stone-600 font-medium">srinivas.rao@example.com • +91 98765 43210</p>
            <span className="inline-block mt-1 text-[10px] uppercase font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified NISA Family Member
            </span>
          </div>
        </div>

        <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-[#E8DFC9] text-center sm:text-right text-xs">
          <span className="text-stone-500 font-bold block">Your Referral Code:</span>
          <span className="font-mono font-extrabold text-[#8B1E10] text-sm">{referralCode}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8DFC9] overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 font-bold text-xs rounded-xl transition-colors ${
            activeTab === 'orders'
              ? 'bg-[#8B1E10] text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E8DFC9]'
          }`}
        >
          <Package className="w-4 h-4 inline mr-1.5" /> Order History & Reorder
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-5 py-3 font-bold text-xs rounded-xl transition-colors ${
            activeTab === 'addresses'
              ? 'bg-[#8B1E10] text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E8DFC9]'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-1.5" /> Saved Addresses
        </button>

        <button
          onClick={() => setActiveTab('referral')}
          className={`px-5 py-3 font-bold text-xs rounded-xl transition-colors ${
            activeTab === 'referral'
              ? 'bg-[#8B1E10] text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E8DFC9]'
          }`}
        >
          <Share2 className="w-4 h-4 inline mr-1.5" /> Refer & Earn ₹50
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-5 py-3 font-bold text-xs rounded-xl transition-colors ${
            activeTab === 'profile'
              ? 'bg-[#8B1E10] text-white shadow-xs'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E8DFC9]'
          }`}
        >
          <User className="w-4 h-4 inline mr-1.5" /> Profile Settings
        </button>
      </div>

      {/* TAB CONTENT: Orders & 1-Click Reorder */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Running Low Reorder Banner */}
          <div className="bg-[#8B1E10] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">
                Running Low on Pickle?
              </span>
              <h3 className="text-lg font-extrabold text-amber-50">
                Reorder Your Favorite Tenali Jar in 1-Click
              </h3>
              <p className="text-xs text-red-100 font-medium mt-0.5">
                Keep your dining table stocked with fresh small-batch home pickles.
              </p>
            </div>
            <Button
              onClick={() => handleReorder(previousOrders[0])}
              className="bg-[#C68B27] hover:bg-amber-600 text-stone-950 font-extrabold shrink-0"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" /> Reorder Boneless Chicken
            </Button>
          </div>

          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
              Previous Orders
            </h3>

            <div className="space-y-4">
              {previousOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image src={ord.item.product.images[0]} alt="" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-stone-900 text-xs">{ord.id}</span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold uppercase px-2 py-0.5 rounded border border-emerald-200">
                          {ord.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm">{ord.item.product.name} ({ord.item.variant.size_label})</h4>
                      <span className="text-xs text-stone-500 font-medium">Ordered on {ord.date} • {formatCurrency(ord.total)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleReorder(ord)}
                    size="sm"
                    className={`font-bold shrink-0 ${
                      reorderedId === ord.id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#8B1E10] hover:bg-[#72160B] text-white'
                    }`}
                  >
                    {reorderedId === ord.id ? (
                      <>
                        <Check className="w-4 h-4 mr-1" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4 mr-1" /> 1-Click Reorder
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
            Saved Delivery Addresses
          </h3>
          <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] space-y-2 text-xs text-stone-700 font-medium max-w-md">
            <div className="flex justify-between items-start">
              <strong className="text-stone-900 text-sm">Srinivas Rao K. (Default Home)</strong>
              <span className="text-[10px] bg-[#8B1E10] text-white px-2 py-0.5 rounded font-bold">Default</span>
            </div>
            <p>Door No. 4-12, Heritage Apartments, Guntur Road</p>
            <p>Tenali, Andhra Pradesh - 522201</p>
            <p>Mobile: +91 98765 43210</p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Refer & Earn */}
      {activeTab === 'referral' && (
        <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 space-y-4 shadow-xs max-w-xl">
          <h3 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
            Refer Friends & Get ₹50 Off
          </h3>
          <p className="text-xs text-stone-600 font-medium">
            Share your unique referral link with friends and family. When they place their first order, they get ₹50 off and you get ₹50 credit!
          </p>

          <div className="flex items-center gap-2 bg-[#FAF6F0] p-3 rounded-xl border border-[#E8DFC9]">
            <span className="font-mono font-bold text-xs text-stone-900 flex-1">{referralCode}</span>
            <Button onClick={handleCopyReferral} size="sm" className="bg-[#8B1E10] text-white font-bold">
              {copiedReferral ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copiedReferral ? 'Copied!' : 'Copy Code'}
            </Button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 space-y-4 shadow-xs max-w-md">
          <h3 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
            Profile Details
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-stone-500 font-bold block">Full Name</label>
              <input type="text" defaultValue="Srinivas Rao K." className="w-full bg-[#FAF6F0] border border-[#D8CCA8] rounded-lg p-2 font-semibold text-stone-900 mt-1" />
            </div>
            <div>
              <label className="text-stone-500 font-bold block">Email Address</label>
              <input type="email" defaultValue="srinivas.rao@example.com" className="w-full bg-[#FAF6F0] border border-[#D8CCA8] rounded-lg p-2 font-semibold text-stone-900 mt-1" />
            </div>
            <div>
              <label className="text-stone-500 font-bold block">Mobile Number</label>
              <input type="text" defaultValue="+91 98765 43210" className="w-full bg-[#FAF6F0] border border-[#D8CCA8] rounded-lg p-2 font-semibold text-stone-900 mt-1" />
            </div>
            <Button className="bg-[#8B1E10] text-white font-bold w-full">Save Changes</Button>
          </div>
        </div>
      )}

    </div>
  );
}
