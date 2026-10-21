'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookOpen, Plus, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminContentCMSPage() {
  const [articles, setArticles] = useState([
    {
      id: 'art-1',
      title: 'The Secret of Tenali Wood-Pressed Sesame Oil (Nuvvula Nune)',
      category: 'Behind-the-Scenes',
      seo_title: 'Tenali Sesame Oil Pickling Secrets | NISA',
      status: 'Published',
    },
    {
      id: 'art-2',
      title: 'How to Serve Chicken Podi With Hot Steamed Rice & Ghee',
      category: 'Serving Suggestions',
      seo_title: 'How to Serve Chicken Podi | NISA Recipes',
      status: 'Published',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Serving Suggestions');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setArticles([
      {
        id: `art-${Date.now()}`,
        title,
        category,
        seo_title: `${title} | NISA`,
        status: 'Published',
      },
      ...articles,
    ]);

    setIsModalOpen(false);
    setTitle('');
    setImageUrl('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Recipes & Articles CMS</h1>
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5">
            Publish blog articles, behind-the-scenes stories, and serving guides.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5">
            <Plus className="w-4 h-4 mr-1 shrink-0" /> New Article
          </Button>
        </div>
      </div>

      {/* Main Content: Mobile Cards + Desktop Table */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs">
        {/* Mobile View: Cards */}
        <div className="block md:hidden space-y-3">
          {articles.map((art) => (
            <div key={art.id} className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-extrabold text-stone-900 text-xs sm:text-sm leading-snug">{art.title}</h3>
                <button className="text-stone-400 hover:text-[#8B1E10] p-1 shrink-0">
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[10px] text-stone-400 font-mono truncate">{art.seo_title}</p>

              <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 text-xs">
                <span className="text-[10px] font-bold text-[#8B1E10] bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-md">
                  {art.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {art.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-[#8B1E10] uppercase font-extrabold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3">Article Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">SEO Meta Title</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-stone-50">
                  <td className="p-3 font-extrabold text-stone-900">{art.title}</td>
                  <td className="p-3 font-bold text-[#8B1E10]">{art.category}</td>
                  <td className="p-3 font-mono text-stone-500">{art.seo_title}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {art.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-stone-500 hover:text-[#8B1E10] font-bold p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900">Create New Article</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3">
              <Input label="Article Title *" placeholder="e.g. Gongura Leaf Pickling Techniques" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <Input label="Article Image URL" placeholder="https://... (image URL)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

              {imageUrl && (
                <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-stone-200">
                  <Image src={imageUrl} alt="Article preview" fill className="object-cover" />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:border-[#8B1E10] focus:outline-none">
                  <option value="Serving Suggestions">Serving Suggestions</option>
                  <option value="Behind-the-Scenes">Behind-the-Scenes</option>
                  <option value="Andhra Food Stories">Andhra Food Stories</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto bg-[#8B1E10] text-white font-bold">Publish Article</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
