'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Banner {
  id: string;
  title: string;
  cta_link: string;
  image_url: string;
  active: boolean;
}

export function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetch('/api/admin/banners')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const activeBanners = data.filter((b: Banner) => b.active && b.image_url);
          setBanners(activeBanners);
        }
      })
      .catch(() => setBanners([]));
  }, []);

  // Auto-cycle through multiple banners if there are more than 1
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // If complete graphic banner images are uploaded in admin, render clean full-bleed banner without text overlays
  if (banners.length > 0) {
    const banner = banners[currentIdx];
    return (
      <section className="relative w-full overflow-hidden bg-stone-950">
        <Link href={banner.cta_link || '/products'} className="block relative w-full aspect-16/7 sm:aspect-21/9 md:aspect-24/9 max-h-[580px]">
          <Image
            src={banner.image_url}
            alt={banner.title || 'NISA Authentic Pickles'}
            fill
            priority
            className="object-cover transition-opacity duration-700"
          />
        </Link>

        {/* Carousel indicators if multiple banners */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIdx ? 'w-6 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  // Fallback Hero Section when no custom graphic banners are added
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF6F0] via-[#FFFDF9] to-[#F5EFE6] text-stone-900 py-12 lg:py-18 border-b border-[#E8DFC9]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1E10]/10 border border-[#8B1E10]/20 text-[#8B1E10] text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#8B1E10]" />
              <span>Handmade at Home by Saraswati • Tenali, AP</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-stone-900">
              THE TASTE OF ANDHRA, <br />
              <span className="text-[#8B1E10] font-serif italic">
                JUST LIKE HOME.
              </span>
            </h1>

            <p className="text-stone-700 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Authentic small-batch pickles cooked by <strong>Saraswati</strong> from her home kitchen in Tenali. Made with pure wood-pressed sesame oil, fresh Guntur red chilies, and zero chemical preservatives.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold px-8 py-3 rounded-xl shadow-lg shadow-[#8B1E10]/20 transition-all group">
                  <span>Order Saraswati's Pickles</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/story" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-[#D8CCA8] bg-white text-stone-900 hover:bg-[#F3ECE2] font-bold px-6 py-3 rounded-xl">
                  Saraswati's Story
                </Button>
              </Link>
            </div>

            {/* Key Trust Summary */}
            <div className="pt-4 border-t border-[#E8DFC9] grid grid-cols-3 gap-3 text-center lg:text-left text-xs font-bold text-stone-700">
              <div>
                <span className="block text-lg sm:text-2xl font-black text-[#8B1E10]">100%</span>
                <span className="text-[10px] sm:text-xs">Home-Cooked</span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-black text-[#8B1E10]">5kg</span>
                <span className="text-[10px] sm:text-xs">Brass Uruli Batches</span>
              </div>
              <div>
                <span className="block text-lg sm:text-2xl font-black text-[#8B1E10]">0%</span>
                <span className="text-[10px] sm:text-xs">Factory Chemicals</span>
              </div>
            </div>

          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl bg-white border border-[#E8DFC9] p-4 sm:p-5 space-y-3.5 shadow-xl">
              <div className="bg-[#FAF6F0] border border-[#E8DFC9] rounded-2xl p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-12 h-12 shrink-0">
                    <Image src="/nisaralogo.png" alt="NISA Logo" fill className="object-contain" />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#8B1E10] block">
                      Mana Inti Vanta
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-stone-900">
                      NISA (నిస)
                    </h3>
                  </div>
                </div>
                <span className="text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg">
                  Tenali, AP
                </span>
              </div>

              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop"
                  alt="Authentic Andhra Boneless Chicken Pickle"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
