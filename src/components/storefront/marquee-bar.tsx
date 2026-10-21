'use client';

import React from 'react';

interface AnnouncementItem {
  emoji: string;
  label: string;
  labelColor: string; // hex background for the badge
  text: string;
}

// Curated rich items — shown when admin hasn't overridden
const DEFAULT_ITEMS: AnnouncementItem[] = [
  {
    emoji: '🎉',
    label: 'NEW OFFER',
    labelColor: '#C68B27',
    text: '₹99 OFF on orders above ₹1499 — Code: FIRSTORDER99',
  },
  {
    emoji: '🌶️',
    label: 'ANDHRA SPECIAL',
    labelColor: '#8B1E10',
    text: 'Authentic small-batch home food from Tenali Kitchen',
  },
  {
    emoji: '🚚',
    label: 'FAST DELIVERY',
    labelColor: '#166534',
    text: 'Shipped pan-India · Delivered in 3–5 business days',
  },
  {
    emoji: '⭐',
    label: 'TOP RATED',
    labelColor: '#92400E',
    text: '4.9★ Rated by 10,000+ Andhra families across India',
  },
  {
    emoji: '🫙',
    label: 'PURE & NATURAL',
    labelColor: '#14532D',
    text: 'Zero artificial preservatives · Zero chemicals · Ever',
  },
  {
    emoji: '🔥',
    label: 'BESTSELLER',
    labelColor: '#991B1B',
    text: 'Gongura Chicken Pickle — Customer Favourite',
  },
  {
    emoji: '🌿',
    label: 'NATURAL OIL',
    labelColor: '#1E4D2B',
    text: 'Every jar uses cold-pressed wood-pressed sesame oil',
  },
  {
    emoji: '🏠',
    label: 'SMALL BATCH',
    labelColor: '#78350F',
    text: 'Made in Tenali, Guntur District — never mass-produced',
  },
];

// One chip item with coloured badge label
function Chip({ item }: { item: AnnouncementItem }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* Coloured label badge */}
      <span
        className="inline-flex items-center gap-1 text-white text-[9.5px] font-extrabold px-2.5 py-[3px] rounded-full tracking-widest uppercase whitespace-nowrap shadow-sm"
        style={{ backgroundColor: item.labelColor, border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <span>{item.emoji}</span>
        <span>{item.label}</span>
      </span>
      {/* Message text */}
      <span className="text-amber-100 text-[11.5px] font-medium whitespace-nowrap">
        {item.text}
      </span>
    </span>
  );
}

// Divider between chips
function Divider() {
  return (
    <span className="text-white/20 text-xs mx-7 shrink-0">◆</span>
  );
}

// Full row of chips (rendered twice for seamless loop)
function ChipRow({ prefix }: { prefix: string }) {
  return (
    <>
      {DEFAULT_ITEMS.map((item, i) => (
        <React.Fragment key={`${prefix}-${i}`}>
          <Chip item={item} />
          <Divider />
        </React.Fragment>
      ))}
    </>
  );
}

// Parse admin plain text into simple chips when admin has set custom text
function PlainTextRow({ text, prefix }: { text: string; prefix: string }) {
  const parts = text.split(/\s*[✦•]\s*/).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={`${prefix}-${i}`}>
          <span className="inline-flex items-center gap-2">
            <span
              className="text-white text-[9.5px] font-extrabold px-2.5 py-[3px] rounded-full tracking-widest uppercase whitespace-nowrap"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              NISA
            </span>
            <span className="text-amber-100 text-[11.5px] font-medium whitespace-nowrap">{part.trim()}</span>
          </span>
          <span className="text-white/20 text-xs mx-7 shrink-0">◆</span>
        </React.Fragment>
      ))}
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface MarqueeBarProps {
  text: string;
}

export function MarqueeAnnouncementBar({ text }: MarqueeBarProps) {
  // Detect if admin has set rich custom text (contains emojis/custom separators beyond defaults)
  const isCustom = text.includes('✦') && text.length > 80;

  return (
    <div
      className="bg-[#8B1E10] overflow-hidden select-none border-b border-[#6B170A]"
      style={{ paddingTop: '8px', paddingBottom: '8px' }}
    >
      <div className="marquee-track items-center">
        {/* First copy */}
        <span className="marquee-content inline-flex items-center" style={{ paddingRight: '64px' }}>
          {isCustom
            ? <PlainTextRow text={text} prefix="a" />
            : <ChipRow prefix="a" />
          }
        </span>
        {/* Duplicate for seamless loop */}
        <span className="marquee-content inline-flex items-center" aria-hidden style={{ paddingRight: '64px' }}>
          {isCustom
            ? <PlainTextRow text={text} prefix="b" />
            : <ChipRow prefix="b" />
          }
        </span>
      </div>
    </div>
  );
}
