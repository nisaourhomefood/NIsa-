'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Sparkles, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RecipesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'food-stories', label: 'Andhra Food Stories' },
    { id: 'serving-suggestions', label: 'Serving Suggestions' },
    { id: 'recipe-articles', label: 'Recipe Articles' },
    { id: 'behind-scenes', label: 'Behind-the-Scenes' },
    { id: 'kitchen-stories', label: 'Kitchen Stories' },
    { id: 'customer-stories', label: 'Customer Stories' },
  ];

  const stories = [
    {
      id: 'story-1',
      category: 'behind-scenes',
      categoryLabel: 'Behind-the-Scenes',
      title: 'The Secret of Tenali Wood-Pressed Sesame Oil (Nuvvula Nune)',
      date: 'Aug 18, 2026',
      readTime: '4 min read',
      author: 'Tenali Kitchen Master',
      desc: 'Why cold wood-pressed sesame oil preserves flavor and acts as a natural heritage preservative in authentic Andhra pickling.',
      content: 'In modern pickling, vinegar and synthetic acidity regulators are used to cut costs. But in Tenali home cooking, we use 100% pure cold wood-pressed sesame oil (Nuvvula Nune). The natural sesame aroma creates a protective barrier over meat pieces, locking in tenderness for up to 6 months.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'story-2',
      category: 'serving-suggestions',
      categoryLabel: 'Serving Suggestions',
      title: 'How to Serve Chicken Podi With Hot Steamed Rice & Ghee',
      date: 'Aug 15, 2026',
      readTime: '3 min read',
      author: 'Srinivas Rao K.',
      desc: 'Step-by-step guide to achieving the quintessential Andhra home comfort meal.',
      content: 'Take 2 scoops of hot steamed Sona Masoori rice, add 1 tablespoon of melted A2 cow ghee, and sprinkle 2 spoonfuls of NISA Chicken Podi. Mix thoroughly while rice is hot. The roasted chana dal crunch combined with chicken flakes creates pure heaven!',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'story-3',
      category: 'food-stories',
      categoryLabel: 'Andhra Food Stories',
      title: 'Gongura & Meats: The Timeless Andhra Flavor Synergy',
      date: 'Aug 10, 2026',
      readTime: '5 min read',
      author: 'Andhra Heritage Guild',
      desc: 'Exploring the tangy sorrel leaf (Gongura) reduction technique perfected by Tenali grandmothers.',
      content: 'Gongura (sorrel leaf) is often called the King of Andhra vegetables. When cooked down into a velvety paste and combined with pan-fried chicken or sea prawns, the oxalic tang cuts through meat richness, creating a legendary flavor signature.',
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'story-4',
      category: 'kitchen-stories',
      categoryLabel: 'Kitchen Stories',
      title: 'Why 5kg Small Batch Brass Uruli Cooking Matters',
      date: 'Aug 05, 2026',
      readTime: '4 min read',
      author: 'Tenali Kitchen Team',
      desc: 'Inside our daily preparation cycle in Tenali, Andhra Pradesh.',
      content: 'Mass manufacturing in large 500kg commercial vats destroys meat texture. By restricting each batch to 5kg in classic brass Uruli vessels, our home cooks ensure every piece absorbs equal marinade and heat.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 'story-5',
      category: 'customer-stories',
      categoryLabel: 'Customer Stories',
      title: 'Bringing Tenali Taste to My Hostel Room in Bengaluru',
      date: 'Jul 28, 2026',
      readTime: '3 min read',
      author: 'Ananya R.',
      desc: 'How NISA boneless chicken pickle made hostel mess rice taste like home.',
      content: 'As a student living away from Andhra Pradesh, mess food was unbearable until my first NISA parcel arrived. A jar of Boneless Chicken Pickle transformed plain rice into Sunday lunch!',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=600&auto=format&fit=crop',
    },
  ];

  const filteredStories = stories.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FAF6F0]">
      
      {/* Header */}
      <div className="border-b border-[#E8DFC9] pb-6 space-y-2">
        <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded border border-red-200 inline-block">
          <BookOpen className="w-4 h-4 text-[#8B1E10]" /> CMS Food Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Recipes & Stories from Tenali
        </h1>
        <p className="text-sm text-stone-600 font-medium">
          Heritage articles, serving guides, behind-the-scenes stories, and customer moments.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-[#E8DFC9] overflow-x-auto gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-[#8B1E10] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E8DFC9]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredStories.map((post) => (
          <div
            key={post.id}
            onClick={() => setSelectedStory(post)}
            className="bg-white border border-[#E8DFC9] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-[#8B1E10] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-xs">
                  {post.categoryLabel}
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-[#8B1E10]">
                  <span>{post.author}</span>
                  <span className="text-stone-400">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-extrabold text-stone-900 group-hover:text-[#8B1E10] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-medium line-clamp-2">
                  {post.desc}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center text-xs font-bold text-[#8B1E10]">
              Read Full Article <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-4 shadow-2xl border border-[#E8DFC9]">
            <div className="flex justify-between items-start border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-extrabold text-[#8B1E10] bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
                  {selectedStory.categoryLabel}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-2">{selectedStory.title}</h2>
                <span className="text-xs text-stone-500 font-medium">By {selectedStory.author} • {selectedStory.date}</span>
              </div>
              <button onClick={() => setSelectedStory(null)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-stone-100">
              <Image src={selectedStory.image} alt={selectedStory.title} fill className="object-cover" />
            </div>

            <div className="text-sm text-stone-700 leading-relaxed font-medium space-y-3 pt-2">
              <p>{selectedStory.content}</p>
            </div>

            <div className="pt-4 border-t border-stone-100 text-right">
              <Button onClick={() => setSelectedStory(null)} className="bg-[#8B1E10] text-white font-bold">
                Close Article
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
