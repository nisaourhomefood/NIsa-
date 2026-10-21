'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FolderTree, Plus, Edit, X, Info } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/data/mock-products';
import { Category } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: desc || 'Authentic small-batch Andhra food category.',
      image_url: imageUrl || 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
      sort_order: categories.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCategories([...categories, newCat]);
    setIsModalOpen(false);
    setName('');
    setDesc('');
    setImageUrl('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Product Categories</h1>
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5">
            Manage main storefront categories for pickles, podis, and sweets.
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5">
            <Plus className="w-4 h-4 mr-1 shrink-0" /> Add Category
          </Button>
        </div>
      </div>

      {/* 📐 Image Guidelines Box */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs sm:text-sm">
          <Info className="w-4 h-4 text-[#8B1E10] shrink-0" />
          <span>📐 Category Tile Image Guidelines</span>
        </div>
        <p className="text-stone-600 text-xs leading-relaxed">
          Recommended Size: <strong className="text-stone-900 font-mono">600 × 400 px (3:2)</strong> or <strong className="text-stone-900 font-mono">400 × 400 px (1:1 Circle)</strong>. Top-down shot of the ingredients or open bowl with rich natural textures.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4 shadow-xs">
            <div className="relative aspect-16/9 w-full rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 border border-stone-100">
              <Image src={cat.image_url || ''} alt={cat.name} fill className="object-cover" />
            </div>
            <div>
              <div className="flex justify-between items-start">
                <h3 className="text-base sm:text-lg font-extrabold text-stone-900">{cat.name}</h3>
                <button className="text-stone-400 hover:text-[#8B1E10] p-1">
                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              <p className="text-[11px] text-stone-500 font-mono mt-0.5">{cat.slug}</p>
              <p className="text-xs text-stone-600 font-medium mt-1.5 leading-relaxed">{cat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900">Create New Category</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <Input label="Category Name *" placeholder="e.g. Specialty Chutneys" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Category Image URL" placeholder="https://... (image URL)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              
              {imageUrl && (
                <div className="relative aspect-16/9 w-full rounded-xl overflow-hidden border border-stone-200">
                  <Image src={imageUrl} alt="Category preview" fill className="object-cover" />
                </div>
              )}

              <Input label="Description" placeholder="Brief category description..." value={desc} onChange={(e) => setDesc(e.target.value)} />

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto bg-[#8B1E10] text-white font-bold">Save Category</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
