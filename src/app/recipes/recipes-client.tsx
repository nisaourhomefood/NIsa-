'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { RECIPE_ARTICLES, RECIPE_CATEGORIES } from '@/lib/content/recipes';

export function RecipesPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredStories = RECIPE_ARTICLES.filter(
    (s) => selectedCategory === 'all' || s.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#FAF6F0]">

      {/* Header */}
      <div className="border-b border-[#E8DFC9] pb-6 space-y-2">
        <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded border border-red-200 inline-block">
          <BookOpen className="w-4 h-4 text-[#8B1E10]" /> NISA Food Journal
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Recipes & Stories from Tenali
        </h1>
        <p className="text-sm text-stone-600 font-medium">
          Heritage articles, serving guides, and behind-the-scenes stories from our kitchen.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-[#E8DFC9] overflow-x-auto gap-2 pb-2">
        {RECIPE_CATEGORIES.map((cat) => (
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
          <Link
            key={post.slug}
            href={`/recipes/${post.slug}`}
            className="bg-white border border-[#E8DFC9] rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden">
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
          </Link>
        ))}
      </div>

    </div>
  );
}
