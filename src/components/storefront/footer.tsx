import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Truck, Lock, Share2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#FAF6F0] text-stone-800 border-t border-[#E8DFC9] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/nisaralogo.png"
                  alt="NISA Official Pickling Jar Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#8B1E10] block">NISA</span>
                <span className="text-xs text-[#C68B27] font-bold block">Mana Inti Vanta • Tenali</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed max-w-sm font-medium">
              Authentic small-batch Andhra homemade pickles, spice powders, and sweets prepared in Tenali, Andhra Pradesh. Made using traditional wood-pressed sesame oil and hand-ground spices.
            </p>

            <div className="pt-1 space-y-1.5 text-xs text-stone-700 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#8B1E10] shrink-0" />
                <span>NISA Foods, Door No. 4-12-88, Guntur Road, Tenali - 522201, AP</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8B1E10] shrink-0" />
                <span>Customer Care: +91 75693 44938</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B1E10] shrink-0" />
                <span>nisaourhomefood@gmail.com</span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#E8DFC9] text-xs font-bold text-stone-700 hover:text-[#8B1E10] transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Instagram
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8B1E10] mb-3">
              Shop Catalogue
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li><Link href="/products/andhra-boneless-chicken-pickle" className="hover:text-[#8B1E10]">Andhra Boneless Chicken</Link></li>
              <li><Link href="/products/gongura-chicken-pickle" className="hover:text-[#8B1E10]">Gongura Chicken Pickle</Link></li>
              <li><Link href="/products/andhra-boneless-mutton-pickle" className="hover:text-[#8B1E10]">Boneless Mutton Pickle</Link></li>
              <li><Link href="/products/andhra-prawns-pickle" className="hover:text-[#8B1E10]">Andhra Prawns Pickle</Link></li>
              <li><Link href="/products/chicken-podi" className="hover:text-[#8B1E10]">Chicken Podi</Link></li>
              <li><Link href="/products/traditional-nut-seed-laddu" className="hover:text-[#8B1E10]">Nut & Seed Laddu</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8B1E10] mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li><Link href="/pickles" className="hover:text-[#8B1E10]">Non-Veg Pickles</Link></li>
              <li><Link href="/podis" className="hover:text-[#8B1E10]">Authentic Podis</Link></li>
              <li><Link href="/sweets" className="hover:text-[#8B1E10]">Traditional Sweets</Link></li>
              <li><Link href="/combos" className="hover:text-[#8B1E10]">Value Combo Packs</Link></li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#8B1E10] mb-3">
              Policies & Support
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-medium">
              <li><Link href="/story" className="hover:text-[#8B1E10]">Our Tenali Story</Link></li>
              <li><Link href="/contact" className="hover:text-[#8B1E10]">Contact Us</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-[#8B1E10]">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-[#8B1E10]">Return & Refund Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#8B1E10]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#8B1E10]">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Security & Legal Trust Bar */}
        <div className="pt-8 border-t border-[#E8DFC9] grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs text-stone-700 font-semibold">
          <div className="flex items-center justify-center gap-2 bg-white py-3 px-3 rounded-xl border border-[#E8DFC9] shadow-xs">
            <Truck className="w-4 h-4 text-[#8B1E10]" />
            <span>All India Express Shipping</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white py-3 px-3 rounded-xl border border-[#E8DFC9] shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Small Batch Quality</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white py-3 px-3 rounded-xl border border-[#E8DFC9] shadow-xs">
            <Heart className="w-4 h-4 text-amber-700" />
            <span>Zero Preservatives</span>
          </div>
          <div className="flex items-center justify-center gap-2 bg-white py-3 px-3 rounded-xl border border-[#E8DFC9] shadow-xs">
            <Lock className="w-4 h-4 text-blue-700" />
            <span>FSSAI License: 10123999000142</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-[#E8DFC9] flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-2 font-medium">
          <p>© {new Date().getFullYear()} NISA (నిస) – Mana Inti Vanta. All rights reserved. Tenali, AP.</p>
          <p>Authentic Small-Batch Andhra Food Across India</p>
        </div>

      </div>
    </footer>
  );
}
