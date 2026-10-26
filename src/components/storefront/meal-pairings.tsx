import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function MealPairings() {
  const pairings = [
    {
      title: 'Hot Rice & Melted Ghee',
      desc: 'Mix 2 spoons of Boneless Chicken Pickle or Chicken Podi with steaming hot rice and pure A2 Ghee.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Creamy Curd Rice',
      desc: 'The ultimate comforting end to an Andhra meal. Paired perfectly with spicy Guntur Gongura Chicken Pickle.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Crispy Dosa & Fluffy Idli',
      desc: 'Elevate morning breakfast! Dip hot crispy dosas or soft idlis into Andhra Prawns Pickle or Chicken Podi.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Warm Chapati & Roti',
      desc: 'Savory boneless mutton pickle pieces spooned over warm folded chapatis for a quick satisfying dinner.',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Traditional Andhra Thali',
      desc: 'Complete your festive or Sunday family lunch spread with a dollop of authentic Tenali home pickles.',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <section className="py-16 bg-[#FFFDF9] border-b border-[#E8DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest bg-[#8B1E10]/10 px-3 py-1 rounded-full border border-[#8B1E10]/20">
            Versatile Food Pairings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            One Andhra meal. Many ways to enjoy it.
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-medium">
            Whether it is steaming white rice, soft idlis, or late-night curd rice — NISA pickles elevate every bite.
          </p>
        </div>

        {/* Pairings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {pairings.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E8DFC9] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-[#8B1E10] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#8B1E10] hover:text-[#72160B]"
          >
            <span>Explore All Pickles & Podis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
