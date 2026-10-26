'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { CartDrawer } from '@/components/storefront/cart-drawer';
import { MarqueeAnnouncementBar } from '@/components/storefront/marquee-bar';

export function Navbar() {
  const { totalItemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcement, setAnnouncement] = useState(
    '🌶️  Authentic Andhra Home Food          ✦          🏠  Made in Small Batches in Tenali          ✦          🚚  Shipped Pan-India in 3–5 Days          ✦          🎉  First Order? ₹99 OFF on ₹1499+ — Use code FIRSTORDER99          ✦          🫙  Zero Artificial Preservatives          ✦          ⭐  4.9★ Rated by 10,000+ Andhra Families'
  );

  useEffect(() => {
    fetch('/api/announcement')
      .then((r) => r.json())
      .then((d) => { if (d.text) setAnnouncement(d.text); })
      .catch(() => null);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Combos', href: '/combos' },
    { name: 'Our Story', href: '/story' },
    { name: 'Recipes & Stories', href: '/recipes' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* 1. Scrolling Announcement Bar */}
      <MarqueeAnnouncementBar text={announcement} />

      {/* 2. Header */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8DFC9] text-stone-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-[#F3ECE2] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#8B1E10]" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo - Official NISA Jar Branding */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 py-1">
            <div className="relative h-14 w-14 group-hover:scale-105 transition-transform">
              <Image
                src="/nisaralogo.png"
                alt="NISA (నిస) - Mana Inti Vanta"
                fill
                sizes="56px"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-[#8B1E10] group-hover:text-[#72160B] transition-colors">
                NISA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#C68B27] font-bold">
                Mana Inti Vanta • Tenali
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-stone-800 hover:text-[#8B1E10] transition-colors py-2"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons: Search, Account, Cart */}
          <div className="flex items-center space-x-3">
            
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-stone-700 hover:text-[#8B1E10] hover:bg-[#F3ECE2] transition-colors"
              aria-label="Search catalogue"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* My Account */}
            <Link
              href="/account"
              className="p-2 rounded-lg text-stone-700 hover:text-[#8B1E10] hover:bg-[#F3ECE2] transition-colors"
              title="My Account & Orders"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#8B1E10] text-[#FAF6F0] hover:bg-[#72160B] transition-all shadow-sm flex items-center gap-2"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-200" />
              <span className="hidden sm:inline text-xs font-bold text-white">Cart</span>
              {totalItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C68B27] text-stone-950 text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="bg-[#FAF6F0] border-t border-[#E8DFC9] px-4 py-3 shadow-inner">
            <div className="max-w-3xl mx-auto flex items-center gap-2">
              <Search className="w-5 h-5 text-[#8B1E10]" />
              <input
                type="text"
                placeholder="Search boneless chicken, gongura mutton, prawns, chicken podi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
                className="w-full bg-white border border-[#D8CCA8] rounded-lg px-4 py-2 text-stone-900 text-sm focus:outline-none focus:border-[#8B1E10]"
                autoFocus
              />
              <Link
                href={`/products?search=${encodeURIComponent(searchQuery)}`}
                className="bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                Search
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FFFDF9] border-t border-[#E8DFC9] px-4 pt-3 pb-6 space-y-3 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-stone-800 hover:text-[#8B1E10] text-base font-semibold py-2 border-b border-[#F3ECE2]"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-[#8B1E10] underline font-bold"
              >
                My Account & Orders
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}
