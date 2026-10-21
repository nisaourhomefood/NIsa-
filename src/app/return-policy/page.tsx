import React from 'react';

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 text-stone-800 bg-[#FAF6F0]">
      <h1 className="text-3xl font-extrabold text-stone-900 border-b border-[#E8DFC9] pb-4">
        Return & Refund Policy
      </h1>
      
      <div className="space-y-4 text-xs leading-relaxed font-medium bg-white p-8 rounded-2xl border border-[#E8DFC9]">
        <h2 className="text-sm font-bold text-[#8B1E10]">1. Food Safety & Returns</h2>
        <p>Due to the perishable and consumable nature of food items, unopened jars can only be returned if received in a damaged condition or with seal compromise.</p>

        <h2 className="text-sm font-bold text-[#8B1E10]">2. Damaged Delivery Replacement</h2>
        <p>If your package arrives damaged, please take a photo/video upon unboxing and email us at care@nisafoods.com or WhatsApp +91 98765 43210 within 24 hours for a instant replacement jar dispatch.</p>

        <h2 className="text-sm font-bold text-[#8B1E10]">3. Refunds</h2>
        <p>Approved refunds are processed to original payment method or UPI within 3 to 5 business days.</p>
      </div>
    </div>
  );
}
