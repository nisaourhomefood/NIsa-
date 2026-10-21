'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  PackageCheck,
  Truck,
  ArrowRight,
  Printer,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Clock,
  QrCode,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Official Starburst Scallop Verified Badge Component (Exact Match with Reference Image)
function VerifiedScallopBadge() {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer celebratory radiant glow */}
      <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-lg animate-pulse" />

      {/* SVG Starburst Scallop Badge */}
      <svg
        viewBox="0 0 24 24"
        className="w-20 h-20 sm:w-24 sm:h-24 text-[#1D9BF0] fill-current drop-shadow-xl transition-transform hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M22.5 12.5c0-1.58-.8-3.03-2.12-3.87.35-1.58-.02-3.26-1.02-4.48-1-1.22-2.58-1.78-4.14-1.5-.78-1.42-2.22-2.35-3.84-2.45-1.62.1-3.06 1.03-3.84 2.45-1.56-.28-3.14.28-4.14 1.5-1 1.22-1.37 2.9-1.02 4.48C1.06 9.47.26 10.92.26 12.5s.8 3.03 2.12 3.87c-.35 1.58.02 3.26 1.02 4.48 1 1.22 2.58 1.78 4.14 1.5.78 1.42 2.22 2.35 3.84 2.45 1.62-.1 3.06-1.03 3.84-2.45 1.56.28 3.14-.28 4.14-1.5 1-1.22 1.37-2.9 1.02-4.48 1.32-.84 2.12-2.29 2.12-3.87z" />
        {/* Bold White Checkmark */}
        <path
          d="M10.2 16.6l-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4-8 8z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
}

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<any>(null);

  // Trigger high-energy celebratory confetti paper blast
  const fireCelebrationConfetti = useCallback(() => {
    // 1. Center burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B1E10', '#1D9BF0', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
    });

    // 2. Left side cannon blast
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#1D9BF0', '#F59E0B', '#10B981', '#8B1E10'],
      });
    }, 250);

    // 3. Right side cannon blast
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#1D9BF0', '#EC4899', '#F59E0B', '#10B981'],
      });
    }, 450);

    // 4. Star confetti shower
    setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.4 },
        shapes: ['star', 'circle'],
        colors: ['#FFD700', '#FFA500', '#FF4500'],
      });
    }, 700);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`nisa_order_${orderId}`);
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }

    // Auto-fire confetti on page mount
    fireCelebrationConfetti();
  }, [orderId, fireCelebrationConfetti]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 sm:space-y-8 bg-[#FAF6F0] min-h-screen">
      
      {/* ── Top Hero Celebration Card with Scalloped Verified Badge ── */}
      <div className="bg-white border border-[#E8DFC9] rounded-3xl p-6 sm:p-10 text-center space-y-4 sm:space-y-5 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative background shine */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-blue-100/40 via-amber-100/20 to-transparent rounded-full pointer-events-none" />

        {/* 🌟 Iconic Scalloped Starburst Verified Badge (Exact Match with Reference Image) */}
        <div className="pt-2">
          <VerifiedScallopBadge />
        </div>

        {/* Verification Pill */}
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-black text-[#1D9BF0] tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1D9BF0]" />
            Order Verified & Confirmed
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-4xl font-black text-stone-900 leading-tight">
          Thank You For Choosing NISA (నిస)!
        </h1>

        <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto font-medium leading-relaxed">
          Your order has been registered. Order Number:
          <strong className="text-[#8B1E10] font-mono text-sm sm:text-base block mt-0.5 font-black">
            {orderId}
          </strong>
        </p>

        {/* Trust Badges Bar */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-700 font-bold">
          <div className="bg-[#FAF6F0] px-3.5 py-2 rounded-xl border border-[#E8DFC9] flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Preparation: <strong>Handcrafted in 24–48 Hours</strong></span>
          </div>

          <div className="bg-[#FAF6F0] px-3.5 py-2 rounded-xl border border-[#E8DFC9] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#8B1E10] shrink-0" />
            <span>Tracking ID: <strong>Sent to WhatsApp on Dispatch</strong></span>
          </div>

          <button
            onClick={fireCelebrationConfetti}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Replay Celebration Blast"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>Celebrate Again 🎉</span>
          </button>
        </div>

      </div>

      {/* ── 100% Prepaid WhatsApp Payment Next Steps Banner ── */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-950 font-black text-sm sm:text-base">
          <Clock className="w-5 h-5 text-emerald-700" />
          <span>Next Step: Complete Payment on WhatsApp & Get Live Tracking</span>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed font-medium">
          Because each batch is prepared fresh without preservatives by Saraswati in Tenali, all orders are <strong>100% Prepaid via UPI</strong>. Please share your payment screenshot on WhatsApp to confirm your batch preparation.
        </p>
        <div className="pt-1">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '917569344938'}?text=${encodeURIComponent(`Hi NISA Team, here is my payment screenshot for Order ID: ${orderId}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Send Payment Screenshot on WhatsApp
          </a>
        </div>
      </div>

      {/* ── Order Details Grid ── */}
      {order && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Shipping Address */}
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-4 sm:p-6 space-y-3 shadow-xs">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#8B1E10] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Delivery Address
            </h3>
            <div className="text-xs text-stone-700 leading-relaxed font-medium space-y-0.5">
              <p className="font-black text-stone-900 text-sm">{order.customer?.full_name}</p>
              <p>{order.customer?.address_line1}</p>
              {order.customer?.address_line2 && <p>{order.customer?.address_line2}</p>}
              {order.customer?.landmark && <p>Near: {order.customer?.landmark}</p>}
              <p>{order.customer?.city}, {order.customer?.state} - {order.customer?.postal_code}</p>
              <p className="mt-2 text-stone-600 flex items-center gap-1 font-bold">
                <Phone className="w-3.5 h-3.5 text-[#8B1E10]" /> Mobile: {order.customer?.phone}
              </p>
            </div>
          </div>

          {/* Payment & Order Status Details */}
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-4 sm:p-6 space-y-3 shadow-xs">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#8B1E10]">
              Order & Payment Summary
            </h3>
            <div className="text-xs text-stone-700 space-y-2 font-medium">
              <div className="flex justify-between">
                <span>Order Status:</span>
                <span className="text-amber-900 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                  {order.order_status || 'placed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <strong className="text-stone-900 uppercase">
                  {order.paymentMethod === 'cashfree'
                    ? 'Cashfree Gateway'
                    : 'WhatsApp + 100% Prepaid UPI'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="text-amber-800 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">
                  {order.payment_status || 'pending'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-extrabold text-stone-900">
                <span>Total Amount:</span>
                <span className="text-[#8B1E10] text-base sm:text-lg">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Items Purchased Table */}
          <div className="md:col-span-2 bg-white border border-[#E8DFC9] rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#8B1E10]">
              Purchased Products ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-stone-100">
              {order.items?.map((item: any) => (
                <div key={item.variant_id} className="py-3 first:pt-0 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-stone-900 text-xs sm:text-sm truncate">{item.name}</h4>
                      <p className="text-stone-500 font-medium">
                        Size: {item.size_label} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-[#8B1E10] shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '917569344938'}?text=${encodeURIComponent(`Hi NISA Team, I have a query about my order ${orderId}`)}`}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto"
        >
          <Button size="lg" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl">
            <MessageSquare className="w-4 h-4 mr-2" /> Chat with Tenali Kitchen
          </Button>
        </a>

        <Link href="/products" className="w-full sm:w-auto">
          <Button size="lg" className="w-full bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold text-xs sm:text-sm rounded-xl">
            <span>Continue Shopping</span> <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={() => window.print()}
          className="w-full sm:w-auto text-stone-800 border-stone-300 hover:bg-stone-100 font-bold text-xs sm:text-sm rounded-xl"
        >
          <Printer className="w-4 h-4 mr-2" /> Print Receipt
        </Button>
      </div>

    </div>
  );
}
