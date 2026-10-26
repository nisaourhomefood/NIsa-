import React from 'react';
import Image from 'next/image';
import { Camera, Play, Star, CheckCircle2 } from 'lucide-react';

export function SocialProof() {
  const posts = [
    {
      caption: 'Sunday lunch spread with hot rice, ghee & NISA Boneless Chicken Pickle! #ManaIntiVanta',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=500&auto=format&fit=crop',
    },
    {
      caption: 'Fresh batch of Gongura Chicken Pickle cooked today in Tenali! #NisaFoods',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop',
    },
    {
      caption: 'Dosa morning paired with NISA Prawns Pickle & Podi! #AndhraTaste',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=500&auto=format&fit=crop',
    },
    {
      caption: 'Pure wood-pressed Nuvvula Nune (Sesame oil) sealing fresh mutton pickles! #SmallBatch',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=500&auto=format&fit=crop',
    },
  ];

  const videoTestimonials = [
    {
      name: 'Dr. Kavitha Rao',
      city: 'Bengaluru',
      quote: 'Reminds me of my mother’s pickling in Tenali. Authentic oil aroma and zero artificial red color!',
      thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Rajesh Varma',
      city: 'Hyderabad',
      quote: 'The Boneless Mutton Pickle melts in your mouth! Delivered to Hyderabad in just 2 days.',
      thumbnail: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=500&auto=format&fit=crop',
    },
  ];

  return (
    <section className="py-16 bg-[#FFFDF9] border-b border-[#E8DFC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest flex items-center justify-center gap-1.5">
            <Camera className="w-4 h-4 text-[#8B1E10]" /> Social Proof & Customer Voices
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900">
            Real Customer Moments
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Tag us in your home meal spreads using <strong>#ManaIntiVanta</strong> on Instagram!
          </p>
        </div>

        {/* Video Testimonial Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videoTestimonials.map((vid, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6F0] border border-[#E8DFC9] rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs group"
            >
              <div className="relative aspect-square w-32 rounded-2xl overflow-hidden bg-stone-900 shrink-0 border border-stone-200">
                <Image src={vid.thumbnail} alt={vid.name} fill sizes="128px" className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#8B1E10] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 italic font-medium">"{vid.quote}"</p>
                <div className="pt-1">
                  <span className="font-extrabold text-stone-900 text-sm block">{vid.name}</span>
                  <span className="text-[11px] text-emerald-800 font-bold flex items-center justify-center sm:justify-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Customer • {vid.city}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Photos Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-[#E8DFC9] shadow-xs"
            >
              <Image
                src={post.image}
                alt="NISA Social Proof"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-medium">
                <p className="line-clamp-3 leading-snug">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
