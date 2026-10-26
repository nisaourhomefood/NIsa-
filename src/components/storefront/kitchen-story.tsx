import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function KitchenStory() {
  return (
    <section className="py-16 bg-[#FAF6F0] border-b border-[#E8DFC9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Official Logo & Jar Visual */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-[#E8DFC9] rounded-3xl p-8 shadow-xl text-center space-y-4">
              <div className="relative w-44 h-44 mx-auto">
                <Image
                  src="/nisaralogo.png"
                  alt="NISA Mana Inti Vanta Official Logo"
                  fill
                  sizes="176px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest block">
                  Tenali Kitchen Heritage
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mt-1">
                  NISA • Mana Inti Vanta
                </h3>
                <p className="text-xs text-stone-600 font-medium">
                  Tenali, Guntur District, Andhra Pradesh
                </p>
              </div>
            </div>
          </div>

          {/* Right: Narrative Story */}
          <div className="lg:col-span-7 space-y-5 text-stone-700 text-sm leading-relaxed font-medium">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E10]/10 text-[#8B1E10] text-xs font-bold uppercase tracking-wider border border-[#8B1E10]/20">
              <MapPin className="w-3.5 h-3.5" /> Our Story & Mission
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
              Bringing the Taste of Home to Wherever You Are
            </h2>

            <p>
              NISA was founded in Tenali, Andhra Pradesh with a simple, heartfelt mission: to bring the authentic flavor of Andhra home cooking to everyone living away from home.
            </p>

            <p>
              For students in hostels, working professionals in distant metros, and families living far from Andhra Pradesh, a jar of homemade non-veg pickle or roasted podi isn't just food — it is an emotional connection to home, warm rice, and family lunches.
            </p>

            <p>
              That is why in our Tenali kitchen, we cook strictly in small 5kg batches, using wood-pressed sesame oil, sun-dried Guntur chilies, and zero chemical preservatives — exactly the way our grandmothers prepared them at home.
            </p>

            <div className="pt-2">
              <Link href="/story">
                <Button className="bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold">
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
