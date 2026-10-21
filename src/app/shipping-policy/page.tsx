import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-stone-800 bg-[#FAF6F0]">
      <h1 className="text-3xl font-extrabold text-stone-900 border-b border-[#E8DFC9] pb-4">
        Shipping & Delivery Policy
      </h1>
      
      <div className="space-y-4 text-xs leading-relaxed font-medium bg-white p-8 rounded-2xl border border-[#E8DFC9]">
        <h2 className="text-sm font-bold text-[#8B1E10]">1. Shipping Locations</h2>
        <p>NISA ships fresh small-batch pickles, podis, and sweets directly from our kitchen in Tenali, Andhra Pradesh to pin codes across India.</p>

        <h2 className="text-sm font-bold text-[#8B1E10]">2. Order Dispatch Time</h2>
        <p>Orders are freshly packed within 24 hours of batch preparation. Orders placed before 12 PM IST are dispatched on the same business day.</p>

        <h2 className="text-sm font-bold text-[#8B1E10]">3. Shipping Rates & Free Shipping</h2>
        <p>Free Express Shipping is automatically applied to all orders above ₹999 across India. For orders under ₹999, a flat shipping fee of ₹79 applies.</p>

        <h2 className="text-sm font-bold text-[#8B1E10]">4. Estimated Delivery Time</h2>
        <p>Nationwide express courier delivery typically takes 3 to 5 business days from dispatch.</p>
      </div>
    </div>
  );
}
