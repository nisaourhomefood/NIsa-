import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, Heart, Flame, ShieldCheck, ArrowRight, Award, Sparkles, User, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Our Story — Saraswati\'s Kitchen in Tenali',
  description:
    'The story behind NISA: Andhra non-veg pickles and podis hand-cooked by Saraswati in small 5kg brass Uruli batches in Tenali, Guntur district, using traditional recipes and wood-pressed sesame oil.',
  alternates: { canonical: '/story' },
};

export default function OurStoryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-[#FAF6F0]">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8B1E10]/10 text-[#8B1E10] text-xs font-bold uppercase tracking-widest border border-[#8B1E10]/20">
          <MapPin className="w-3.5 h-3.5" /> Handcrafted in Tenali, Andhra Pradesh
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight">
          The Story of NISA (నిస)
        </h1>
        <p className="text-[#8B1E10] text-xl font-serif font-bold italic max-w-2xl mx-auto">
          "A girl from Tenali, a college graduation, and an unstoppable passion for pure Andhra home cooking."
        </p>
      </div>

      {/* 1. Meet Saraswati — The Founder's Journey */}
      <div className="bg-white border border-[#E8DFC9] rounded-3xl p-6 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 text-stone-700 text-sm leading-relaxed font-medium">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#8B1E10] text-xs font-extrabold px-3 py-1 rounded-full border border-red-200">
              <GraduationCap className="w-4 h-4" /> Meet Saraswati — Founder & Chef
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
              Started With Zero Investments, Pure Passion & A Home Kitchen in Tenali
            </h2>
            <p>
              While pursuing her college graduation, <strong>Saraswati</strong> harbored a deep, burning passion: the art of traditional Andhra cooking. While other students were planning corporate careers, Saraswati was in her family kitchen in Tenali, perfecting ancestral pickle recipes, hand-grinding Guntur spices, and frying tender boneless chicken in pure wood-pressed sesame oil.
            </p>
            <p>
              She had no big commercial factory, no investors, and no storefront. She cooked small 3–5kg batches directly from her home, carefully packed each jar by hand, and <strong>personally delivered them across Tenali and Vijayawada</strong> to neighbors, friends, and local food lovers who instantly fell in love with her cooking.
            </p>
            <p className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E8DFC9] text-xs text-stone-800 font-semibold italic">
              "I wanted to prove that real home-cooked food, made with pure ingredients and zero chemicals, can bring happiness to families wherever they live." — Saraswati
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden border border-[#E8DFC9] shadow-lg bg-stone-100 flex flex-col items-center justify-center p-6 text-center">
            <div className="relative w-40 h-40">
              <Image
                src="/nisaralogo.png"
                alt="NISA Pickling Jar Logo"
                fill
                sizes="160px"
                className="object-contain"
              />
            </div>
            <div className="mt-4 space-y-1">
              <span className="text-xs font-extrabold text-[#8B1E10] uppercase tracking-widest block">
                NISA • Mana Inti Vanta
              </span>
              <p className="text-[11px] text-stone-500 font-medium">
                Handcrafted at Home by Saraswati • Tenali, AP
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Supported by Dorabeen Agency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden border border-[#E8DFC9] shadow-xl bg-stone-100">
          <Image
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop"
            alt="Traditional Andhra Spice Roasting"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-4 text-stone-700 text-sm leading-relaxed font-medium">
          <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest block">
            02. The Mission
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900">
            From Home Delivery to Homes Across India
          </h2>
          <p>
            Recognizing Saraswati's extraordinary culinary talent and dedication, <strong>Dorabeen Agency</strong> partnered with her to build NISA's digital storefront and pan-India shipping network.
          </p>
          <p>
            Today, every single jar you order is still prepared with the exact same home standards: cooked by Saraswati in small batches, using pure cold wood-pressed sesame oil (Nuvvula Nune), farm-fresh chicken, and hand-pounded spices without a single drop of artificial preservatives or vinegar.
          </p>
        </div>
      </div>

      {/* 3. The 4 Golden Promises of Saraswati's Kitchen */}
      <div className="bg-white border border-[#E8DFC9] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest">
            Our Unshakable Standard
          </span>
          <h3 className="text-2xl font-extrabold text-stone-900">
            The 4 Golden Promises of NISA
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8DFC9] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B1E10]/10 flex items-center justify-center text-[#8B1E10]">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-sm">5kg Small Batches</h4>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Cooked only in brass Uruli vessels to ensure every piece absorbs the rich masala perfectly.
            </p>
          </div>

          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8DFC9] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B1E10]/10 flex items-center justify-center text-[#8B1E10]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-sm">Wood-Pressed Sesame Oil</h4>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Zero cheap palm oil. Pure Nuvvula Nune that seals in flavor and naturally preserves the pickle.
            </p>
          </div>

          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8DFC9] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B1E10]/10 flex items-center justify-center text-[#8B1E10]">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-sm">Real Guntur Sun-Dried Spices</h4>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Freshly ground whole spices, mustard, and crushed garlic straight from Tenali markets.
            </p>
          </div>

          <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#E8DFC9] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#8B1E10]/10 flex items-center justify-center text-[#8B1E10]">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-stone-900 text-sm">Zero Chemical Preservatives</h4>
            <p className="text-xs text-stone-600 leading-relaxed font-normal">
              Made strictly the traditional way using natural rock salt, lemon juice, and oil sealing.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#8B1E10] to-[#72160B] text-white rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-extrabold text-amber-50">
          Support a Student Founder & Taste Authentic Tenali Home Food
        </h3>
        <p className="text-xs text-amber-100 max-w-md mx-auto font-medium">
          Fresh small-batch jars shipped directly to your doorstep anywhere in India.
        </p>
        <Link href="/products" className="inline-block">
          <Button size="lg" className="bg-[#C68B27] hover:bg-amber-600 text-stone-950 font-extrabold px-8 rounded-xl shadow-lg">
            Explore Saraswati's Menu <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

    </div>
  );
}
