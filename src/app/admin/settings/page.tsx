'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, Check, Megaphone, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MarqueeAnnouncementBar } from '@/components/storefront/marquee-bar';

export default function AdminSettingsPage() {
  const [brandName, setBrandName] = useState('NISA');
  const [descriptor, setDescriptor] = useState('Mana Inti Vanta');
  const [address, setAddress] = useState('NISA Foods, Door No. 4-12-88, Guntur Road, Tenali - 522201, AP');
  const [phone, setPhone] = useState('+91 75693 44938');
  const [whatsapp, setWhatsapp] = useState('+91 75693 44938');
  const [email, setEmail] = useState('nisaourhomefood@gmail.com');
  const [flatShipping, setFlatShipping] = useState('79');
  const [announcementText, setAnnouncementText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  useEffect(() => {
    fetch('/api/announcement')
      .then((r) => r.json())
      .then((d) => { if (d.text) setAnnouncementText(d.text); })
      .catch(() => null);
  }, []);

  const handleSaveAnnouncement = async () => {
    const res = await fetch('/api/announcement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: announcementText }),
    });
    if (res.ok) {
      setAnnouncementSaved(true);
      setTimeout(() => setAnnouncementSaved(false), 2000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Store Settings</h1>
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
            Configure your brand, contact info, shipping, and live announcement bar.
          </p>
        </div>
      </div>

      {/* ── ANNOUNCEMENT BAR EDITOR ── */}
      <div className="bg-white border-2 border-[#8B1E10]/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-[#8B1E10]/5 border-b border-[#8B1E10]/10 p-3 sm:px-6 sm:py-4 flex items-center gap-2.5 sm:gap-3">
          <Megaphone className="w-5 h-5 text-[#8B1E10] shrink-0" />
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#8B1E10]">
              🔴 Scrolling Announcement Bar
            </h3>
            <p className="text-[10px] sm:text-xs text-stone-500 font-medium">
              Live across all pages of the storefront.
            </p>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="text-xs font-extrabold text-stone-700 block mb-1.5">
              Announcement Text
            </label>
            <textarea
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              rows={2}
              placeholder="e.g. Authentic Andhra Home Food • Made in Small Batches • Shipped Across India"
              className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none resize-none"
            />
            <p className="text-[10px] text-stone-400 font-medium mt-1">
              Use • to separate items. The text repeats continuously.
            </p>
          </div>

          {/* Live Preview */}
          {announcementText && (
            <div>
              <p className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider mb-1.5">Live Preview:</p>
              <div className="rounded-xl overflow-hidden border border-stone-200">
                <MarqueeAnnouncementBar text={announcementText} />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
            <p className="text-[11px] text-stone-500">
              💡 Changes take effect immediately across all storefront pages.
            </p>
            <Button
              onClick={handleSaveAnnouncement}
              className={`font-bold text-xs sm:text-sm px-5 py-2 w-full sm:w-auto ${announcementSaved ? 'bg-emerald-600' : 'bg-[#8B1E10] hover:bg-[#72160B]'} text-white`}
            >
              {announcementSaved ? <><Check className="w-4 h-4 mr-1.5" /> Saved!</> : <><Save className="w-4 h-4 mr-1.5" /> Save Announcement</>}
            </Button>
          </div>
        </div>
      </div>

      {/* Disconnected-from-live-site warning */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-300 rounded-xl p-3 sm:p-4">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 font-medium">
          <strong className="font-extrabold">Nothing below this line actually saves anywhere.</strong> The form shows
          a &quot;Saved!&quot; message, but brand name, address, phone, email, and shipping fee here are not connected
          to your live site — those are hardcoded directly in the site&apos;s pages. To change them for real, edit
          the page files directly or ask Claude to update them everywhere.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-4 sm:space-y-6">
        {/* Brand Details */}
        <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8B1E10] border-b border-stone-100 pb-2">
            1. Brand & Kitchen Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input label="Brand Name *" value={brandName} onChange={(e) => setBrandName(e.target.value)} required />
            <Input label="Brand Descriptor *" value={descriptor} onChange={(e) => setDescriptor(e.target.value)} required />
          </div>
          <Input label="Tenali Kitchen Physical Address *" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>

        {/* Contact & WhatsApp */}
        <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8B1E10] border-b border-stone-100 pb-2">
            2. Customer Care & WhatsApp Support
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Input label="Customer Care Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Input label="WhatsApp Support Number *" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
            <Input label="Support Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8B1E10] border-b border-stone-100 pb-2">
            3. Shipping Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input label="Flat Shipping Rate (₹) *" type="number" value={flatShipping} onChange={(e) => setFlatShipping(e.target.value)} required />
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-base">ℹ️</span>
              <div>
                <p className="text-xs font-bold text-amber-900">Standard Delivery</p>
                <p className="text-[10px] text-amber-700 font-medium">All orders are charged the flat shipping rate configured here.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto bg-[#8B1E10] text-white font-bold text-xs sm:text-sm py-2.5">
            {savedSuccess ? <><Check className="w-4 h-4 mr-2" /> Saved!</> : <><Save className="w-4 h-4 mr-2" /> Save Store Settings</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
