'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TextBanner {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  bg_color: string;
}

interface GraphicBanner {
  id: string;
  title: string;
  image_url: string;
  cta_link: string;
}

const DEFAULT_BANNERS: TextBanner[] = [
  {
    id: 'b1',
    title: 'The Taste of Andhra, Just Like Home.',
    subtitle: 'Small-batch pickles prepared in Tenali with wood-pressed sesame oil & Guntur red chilies.',
    cta_text: 'Shop All Pickles',
    cta_link: '/products',
    image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1600&auto=format&fit=crop',
    bg_color: '#1C0A08',
  },
  {
    id: 'b2',
    title: 'Gongura Chicken — An Andhra Legend.',
    subtitle: 'Tangy sorrel leaves folded into spiced boneless chicken. A Tenali household favourite.',
    cta_text: 'View Gongura Range',
    cta_link: '/products',
    image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1600&auto=format&fit=crop',
    bg_color: '#0F1A0B',
  },
  {
    id: 'b3',
    title: 'First Order? ₹99 Off on ₹1499+',
    subtitle: 'Use code FIRSTORDER99 at checkout. Delivered fresh from our Tenali kitchen across India.',
    cta_text: 'Claim Your Discount',
    cta_link: '/products',
    image_url: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=1600&auto=format&fit=crop',
    bg_color: '#1A0E04',
  },
];

export function BannerCarousel() {
  const [graphicBanners, setGraphicBanners] = useState<GraphicBanner[]>([]);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) setGraphicBanners(d);
      })
      .catch(() => null);
  }, []);

  const usingGraphicBanners = graphicBanners.length > 0;
  const slideCount = usingGraphicBanners ? graphicBanners.length : DEFAULT_BANNERS.length;

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(idx);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slideCount);
  }, [current, slideCount, goTo]);

  const prev = () => goTo((current - 1 + slideCount) % slideCount);

  // Auto-scroll every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  // Reset to first slide if the active banner set changes size
  useEffect(() => {
    setCurrent(0);
  }, [usingGraphicBanners]);

  if (usingGraphicBanners) {
    const banner = graphicBanners[current];
    return (
      <div className="relative w-full overflow-hidden h-[320px] sm:h-[52vh] sm:min-h-[380px] sm:max-h-[560px]">
        <Link
          href={banner.cta_link || '/products'}
          className="absolute inset-0 transition-opacity duration-500 block"
          style={{ opacity: isTransitioning ? 0.6 : 1 }}
        >
          <Image src={banner.image_url} alt={banner.title || 'NISA Banner'} fill className="object-cover" priority />
        </Link>

        {slideCount > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {graphicBanners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all ${
                    i === current ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  const banner = DEFAULT_BANNERS[current];

  return (
    <div className="relative w-full overflow-hidden h-[320px] sm:h-[52vh] sm:min-h-[380px] sm:max-h-[560px]">
      {/* Background Image with overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: isTransitioning ? 0.6 : 1 }}
      >
        <Image
          src={banner.image_url}
          alt={banner.title}
          fill
          className="object-cover"
          priority
        />
        {/* Horizontal scrim for the text column + a bottom scrim as a contrast safety net on bright photos */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${banner.bg_color}F7 0%, ${banner.bg_color}CC 45%, ${banner.bg_color}66 100%), linear-gradient(0deg, ${banner.bg_color}99 0%, transparent 55%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
        <div
          className="max-w-xl transition-all duration-500"
          style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(12px)' : 'translateY(0)' }}
        >
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            {banner.title}
          </h1>
          <p className="text-white/90 text-xs sm:text-base font-medium mb-5 sm:mb-7 max-w-md leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
            {banner.subtitle}
          </p>
          <Link
            href={banner.cta_link}
            className="inline-block bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            {banner.cta_text} →
          </Link>
        </div>
      </div>

      {/* Prev / Next Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {DEFAULT_BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${
              i === current
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
