import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Ingredient Selection',
      desc: 'Handpicked Guntur red chilies, pure wood-pressed sesame oil (Nuvvula Nune), fresh farm meats, and crushed garlic.',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop',
    },
    {
      num: '02',
      title: 'Traditional Preparation',
      desc: 'Hand-cutting tender pieces, stone-pounding whole spices, and marinating in sea salt and squeezed lemon.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
    },
    {
      num: '03',
      title: 'Small-Batch Cooking',
      desc: 'Slow-cooked in small 5kg batches in classic brass Uruli vessels to ensure every piece absorbs rich spice.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600&auto=format&fit=crop',
    },
    {
      num: '04',
      title: 'Careful Jar Filling',
      desc: 'Hand-portioned with equal distribution of tender meat pieces and spiced aromatic sesame oil.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
    },
    {
      num: '05',
      title: 'Hygienic Oil Sealing',
      desc: 'Sealed with an authentic oil layer that naturally preserves freshness without artificial chemicals.',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=600&auto=format&fit=crop',
    },
    {
      num: '06',
      title: 'Direct Dispatch',
      desc: 'Packed securely in protective express courier packaging and shipped directly from Tenali to your doorstep.',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <section className="py-16 bg-[#FFFDF9] border-t border-b border-[#E8DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest bg-[#8B1E10]/10 px-3 py-1 rounded-full border border-[#8B1E10]/20">
            Transparent Craftsmanship
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
            From Our Kitchen to Your Home
          </h2>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-medium">
            We follow traditional 6-step Andhra home cooking protocols in Tenali to deliver authentic taste and zero compromise quality.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-[#E8DFC9] rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-shadow group flex flex-col justify-between"
            >
              <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#8B1E10] text-[#FAF6F0] text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                  Step {step.num}
                </div>
              </div>

              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-[#8B1E10] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1">
                    {step.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authentic Quality Control
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
