import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ShieldCheck, Flame, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowWeMakeItPage() {
  const steps = [
    {
      step: '01',
      title: 'Ingredients Selection',
      desc: 'Handpicked Guntur red chilies, 100% cold wood-pressed sesame oil (Nuvvula Nune), farm-fresh meats, and crushed garlic cloves.',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '02',
      title: 'Hand Preparation',
      desc: 'Hand-cutting tender meat pieces, stone-pounding whole spices, and marinating in rock salt and squeezed lemon.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '03',
      title: 'Small Batch Cooking',
      desc: 'Slow-cooked in small 5kg batches in traditional brass Uruli vessels to ensure every piece absorbs rich spice.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '04',
      title: 'Traditional Recipe Curing',
      desc: 'Infusing deep red chili masala with wood-pressed oil according to heritage Tenali family recipes.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '05',
      title: 'Strict Quality Check',
      desc: 'Inspecting oil level, moisture absence, and seal integrity to guarantee long-lasting shelf life without artificial preservatives.',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '06',
      title: 'Hygienic Jar Packing',
      desc: 'Careful portioning into glass jars with generous meat pieces and spiced oil coating.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
    },
    {
      step: '07',
      title: 'Express Dispatch Across India',
      desc: 'Packed securely in protective courier packaging and shipped directly from Tenali to your doorstep.',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FAF6F0]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest bg-[#8B1E10]/10 px-3.5 py-1.5 rounded-full border border-[#8B1E10]/20">
          Transparent Kitchen Process
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          How We Make NISA Pickles
        </h1>
        <p className="text-stone-700 text-sm sm:text-base font-medium">
          Follow our 7-step traditional journey from raw ingredients in Tenali to your family dining table.
        </p>
      </div>

      {/* Steps Flow Grid */}
      <div className="space-y-8">
        {steps.map((item, idx) => (
          <div
            key={item.step}
            className={`bg-white border border-[#E8DFC9] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center gap-8 shadow-xs ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            <div className="relative aspect-16/10 w-full lg:w-1/2 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
              <Image src={item.image} alt={item.title} fill className="object-cover" />
              <div className="absolute top-4 left-4 bg-[#8B1E10] text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs">
                Step {item.step}
              </div>
            </div>

            <div className="space-y-3 w-full lg:w-1/2">
              <span className="text-xs font-extrabold uppercase text-[#8B1E10] tracking-wider">
                Phase {item.step} of 07
              </span>
              <h3 className="text-2xl font-extrabold text-stone-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                {item.desc}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Authentic Tenali Quality Standard
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-white border border-[#E8DFC9] rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <h3 className="text-2xl font-extrabold text-stone-900">
          Ready to Experience Small-Batch Perfection?
        </h3>
        <p className="text-xs text-stone-600 max-w-sm mx-auto font-medium">
          Try our bestselling Andhra Boneless Chicken Pickle or Gongura Chicken today.
        </p>
        <Link href="/products" className="inline-block">
          <Button size="lg" className="bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold px-8">
            Shop NISA Catalogue <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

    </div>
  );
}
