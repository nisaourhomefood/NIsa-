'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Eye, EyeOff, RefreshCw, X, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Banner {
  id: string;
  title: string;
  cta_link: string;
  image_url: string;
  sort_order: number;
  active: boolean;
}

const EMPTY_BANNER = {
  title: '',
  cta_link: '/products',
  image_url: '',
  sort_order: 0,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_BANNER);
  const [saving, setSaving] = useState(false);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      setBanners(Array.isArray(data) ? data : []);
    } catch {
      setBanners([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) return;
    setSaving(true);

    const res = await fetch('/api/admin/banners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title || 'Storefront Banner',
        subtitle: '',
        cta_text: '',
        cta_link: form.cta_link || '/products',
        image_url: form.image_url,
        bg_color: '#1C0A08',
        sort_order: banners.length,
      }),
    });

    if (res.ok) {
      const newBanner = await res.json();
      setBanners((prev) => [...prev, newBanner]);
      setForm(EMPTY_BANNER);
      setShowForm(false);
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, current: boolean) => {
    const res = await fetch('/api/admin/banners', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !current }),
    });
    if (res.ok) {
      setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, active: !current } : b)));
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
    if (res.ok) setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-3 sm:pb-5">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-stone-900">
            Homepage Full-Bleed Banners ({banners.length})
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
            Upload clean, complete graphic banner artwork (with your own designed buttons and text).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchBanners}
            className="p-2 border border-stone-200 rounded-xl bg-white hover:bg-stone-50 text-stone-600 transition-colors shrink-0"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <Button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold text-xs py-2 px-4 rounded-xl"
          >
            <Plus className="w-4 h-4 mr-1 shrink-0" /> Add Banner
          </Button>
        </div>
      </div>

      {/* 📐 Image Guidelines Box */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 sm:p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs sm:text-sm">
          <Info className="w-4 h-4 text-[#8B1E10] shrink-0" />
          <span>📐 Complete Graphic Banner Guidelines (Zero HTML Text Overlay)</span>
        </div>
        <p className="text-stone-600 text-xs leading-relaxed">
          The storefront displays your image <strong>exactly as designed</strong> without any HTML text or button overlays on top. 
          Recommended Dimensions: <strong className="text-stone-900 font-mono">1920 × 800 px (16:9 or 21:9 wide landscape)</strong>.
        </p>
      </div>

      {/* Banner Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-stone-400">
          <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2 text-[#8B1E10]" />
          <p className="text-xs font-medium">Loading banners…</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 border-dashed p-6">
          <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl">
            🖼️
          </div>
          <h3 className="font-bold text-stone-800 text-sm mb-1">No Banners Active</h3>
          <p className="text-xs text-stone-400 max-w-xs mx-auto mb-3">
            Add your graphic banner image URL. It will display full-width on the homepage.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#8B1E10] text-white font-bold text-xs"
          >
            <Plus className="w-4 h-4 mr-1" /> Add First Banner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white border rounded-2xl overflow-hidden shadow-2xs transition-all ${
                banner.active ? 'border-stone-200' : 'border-stone-200 opacity-60'
              }`}
            >
              {/* Pure Graphic Banner Preview */}
              <div className="relative aspect-16/9 w-full bg-stone-900">
                {banner.image_url ? (
                  <Image src={banner.image_url} alt={banner.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs">
                    No image URL
                  </div>
                )}
              </div>

              {/* Banner Controls Row */}
              <div className="p-3 flex items-center justify-between gap-2 border-t border-stone-100 text-xs">
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-stone-900 block truncate">{banner.title}</span>
                  <span className="text-[10px] text-stone-400 font-mono block truncate">
                    Destination: {banner.cta_link}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(banner.id, banner.active)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                      banner.active
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    {banner.active ? <Eye className="w-3 h-3 text-emerald-700" /> : <EyeOff className="w-3 h-3" />}
                    {banner.active ? 'Live' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Banner Modal (Clean Image Only) */}
      {showForm && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="text-sm sm:text-base font-black text-stone-900">Add Complete Graphic Banner</h3>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <Input
                label="Banner Name (For your reference) *"
                placeholder="e.g. Authentic Andhra Pickles Hero Banner"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-extrabold text-stone-700">Banner Image URL *</label>
                  <span className="text-[10px] text-stone-400 font-mono font-bold">1920 × 800 px</span>
                </div>
                <Input
                  placeholder="https://... (Direct image link from Imgur, Cloudinary, etc.)"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  required
                />
              </div>

              {/* Live Preview (Zero Text Overlay) */}
              {form.image_url && (
                <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                  <Image src={form.image_url} alt="Banner Preview" fill className="object-cover" />
                </div>
              )}

              <Input
                label="Where should clicking the banner take the customer? *"
                placeholder="/products (or product link)"
                value={form.cta_link}
                onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                required
              />

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-stone-200">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold"
                >
                  {saving ? 'Saving…' : 'Publish Banner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
