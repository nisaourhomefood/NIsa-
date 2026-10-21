'use client';

import React, { useState } from 'react';
import { LayoutTemplate, Save, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminHomepageCMSPage() {
  const [announcement, setAnnouncement] = useState('Authentic Andhra Home Food • Made in Small Batches • Delivered Across India');
  const [heroHeading, setHeroHeading] = useState('THE TASTE OF ANDHRA, JUST LIKE HOME.');
  const [heroDescription, setHeroDescription] = useState('Traditional Andhra recipes made in small batches in Tenali, Andhra Pradesh.');
  const [finalCTAHeading, setFinalCTAHeading] = useState('Bring Andhra Home.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Homepage CMS Content</h1>
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5">
            Edit live announcement bar text, hero banner headlines, CTAs, and promotional messaging.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={handleSaveCMS} className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5">
            {savedSuccess ? <Check className="w-4 h-4 mr-1 shrink-0" /> : <Save className="w-4 h-4 mr-1 shrink-0" />}
            {savedSuccess ? 'Changes Saved!' : 'Save CMS Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSaveCMS} className="space-y-4 sm:space-y-6">
        {/* Section 1: Announcement Bar */}
        <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8B1E10] border-b border-stone-100 pb-2">
            1. Announcement Bar Text
          </h3>
          <Input
            label="Announcement Message"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
        </div>

        {/* Section 2: Hero Section */}
        <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8B1E10] border-b border-stone-100 pb-2">
            2. Hero Banner Content
          </h3>
          <Input
            label="Hero Main Headline *"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Hero Supporting Description *
            </label>
            <textarea
              rows={3}
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full rounded-xl border border-[#D8CCA8] bg-white px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Section 3: Final CTA */}
        <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#8B1E10] border-b border-stone-100 pb-2">
            3. Final Call to Action
          </h3>
          <Input
            label="Final CTA Headline *"
            value={finalCTAHeading}
            onChange={(e) => setFinalCTAHeading(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto bg-[#8B1E10] text-white font-bold text-xs sm:text-sm py-2.5">
            <Save className="w-4 h-4 mr-2" /> Publish Live CMS Updates
          </Button>
        </div>
      </form>
    </div>
  );
}
