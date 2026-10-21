'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Package, Plus, Edit, Trash2, RefreshCw, X, Check,
  Star, TrendingUp, Eye, EyeOff, ImagePlus, Info
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/lib/data/mock-products';
import { ProductWithVariants, ProductVariant } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ─── Discount badge calculator ───────────────────────────────────────────────
function discountPct(selling: number, mrp: number): number {
  if (!mrp || mrp <= selling) return 0;
  return Math.round(((mrp - selling) / mrp) * 100);
}

// ─── Mobile Variant Card ──────────────────────────────────────────────────────
function VariantCard({
  variant,
  onUpdate,
}: {
  variant: ProductVariant;
  onUpdate: (updated: ProductVariant) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [mrp, setMrp] = useState(String(variant.compare_at_price || ''));
  const [price, setPrice] = useState(String(variant.price));
  const [stock, setStock] = useState(String(variant.stock));

  const save = () => {
    onUpdate({
      ...variant,
      price: parseFloat(price) || variant.price,
      compare_at_price: parseFloat(mrp) || null,
      stock: parseInt(stock) || variant.stock,
    });
    setEditing(false);
  };

  const disc = discountPct(parseFloat(price) || 0, parseFloat(mrp) || 0);

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-2.5 mb-2 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-stone-900 text-xs">{variant.size_label}</span>
          {variant.is_default && (
            <span className="text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded">Default</span>
          )}
        </div>
        <span className="text-[10px] text-stone-400 font-mono">{variant.sku}</span>
      </div>

      {editing ? (
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="text-[9px] font-bold text-stone-500 block mb-0.5">MRP</label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="MRP"
                className="w-full border border-[#D8CCA8] rounded-lg px-2 py-1 text-xs text-stone-900 bg-white focus:border-[#8B1E10] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-[#8B1E10] block mb-0.5">Selling</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="w-full border border-[#8B1E10] rounded-lg px-2 py-1 text-xs font-bold text-stone-900 bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[9px] font-bold text-stone-500 block mb-0.5">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock"
                className="w-full border border-[#D8CCA8] rounded-lg px-2 py-1 text-xs text-stone-900 bg-white focus:border-[#8B1E10] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={() => setEditing(false)} className="px-3 py-1 bg-stone-200 text-stone-700 text-xs rounded-lg font-bold">
              Cancel
            </button>
            <button onClick={save} className="px-3 py-1 bg-[#8B1E10] text-white text-xs rounded-lg font-bold">
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#8B1E10] text-sm">{formatCurrency(variant.price)}</span>
            {variant.compare_at_price && (
              <span className="line-through text-stone-400 text-xs font-medium">{formatCurrency(variant.compare_at_price)}</span>
            )}
            {disc > 0 && (
              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                -{disc}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold ${variant.stock < 10 ? 'text-red-600' : 'text-stone-600'}`}>
              {variant.stock} in stock
            </span>
            <button
              onClick={() => setEditing(true)}
              className="p-1 text-stone-500 hover:text-[#8B1E10] hover:bg-stone-100 rounded-lg"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Desktop Table Row ────────────────────────────────────────────────────────
function VariantTableRow({
  variant,
  onUpdate,
}: {
  variant: ProductVariant;
  onUpdate: (updated: ProductVariant) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [mrp, setMrp] = useState(String(variant.compare_at_price || ''));
  const [price, setPrice] = useState(String(variant.price));
  const [stock, setStock] = useState(String(variant.stock));

  const save = () => {
    onUpdate({
      ...variant,
      price: parseFloat(price) || variant.price,
      compare_at_price: parseFloat(mrp) || null,
      stock: parseInt(stock) || variant.stock,
    });
    setEditing(false);
  };

  const disc = discountPct(parseFloat(price) || 0, parseFloat(mrp) || 0);

  return (
    <tr className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
      <td className="px-3 py-2.5">
        <span className="font-bold text-stone-900 text-xs">{variant.size_label}</span>
        {variant.is_default && (
          <span className="ml-1.5 text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">Default</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-xs text-stone-500 font-mono">{variant.sku}</td>

      {editing ? (
        <>
          <td className="px-3 py-2.5">
            <input
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              placeholder="MRP"
              className="w-24 border border-[#D8CCA8] rounded-lg px-2 py-1 text-xs text-stone-900 bg-white focus:border-[#8B1E10] focus:outline-none"
            />
          </td>
          <td className="px-3 py-2.5">
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Selling"
              className="w-24 border border-[#8B1E10] rounded-lg px-2 py-1 text-xs text-stone-900 bg-white focus:outline-none font-bold"
            />
          </td>
          <td className="px-3 py-2.5">
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock"
              className="w-20 border border-[#D8CCA8] rounded-lg px-2 py-1 text-xs text-stone-900 bg-white focus:border-[#8B1E10] focus:outline-none"
            />
          </td>
          <td className="px-3 py-2.5">
            <div className="flex gap-1">
              <button onClick={save} className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setEditing(false)} className="p-1.5 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </td>
        </>
      ) : (
        <>
          <td className="px-3 py-2.5 text-xs">
            {variant.compare_at_price ? (
              <span className="line-through text-stone-400 font-medium">{formatCurrency(variant.compare_at_price)}</span>
            ) : (
              <span className="text-stone-300">—</span>
            )}
          </td>
          <td className="px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#8B1E10] text-sm">{formatCurrency(variant.price)}</span>
              {disc > 0 && (
                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                  -{disc}%
                </span>
              )}
            </div>
          </td>
          <td className="px-3 py-2.5">
            <span className={`text-xs font-bold ${variant.stock < 10 ? 'text-red-600' : 'text-stone-700'}`}>
              {variant.stock} units
            </span>
          </td>
          <td className="px-3 py-2.5">
            <button onClick={() => setEditing(true)} className="p-1.5 text-stone-400 hover:text-[#8B1E10] hover:bg-stone-100 rounded-lg transition-colors">
              <Edit className="w-3.5 h-3.5" />
            </button>
          </td>
        </>
      )}
    </tr>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [imageInputs, setImageInputs] = useState<Record<string, string>>({});
  const MAX_IMAGES = 5;

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          // If database is clean, show empty list (no hardcoded fallback)
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // New product form
  const [form, setForm] = useState({
    name: '',
    short_description: '',
    description: '',
    product_type: 'non-veg-pickle' as 'non-veg-pickle' | 'podi' | 'sweet',
    category_id: INITIAL_CATEGORIES[0].id,
    shelf_life: '6 Months from date of manufacture',
    ingredients: '',
    preparation_info: '',
    storage_info: '',
    variant_label: '250g',
    variant_price: '349',
    variant_mrp: '399',
    variant_stock: '30',
    image_url: '',
  });

  const updateVariant = (productId: string, updated: ProductVariant) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, variants: p.variants.map((v) => (v.id === updated.id ? updated : v)) }
          : p
      )
    );
  };

  const toggleStatus = (productId: string, field: 'active_status' | 'featured_status' | 'bestseller_status') => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, [field]: !p[field as keyof typeof p] } : p))
    );
  };

  const addImageToProduct = (productId: string) => {
    const url = imageInputs[productId]?.trim();
    if (!url) return;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        if ((p.images || []).length >= MAX_IMAGES) return p;
        return { ...p, images: [...(p.images || []), url] };
      })
    );
    setImageInputs((prev) => ({ ...prev, [productId]: '' }));
  };

  const removeImage = (productId: string, imgIdx: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, images: p.images.filter((_, i) => i !== imgIdx) } : p
      )
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: ProductWithVariants = {
      id: `prod-${Date.now()}`,
      name: form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      short_description: form.short_description || 'Handcrafted small-batch Andhra specialty.',
      description: form.description || form.short_description || 'Handcrafted small-batch Andhra specialty from Tenali.',
      category_id: form.category_id,
      product_type: form.product_type,
      images: form.image_url ? [form.image_url] : [],
      ingredients: form.ingredients ? form.ingredients.split(',').map((s) => s.trim()) : [],
      preparation_info: form.preparation_info || null,
      storage_info: form.storage_info || null,
      shelf_life: form.shelf_life,
      net_quantity: form.variant_label,
      featured_status: false,
      bestseller_status: false,
      active_status: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      variants: [
        {
          id: `var-${Date.now()}-1`,
          product_id: `prod-${Date.now()}`,
          sku: `NISA-${form.name.slice(0, 4).toUpperCase().replace(/\s/g, '')}-250G`,
          size_label: form.variant_label || '250g',
          weight_g: 250,
          price: parseFloat(form.variant_price) || 349,
          compare_at_price: parseFloat(form.variant_mrp) || null,
          stock: parseInt(form.variant_stock) || 30,
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    };

    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
    } catch (err) {
      console.error(err);
    }

    setProducts([newProd, ...products]);
    setShowAddModal(false);
    setForm({
      name: '', short_description: '', description: '', product_type: 'non-veg-pickle',
      category_id: INITIAL_CATEGORIES[0].id, shelf_life: '6 Months from date of manufacture',
      ingredients: '', preparation_info: '', storage_info: '',
      variant_label: '250g', variant_price: '349', variant_mrp: '399', variant_stock: '30', image_url: '',
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/admin/products?id=${productId}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearAllProducts = async () => {
    if (!confirm('Clear all products? This gives you a clean slate to add your real products.')) return;
    try {
      await fetch('/api/admin/products?id=all', { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    setProducts([]);
  };

  const handleRestoreSampleProducts = async () => {
    for (const p of INITIAL_PRODUCTS) {
      try {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p),
        });
      } catch (e) {
        console.error(e);
      }
    }
    setProducts(INITIAL_PRODUCTS);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">
            Products & Variants ({products.length})
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium mt-0.5">
            Manage your real product catalogue, prices (MRP & selling price), image URLs, and stock.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {products.length > 0 ? (
            <button
              onClick={handleClearAllProducts}
              className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2 rounded-xl transition-colors"
            >
              Clear All Products (Start Fresh)
            </button>
          ) : (
            <button
              onClick={handleRestoreSampleProducts}
              className="text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-3 py-2 rounded-xl transition-colors"
            >
              Restore Sample Products
            </button>
          )}

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#8B1E10] hover:bg-[#72160B] text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5"
          >
            <Plus className="w-4 h-4 mr-1 shrink-0" /> Add Product
          </Button>
        </div>
      </div>

      {/* 📐 Product Image Specifications & Photography Guide */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs sm:text-sm">
          <Info className="w-4 h-4 text-[#8B1E10] shrink-0" />
          <span>📐 Product Image Specifications & Photography Guidelines</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-700 pt-1">
          <div className="bg-white/80 border border-amber-200/60 rounded-xl p-3">
            <span className="font-extrabold text-[#8B1E10] block text-xs">Recommended Size</span>
            <p className="text-[11px] text-stone-600 mt-0.5 font-mono font-bold">1000 × 1000 px</p>
            <p className="text-[10px] text-stone-500 mt-0.5">Minimum 800 × 800 px (Square)</p>
          </div>

          <div className="bg-white/80 border border-amber-200/60 rounded-xl p-3">
            <span className="font-extrabold text-[#8B1E10] block text-xs">Aspect Ratio</span>
            <p className="text-[11px] text-stone-600 mt-0.5 font-bold">1:1 Square</p>
            <p className="text-[10px] text-stone-500 mt-0.5">Format: WebP, PNG, or JPG (under 1MB)</p>
          </div>

          <div className="bg-white/80 border border-amber-200/60 rounded-xl p-3">
            <span className="font-extrabold text-[#8B1E10] block text-xs">4 Essential Shots</span>
            <p className="text-[10px] text-stone-600 mt-0.5">
              1. Front Jar with label • 2. Open jar with oil & texture • 3. Served with hot rice/ghee • 4. Fresh spices.
            </p>
          </div>
        </div>
      </div>

      {/* Product List */}
      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 border-dashed p-6">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7 text-stone-400" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-sm sm:text-base mb-1">Your Product Catalog is Empty</h3>
          <p className="text-xs text-stone-500 font-medium max-w-xs mx-auto mb-4">
            Start adding your real, homemade products one by one with their prices, sizes, and image URLs.
          </p>
          <Button onClick={() => setShowAddModal(true)} className="bg-[#8B1E10] text-white font-bold text-xs">
            <Plus className="w-4 h-4 mr-1.5" /> Add Your First Product
          </Button>
        </div>
      ) : (
      <div className="space-y-3 sm:space-y-4">
        {products.map((product) => {
          const defaultVariant = product.variants?.find((v) => v.is_default) || product.variants?.[0];
          const disc = discountPct(defaultVariant?.price || 0, defaultVariant?.compare_at_price || 0);
          const isExpanded = expanded === product.id;

          return (
            <div key={product.id} className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs">
              {/* Product main info */}
              <div className="p-3 sm:p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 text-stone-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-extrabold text-stone-900 text-xs sm:text-sm truncate">{product.name}</h3>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium line-clamp-1 mt-0.5">{product.short_description}</p>
                    
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {defaultVariant && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-[#8B1E10]">
                            {formatCurrency(defaultVariant.price)}
                          </span>
                          {defaultVariant.compare_at_price && (
                            <span className="text-[11px] text-stone-400 line-through font-medium">
                              {formatCurrency(defaultVariant.compare_at_price)}
                            </span>
                          )}
                          {disc > 0 && (
                            <span className="text-[8px] sm:text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                              -{disc}% OFF
                            </span>
                          )}
                        </div>
                      )}
                      <span className="text-[9px] sm:text-[10px] text-stone-400 font-medium">
                        • {product.variants?.length || 0} variant{(product.variants?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status badges & Expand button row */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 gap-2 flex-wrap">
                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                    <button
                      onClick={() => toggleStatus(product.id, 'bestseller_status')}
                      title="Toggle Bestseller"
                      className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded border transition-colors ${
                        product.bestseller_status
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-stone-100 text-stone-400 border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      ⭐ Bestseller
                    </button>
                    <button
                      onClick={() => toggleStatus(product.id, 'featured_status')}
                      title="Toggle Featured"
                      className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded border transition-colors ${
                        product.featured_status
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-stone-100 text-stone-400 border-stone-200 hover:border-blue-300'
                      }`}
                    >
                      ✦ Featured
                    </button>
                    <button
                      onClick={() => toggleStatus(product.id, 'active_status')}
                      title="Toggle Active"
                      className={`text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded border transition-colors ${
                        product.active_status
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {product.active_status ? '● Active' : '○ Hidden'}
                    </button>
                  </div>

                  {/* Expand & Delete buttons */}
                  <div className="flex items-center gap-2.5 ml-auto">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : product.id)}
                      className="text-[10px] sm:text-[11px] font-bold text-[#8B1E10] hover:text-[#72160B] flex items-center gap-1"
                    >
                      {isExpanded ? 'Collapse ↑' : 'Edit Variants & Images ↓'}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded: Variants + Images */}
              {isExpanded && (
                <div className="border-t border-stone-100 bg-stone-50/80 p-3 sm:p-4 space-y-4 sm:space-y-5">
                  {/* Variants */}
                  <div>
                    <h4 className="text-[10px] sm:text-xs font-extrabold text-stone-700 uppercase tracking-wider mb-2.5">
                      Size Variants — MRP & Selling Price
                    </h4>
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl border border-stone-200 overflow-hidden">
                      <table className="w-full text-xs">
                        <thead className="bg-stone-50 border-b border-stone-200">
                          <tr>
                            <th className="px-3 py-2 text-left font-extrabold text-stone-600 text-[10px] uppercase">Size</th>
                            <th className="px-3 py-2 text-left font-extrabold text-stone-600 text-[10px] uppercase">SKU</th>
                            <th className="px-3 py-2 text-left font-extrabold text-stone-600 text-[10px] uppercase">MRP (Strike)</th>
                            <th className="px-3 py-2 text-left font-extrabold text-[#8B1E10] text-[10px] uppercase">Selling Price</th>
                            <th className="px-3 py-2 text-left font-extrabold text-stone-600 text-[10px] uppercase">Stock</th>
                            <th className="px-3 py-2 text-left font-extrabold text-stone-600 text-[10px] uppercase">Edit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(product.variants || []).map((v) => (
                            <VariantTableRow
                              key={v.id}
                              variant={v}
                              onUpdate={(updated) => updateVariant(product.id, updated)}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="block md:hidden space-y-2">
                      {(product.variants || []).map((v) => (
                        <VariantCard
                          key={v.id}
                          variant={v}
                          onUpdate={(updated) => updateVariant(product.id, updated)}
                        />
                      ))}
                    </div>

                    <p className="text-[9px] sm:text-[10px] text-stone-400 font-medium mt-1.5">
                      💡 MRP = original price (shown with strikethrough). Selling Price = discounted price customers pay.
                    </p>
                  </div>

                  {/* Product Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] sm:text-xs font-extrabold text-stone-700 uppercase tracking-wider">
                        Product Images
                      </h4>
                      <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        (product.images || []).length >= MAX_IMAGES
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}>
                        {(product.images || []).length}/{MAX_IMAGES} images
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
                      {(product.images || []).map((img, imgIdx) => (
                        <div key={imgIdx} className="relative group">
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 border-stone-200">
                            <Image src={img} alt={`Product image ${imgIdx + 1}`} fill className="object-cover" />
                          </div>
                          <button
                            onClick={() => removeImage(product.id, imgIdx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {imgIdx === 0 && (
                            <span className="absolute bottom-1 left-1 text-[7px] sm:text-[8px] bg-[#8B1E10] text-white px-1 rounded font-bold">Main</span>
                          )}
                        </div>
                      ))}

                      {(!product.images || product.images.length === 0) && (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl border-2 border-dashed border-stone-300 flex items-center justify-center">
                          <Package className="w-5 h-5 text-stone-300" />
                        </div>
                      )}
                    </div>

                    {/* Add image URL */}
                    {(product.images || []).length < MAX_IMAGES ? (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="url"
                          placeholder="Paste image URL (https://...)"
                          value={imageInputs[product.id] || ''}
                          onChange={(e) => setImageInputs((prev) => ({ ...prev, [product.id]: e.target.value }))}
                          className="flex-1 bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-[#8B1E10] focus:outline-none"
                        />
                        <button
                          onClick={() => addImageToProduct(product.id)}
                          className="flex items-center justify-center gap-1.5 bg-[#8B1E10] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#72160B] transition-colors shrink-0"
                        >
                          <ImagePlus className="w-3.5 h-3.5" /> Add Image
                        </button>
                      </div>
                    ) : (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 font-medium">
                        ⚠️ Maximum of 5 images reached. Remove an image above to add a new one.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-stone-900">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 sm:space-y-4">
              <Input label="Product Name *" placeholder="e.g. Andhra Boneless Chicken Pickle" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />

              <Input label="First Product Image URL" placeholder="https://... (wide image recommended)"
                value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />

              {form.image_url && (
                <div className="relative h-20 sm:h-24 rounded-xl overflow-hidden border border-stone-200">
                  <Image src={form.image_url} alt="Preview" fill className="object-cover" />
                </div>
              )}

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">Short Description *</label>
                <textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  rows={2} placeholder="One-line description shown on product cards..."
                  className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none resize-none" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none">
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">Product Type</label>
                  <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value as 'non-veg-pickle' | 'podi' | 'sweet' })}
                    className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none">
                    <option value="non-veg-pickle">Non-Veg Pickle</option>
                    <option value="podi">Podi</option>
                    <option value="sweet">Sweet</option>
                  </select>
                </div>
              </div>

              {/* Default Variant Pricing */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 sm:p-4 space-y-3">
                <h4 className="text-xs font-extrabold text-amber-900">Default Variant Pricing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-extrabold text-stone-600 block mb-0.5">Size Label</label>
                    <input type="text" value={form.variant_label} onChange={(e) => setForm({ ...form, variant_label: e.target.value })}
                      placeholder="250g"
                      className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-stone-600 block mb-0.5">MRP ₹ (Strike)</label>
                    <input type="number" value={form.variant_mrp} onChange={(e) => setForm({ ...form, variant_mrp: e.target.value })}
                      placeholder="399"
                      className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-extrabold text-[#8B1E10] block mb-0.5">Selling Price ₹ *</label>
                    <input type="number" value={form.variant_price} onChange={(e) => setForm({ ...form, variant_price: e.target.value })}
                      placeholder="349"
                      className="w-full bg-white border border-[#8B1E10] rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-stone-600 block mb-0.5">Starting Stock</label>
                  <input type="number" value={form.variant_stock} onChange={(e) => setForm({ ...form, variant_stock: e.target.value })}
                    placeholder="30"
                    className="w-full sm:w-32 bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none" />
                </div>
              </div>

              <Input label="Shelf Life" placeholder="e.g. 6 Months from date of manufacture"
                value={form.shelf_life} onChange={(e) => setForm({ ...form, shelf_life: e.target.value })} />

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">Ingredients (comma-separated)</label>
                <textarea value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                  rows={2} placeholder="Fresh Chicken, Wood-Pressed Sesame Oil, Guntur Red Chili, Garlic..."
                  className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none resize-none" />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2 border-t border-stone-100">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto bg-[#8B1E10] text-white font-bold">Create Product</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
