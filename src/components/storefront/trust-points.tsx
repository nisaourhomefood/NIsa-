import React from 'react';
import { Flame, ShieldCheck, Award, Truck } from 'lucide-react';

export function TrustPoints() {
  const points = [
    {
      title: 'Small Batch Preparation',
      desc: 'Cooked strictly in 5kg small batches in traditional brass Uruli vessels so every bite absorbs full flavor.',
      icon: Flame,
    },
    {
      title: 'Authentic Andhra Recipes',
      desc: 'Handed down through generations in Tenali, preserving genuine home cooking without artificial chemicals.',
      icon: Award,
    },
    {
      title: 'Carefully Selected Ingredients',
      desc: '100% cold wood-pressed sesame oil (Nuvvula Nune), Guntur red chilies, fresh garlic, and farm meats.',
      icon: ShieldCheck,
    },
    {
      title: 'Delivered Across India',
      desc: 'Express courier delivery directly from our Tenali kitchen to your doorstep nationwide.',
      icon: Truck,
    },
  ];

  return (
    <section className="py-16 bg-[#FAF6F0] border-b border-[#E8DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest">
            Truth & Integrity
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900">
            Why NISA (నిస)?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Four promises behind every jar prepared in our Tenali kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E8DFC9] rounded-2xl p-6 shadow-xs hover:border-[#8B1E10]/40 transition-all text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#8B1E10]/10 border border-[#8B1E10]/20 flex items-center justify-center text-[#8B1E10] mx-auto">
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-stone-900">{p.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
