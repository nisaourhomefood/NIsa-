'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string; // used only as the image's alt text, never rendered
  cta_text: string;
  cta_link: string;
  image_url: string;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'default',
    title: 'NISA — Authentic Andhra Home Food',
    cta_text: 'Shop All Pickles',
    cta_link: '/products',
    image_url: '/making.png',
  },
];

// Fills in sensible defaults for any field an admin-created banner left blank.
function withDefaults(b: Partial<Banner> & { id: string; image_url: string }): Banner {
  return {
    id: b.id,
    title: b.title || 'NISA — Authentic Andhra Home Food',
    cta_text: b.cta_text || 'Shop Now',
    cta_link: b.cta_link || '/products',
    image_url: b.image_url,
  };
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetch('/api/banners')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) {
          setBanners(d.map(withDefaults));
          setCurrent(0);
        }
      })
      .catch(() => null);
  }, []);

  const slideCount = banners.length;

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
    if (slideCount <= 1) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next, slideCount]);

  const banner = banners[current];

  return (
    <div className="relative w-full overflow-hidden h-[320px] sm:h-[52vh] sm:min-h-[380px] sm:max-h-[560px]">
      {/* The whole banner is one link — clicking anywhere on the image navigates to cta_link */}
      <Link href={banner.cta_link} className="absolute inset-0 block" aria-label={banner.cta_text}>
        <Image
          src={banner.image_url}
          alt={banner.title}
          fill
          sizes="100vw"
          className="object-cover transition-opacity duration-500"
          style={{ opacity: isTransitioning ? 0.6 : 1 }}
          priority
        />
        <span className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 inline-block bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold px-7 py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl">
          {banner.cta_text} →
        </span>
      </Link>

      {/* Prev / Next Arrows */}
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

          {/* Dot Indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((_, i) => (
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
