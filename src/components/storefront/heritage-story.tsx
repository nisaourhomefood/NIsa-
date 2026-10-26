import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart, Sparkles, Award, MapPin, ArrowRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeritageStory() {
  const pillars = [
    {
      title: 'Cooked by Saraswati at Home',
      desc: 'No commercial factories or industrial vats. Prepared in small 5kg batches directly from Saraswati’s home kitchen in Tenali.',
      icon: GraduationCap,
    },
    {
      title: 'Wood-Pressed Sesame Oil (Nuvvula Nune)',
      desc: 'No cheap palm oil. Only pure cold wood-pressed sesame oil that preserves fresh flavor and acts as an ancestral natural preservative.',
      icon: ShieldCheck,
    },
    {
      title: 'Hand-Pounded Guntur Spices',
      desc: 'Authentic fiery Guntur red chilies, freshly roasted mustard seeds, and crushed local garlic ground fresh for every single jar.',
      icon: Award,
    },
    {
      title: 'Zero Chemical Preservatives',
      desc: 'Prepared strictly the traditional way using sea salt, freshly squeezed lemon juice, and oil sealing without artificial chemicals.',
      icon: Heart,
    },
  ];

  return (
    <section className="py-16 bg-[#FAF6F0] text-stone-900 border-t border-b border-[#E8DFC9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B1E10]/10 text-[#8B1E10] text-xs font-bold uppercase tracking-widest border border-[#8B1E10]/20">
            <MapPin className="w-3.5 h-3.5" /> Handcrafted in Tenali, Andhra Pradesh
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">
            The Story Behind NISA (నిస)
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-medium">
            Started by <strong>Saraswati</strong>, a passionate college student from Tenali who began hand-cooking and personally delivering traditional Andhra pickles from her home. Backed by Dorabeen Agency, NISA brings authentic home food to families across India.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E8DFC9] rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-[#8B1E10]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#8B1E10]/10 border border-[#8B1E10]/20 flex items-center justify-center text-[#8B1E10] mb-4 group-hover:scale-110 transition-transform">
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                {p.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Founder Callout Banner */}
        <div className="bg-gradient-to-r from-[#8B1E10] via-[#72160B] to-stone-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 bg-white/10 rounded-2xl p-1 backdrop-blur-xs">
              <Image src="/nisaralogo.png" alt="NISA" fill sizes="64px" className="object-contain" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-extrabold text-amber-50">
                Meet Saraswati — Student Founder & Chef
              </h4>
              <p className="text-xs sm:text-sm text-red-100 mt-1">
                Handcrafted at home in Tenali with pure wood-pressed sesame oil. Express 3-day delivery anywhere in India.
              </p>
            </div>
          </div>
          <Link href="/story" className="shrink-0">
            <Button className="bg-[#C68B27] hover:bg-amber-500 text-stone-950 font-extrabold px-6 rounded-xl shadow-md">
              Read Saraswati's Story <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
