'use client';

import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, SlidersHorizontal, PackageX, RotateCcw, ChevronDown, Check, X
} from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/data/mock-products';
import { ProductWithVariants, ProductVariant } from '@/types/database.types';
import { Button } from '@/components/ui/button';

// ─── Dropdown Filter Pill ────────────────────────────────────────────────────
interface FilterPillProps {
  label: string;
  active: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

function FilterPill({ label, active, isOpen, onToggle, onClose, children }: FilterPillProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer select-none ${
          active
            ? 'bg-[#8B1E10] text-white border-[#8B1E10] shadow-sm'
            : 'bg-white text-stone-700 border-stone-200 hover:border-[#8B1E10]/50 hover:text-[#8B1E10]'
        }`}
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 bg-white rounded-2xl shadow-2xl border border-stone-100 p-3 z-50 min-w-[190px] animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Arrow pointer */}
          <div className="absolute -top-2 left-5 w-4 h-4 bg-white border-l border-t border-stone-100 rotate-45" />
          <div className="relative">{children}</div>
        </div>
      )}
    </div>
  );
}

// ─── Radio Option inside dropdown ────────────────────────────────────────────
function RadioOpt({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer py-2 px-2 rounded-xl hover:bg-stone-50 transition-colors">
      <span className={`text-sm font-semibold ${checked ? 'text-[#8B1E10]' : 'text-stone-700'}`}>{label}</span>
      {checked && <Check className="w-4 h-4 text-[#8B1E10] shrink-0" />}
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
    </label>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>(searchParam || '');
  const [sortBy, setSortBy] = useState<'featured' | 'bestseller' | 'price-low' | 'price-high' | 'newest'>('bestseller');
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const fetchLiveProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveProducts();
  }, []);

  const toggle = (key: string) => setOpenFilter((prev) => (prev === key ? null : key));
  const close = () => setOpenFilter(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all') {
        const cat = INITIAL_CATEGORIES.find((c) => c.slug === selectedCategory);
        const matchesCategory =
          (cat && p.category_id === cat.id) ||
          p.category?.slug === selectedCategory ||
          p.product_type === selectedCategory;
        if (!matchesCategory) return false;
      }
      if (selectedType !== 'all' && p.product_type !== selectedType) return false;
      const price = p.variants[0]?.price || 0;
      if (priceRange === 'under-400' && price >= 400) return false;
      if (priceRange === '400-800' && (price < 400 || price > 800)) return false;
      if (priceRange === 'over-800' && price <= 800) return false;
      if (onlyInStock && (p.variants || []).reduce((s: number, v: ProductVariant) => s + (v.stock || 0), 0) <= 0) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !(p.description || '').toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      const pa = a.variants[0]?.price || 0, pb = b.variants[0]?.price || 0;
      if (sortBy === 'price-low') return pa - pb;
      if (sortBy === 'price-high') return pb - pa;
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'bestseller') return (b.bestseller_status ? 1 : 0) - (a.bestseller_status ? 1 : 0);
      return (b.featured_status ? 1 : 0) - (a.featured_status ? 1 : 0);
    });
  }, [products, selectedCategory, selectedType, priceRange, onlyInStock, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setPriceRange('all');
    setOnlyInStock(false);
    setSearchQuery('');
    setSortBy('bestseller');
    close();
  };

  const activeFilterCount = [
    selectedCategory !== 'all',
    selectedType !== 'all',
    priceRange !== 'all',
    onlyInStock,
  ].filter(Boolean).length;

  // Human-readable labels for active state
  const categoryLabel = selectedCategory === 'all' ? 'Category' : INITIAL_CATEGORIES.find(c => c.slug === selectedCategory)?.name || 'Category';
  const typeLabel: Record<string, string> = { all: 'Type', 'non-veg-pickle': 'Non-Veg Pickles', podi: 'Podis', sweet: 'Sweets' };
  const priceLabel: Record<string, string> = { all: 'Price', 'under-400': 'Under ₹400', '400-800': '₹400–₹800', 'over-800': 'Over ₹800' };
  const sortLabel: Record<string, string> = { bestseller: 'Best Selling', featured: 'Featured', 'price-low': 'Price ↑', 'price-high': 'Price ↓', newest: 'Newest' };

  return (
    <div className="bg-[#FAF6F0] min-h-screen">

      {/* ── Page Title (Center Aligned) ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-3 text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900">NISA Food Catalogue</h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-lg mx-auto">
          Authentic Andhra home food · Small batches · Handcrafted in Tenali, AP
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════
          STICKY FILTER BAR — Center Aligned & Seamless Background
      ══════════════════════════════════════════════════════ */}
      <div className="sticky top-[72px] sm:top-[80px] z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E8DFC9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search row (Center Aligned) */}
          <div className="py-2.5 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search chicken, mutton, gongura, podis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#D8CCA8] rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#8B1E10] shadow-2xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter pills horizontal scroll (Center Aligned on Desktop, Smooth Scroll on Mobile) */}
          <div className="flex items-center justify-start sm:justify-center gap-2 pb-3 overflow-x-auto no-scrollbar">

            {/* ── Category ── */}
            <FilterPill
              label={categoryLabel}
              active={selectedCategory !== 'all'}
              isOpen={openFilter === 'category'}
              onToggle={() => toggle('category')}
              onClose={close}
            >
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider px-2 mb-1">Category</p>
              <RadioOpt label={`All (${products.length})`} checked={selectedCategory === 'all'} onChange={() => { setSelectedCategory('all'); close(); }} />
              {INITIAL_CATEGORIES.map((cat) => (
                <RadioOpt key={cat.id} label={cat.name} checked={selectedCategory === cat.slug} onChange={() => { setSelectedCategory(cat.slug); close(); }} />
              ))}
            </FilterPill>

            {/* ── Product Type ── */}
            <FilterPill
              label={typeLabel[selectedType] || 'Type'}
              active={selectedType !== 'all'}
              isOpen={openFilter === 'type'}
              onToggle={() => toggle('type')}
              onClose={close}
            >
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider px-2 mb-1">Product Type</p>
              {[
                { v: 'all', l: 'All Types' },
                { v: 'non-veg-pickle', l: 'Non-Veg Pickles' },
                { v: 'podi', l: 'Authentic Podis' },
                { v: 'sweet', l: 'Traditional Sweets' },
              ].map(({ v, l }) => (
                <RadioOpt key={v} label={l} checked={selectedType === v} onChange={() => { setSelectedType(v); close(); }} />
              ))}
            </FilterPill>

            {/* ── Price ── */}
            <FilterPill
              label={priceLabel[priceRange] || 'Price'}
              active={priceRange !== 'all'}
              isOpen={openFilter === 'price'}
              onToggle={() => toggle('price')}
              onClose={close}
            >
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider px-2 mb-1">Price Range</p>
              {[
                { v: 'all', l: 'All Prices' },
                { v: 'under-400', l: 'Under ₹400' },
                { v: '400-800', l: '₹400 – ₹800' },
                { v: 'over-800', l: 'Over ₹800' },
              ].map(({ v, l }) => (
                <RadioOpt key={v} label={l} checked={priceRange === v} onChange={() => { setPriceRange(v); close(); }} />
              ))}
            </FilterPill>

            {/* ── Sort ── */}
            <FilterPill
              label={`⇅ ${sortLabel[sortBy]}`}
              active={sortBy !== 'bestseller'}
              isOpen={openFilter === 'sort'}
              onToggle={() => toggle('sort')}
              onClose={close}
            >
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider px-2 mb-1">Sort By</p>
              {[
                { v: 'bestseller', l: '🔥 Best Selling' },
                { v: 'featured', l: '✦ Featured' },
                { v: 'price-low', l: '↑ Price: Low to High' },
                { v: 'price-high', l: '↓ Price: High to Low' },
                { v: 'newest', l: '🆕 Newest' },
              ].map(({ v, l }) => (
                <RadioOpt key={v} label={l} checked={sortBy === v} onChange={() => { setSortBy(v as any); close(); }} />
              ))}
            </FilterPill>

            {/* ── In Stock toggle pill ── */}
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                onlyInStock
                  ? 'bg-[#8B1E10] text-white border-[#8B1E10]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-[#8B1E10]/50'
              }`}
            >
              {onlyInStock && <Check className="w-3.5 h-3.5" />}
              In Stock
            </button>

            {/* ── Clear all (shown only when filters active) ── */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-stone-200 text-xs font-bold text-stone-500 hover:text-red-700 hover:border-red-200 transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile result count (Center Aligned) ── */}
      <div className="px-4 pt-3 pb-1 text-center">
        <p className="text-xs text-stone-500 font-medium">
          Showing <strong className="text-[#8B1E10] font-bold">{filteredProducts.length}</strong> authentic products
        </p>
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white border border-[#E8DFC9] rounded-2xl p-3 space-y-2 animate-pulse">
                <div className="aspect-square bg-stone-100 rounded-xl" />
                <div className="h-4 bg-stone-100 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
                <div className="h-8 bg-stone-100 rounded-xl mt-2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-10 text-center space-y-3 max-w-md mx-auto">
            <PackageX className="w-10 h-10 text-[#8B1E10] mx-auto" />
            <h3 className="text-base font-bold text-stone-900">No products match your filters</h3>
            <p className="text-xs text-stone-500">Try clearing filters or adjusting your search.</p>
            <Button onClick={resetFilters} className="bg-[#8B1E10] text-white font-bold text-xs">
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductsPageClient() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-[#8B1E10] font-bold">Loading NISA Shop...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
