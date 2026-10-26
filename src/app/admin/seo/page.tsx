'use client';

import React, { useState } from 'react';
import { Globe, Save, Check, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminSEOPage() {
  const [metaTitle, setMetaTitle] = useState('NISA (నిస) - Authentic Small-Batch Andhra Pickles | Tenali AP');
  const [metaDesc, setMetaDesc] = useState('Buy handcrafted Andhra boneless chicken pickle, gongura mutton pickle, sea prawns pickle & chicken podi online. Small-batch home recipes made in Tenali with wood-pressed sesame oil.');
  const [ogImage, setOgImage] = useState('https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1200&auto=format&fit=crop');
  const [canonicalUrl, setCanonicalUrl] = useState('https://nisaourhomefood.in');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSEO = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">SEO & Meta Tags Controls</h1>
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5">
            Manage global search engine titles, social sharing previews, and meta descriptions.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={handleSaveSEO} className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5">
            {savedSuccess ? <Check className="w-4 h-4 mr-1 shrink-0" /> : <Save className="w-4 h-4 mr-1 shrink-0" />}
            {savedSuccess ? 'SEO Saved!' : 'Save SEO Meta'}
          </Button>
        </div>
      </div>

      {/* Disconnected-from-live-site warning */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-300 rounded-xl p-3 sm:p-4">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 font-medium">
          <strong className="font-extrabold">This form doesn&apos;t actually change your site&apos;s SEO.</strong> It
          shows &quot;Saved!&quot; but nothing here is read by the live site — real metadata is set directly in the
          page files (src/app/layout.tsx and each page&apos;s own metadata). Ask Claude to change it there instead.
        </p>
      </div>

      <form onSubmit={handleSaveSEO} className="space-y-4 sm:space-y-6">
        {/* Global SEO Settings */}
        <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8B1E10] border-b border-stone-100 pb-2">
            1. Search Engine Optimization (SEO)
          </h3>
          <Input
            label="Default Page Title *"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Meta Description *
            </label>
            <textarea
              rows={3}
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full rounded-xl border border-[#D8CCA8] bg-white px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none resize-none"
              required
            />
          </div>
        </div>

        {/* Open Graph & Social Sharing */}
        <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8B1E10] border-b border-stone-100 pb-2">
            2. Social Media Open Graph (OG)
          </h3>
          <Input
            label="Open Graph Share Image URL (OG Image) *"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            required
          />
          <Input
            label="Canonical URL *"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto bg-[#8B1E10] text-white font-bold text-xs sm:text-sm py-2.5">
            <Save className="w-4 h-4 mr-2" /> Save SEO Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
