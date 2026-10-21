'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  bg_color: string;
}

const DEFAULT_BANNERS: Banner[] = [
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
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const banners = DEFAULT_BANNERS;

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
    goTo((current + 1) % banners.length);
  }, [current, banners.length, goTo]);

  const prev = () => goTo((current - 1 + banners.length) % banners.length);

  // Auto-scroll every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const banner = banners[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '52vh', minHeight: '380px' }}>
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
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${banner.bg_color}F0 0%, ${banner.bg_color}99 50%, ${banner.bg_color}44 100%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col justify-center">
        <div
          className="max-w-xl transition-all duration-500"
          style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? 'translateY(12px)' : 'translateY(0)' }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
            {banner.title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base font-medium mb-7 max-w-md leading-relaxed">
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
        {banners.map((_, i) => (
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
