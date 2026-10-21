'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  Flame,
  Utensils,
  HelpCircle,
  Zap,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Camera,
  HeartHandshake,
  Clock,
  Award,
} from 'lucide-react';
import { ProductWithVariants, ProductVariant, Review } from '@/types/database.types';
import { formatCurrency, calculateDiscountPercentage } from '@/lib/utils';
import { useCart } from '@/lib/store/cart-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/storefront/product-card';

// Fallback high-res authentic Andhra food photography shots if product only has 1 image
const DEFAULT_ANGLE_IMAGES = [
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop', // Front Jar / Spread
  'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop', // Oil & Texture scoop
  'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop', // Hot Rice & Ghee pairing
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<ProductWithVariants | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setProduct(data);
        }
      })
      .catch((err) => console.error('Error loading product by slug:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  const { addItem, proceedToShopifyCheckout, isShopifyCheckoutLoading } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const defaultVariant: ProductVariant = product?.variants?.find((v: ProductVariant) => v.is_default) || product?.variants?.[0] || {
    id: 'default',
    product_id: product?.id || '',
    sku: 'NISA-DEF-250G',
    size_label: '250g',
    weight_g: 250,
    price: 349,
    compare_at_price: 399,
    stock: 30,
    is_default: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'prep' | 'storage' | 'shelf_life' | 'reviews'>('ingredients');

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const def = product.variants.find((v: ProductVariant) => v.is_default) || product.variants[0];
      setSelectedVariant(def);
    }
  }, [product]);

  // Customer Reviews State & Interactive Review Form
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [reviewName, setReviewName] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImageUrl, setReviewImageUrl] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (loading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 bg-[#FAF6F0]">
        <div className="w-8 h-8 border-3 border-[#8B1E10] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-stone-600 text-sm font-bold">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 bg-[#FAF6F0]">
        <h1 className="text-2xl font-bold text-stone-900">Product Not Found</h1>
        <p className="text-stone-600 text-sm">The product you are looking for does not exist.</p>
        <Link href="/products">
          <Button className="bg-[#8B1E10] text-white font-bold">Back to Catalogue</Button>
        </Link>
      </div>
    );
  }

  // Combine product images with fallback angles so we always have at least 3 distinct shots
  const galleryImages = [
    ...(product.images || []),
    ...DEFAULT_ANGLE_IMAGES.filter((img) => !(product.images || []).includes(img)),
  ].slice(0, 3);

  const discountPercent = selectedVariant.compare_at_price
    ? calculateDiscountPercentage(selectedVariant.compare_at_price, selectedVariant.price)
    : 0;

  // Related products: populated once a real related-products fetch is wired up
  const relatedProducts: ProductWithVariants[] = [];

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const handleBuyNow = async () => {
    addItem(product, selectedVariant, quantity);
    const redirected = await proceedToShopifyCheckout();
    if (!redirected) {
      router.push('/checkout');
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      product_id: product.id,
      customer_name: reviewName,
      rating: newRating,
      title: reviewTitle || 'Excellent Taste & Quality!',
      comment: reviewComment,
      image_url: reviewImageUrl || undefined,
      is_verified_purchase: true,
      is_approved: true,
      created_at: new Date().toISOString(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setReviewSubmitted(true);
    setReviewName('');
    setReviewTitle('');
    setReviewComment('');
    setReviewImageUrl('');
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
    }, 2500);
  };

  const isPickle = product.product_type === 'non-veg-pickle';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 bg-[#FAF6F0]">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-stone-600 font-medium flex items-center space-x-2">
        <Link href="/" className="hover:text-[#8B1E10]">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-[#8B1E10]">Products</Link>
        <span>/</span>
        <span className="text-stone-900 font-bold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main PDP Grid (Aligned Heights between Gallery and Buy Box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Left Column: Image Gallery with 3 Under Thumbnails & Translucent Nav Arrows */}
        <div className="lg:col-span-6 space-y-3">
          
          {/* Main Large Image Box */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-white border border-[#E8DFC9] shadow-md group">
            <Image
              src={galleryImages[activeImageIndex] || galleryImages[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-102"
              priority
            />

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.bestseller_status && (
                <span className="text-[10px] font-black uppercase bg-[#8B1E10] text-white px-2.5 py-1 rounded-md shadow-sm">
                  🔥 BESTSELLER
                </span>
              )}
              <span className="text-[10px] font-extrabold uppercase bg-stone-900/80 backdrop-blur-xs text-amber-300 px-2.5 py-1 rounded-md shadow-sm">
                100% Home Cooked
              </span>
            </div>

            {discountPercent > 0 && (
              <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-md shadow-md border border-red-700 z-10">
                SAVE {discountPercent}%
              </div>
            )}

            {/* Light Translucent Nav Arrows with Opacity on Hover / Tap */}
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-70 hover:opacity-100 shadow-md cursor-pointer z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-70 hover:opacity-100 shadow-md cursor-pointer z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Bottom Oil Guarantee Banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-white flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Wood-Pressed Sesame Oil (Nuvvula Nune)</span>
              </span>
              <span className="text-[10px] text-amber-300">Tenali Recipe</span>
            </div>
          </div>

          {/* 3 Thumbnails Directly Under Large Image */}
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[4/3] w-full rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-white ${
                  activeImageIndex === idx
                    ? 'border-[#8B1E10] ring-2 ring-[#8B1E10]/30 shadow-md scale-[1.02]'
                    : 'border-[#E8DFC9] opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
                <span className="absolute bottom-1 right-1 text-[8px] font-black bg-stone-900/80 text-white px-1.5 py-0.5 rounded">
                  Shot {idx + 1}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Header & Live Uruli Batch Pulse */}
          <div className="space-y-2">
            
            {/* Live Uruli Batch Pulse Bar */}
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-950">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#8B1E10] animate-pulse" />
                <span>Handcrafted in small 5kg Brass Uruli</span>
              </span>
              <span className="text-[#8B1E10] font-black text-[10px] bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                🔥 Fresh Batch Live
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.average_rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-extrabold text-stone-900">{product.average_rating || 4.9}</span>
              <span className="text-stone-500">({reviewsList.length} customer reviews)</span>
            </div>
          </div>

          {/* Pricing Box with Milestone Hint */}
          <div className="bg-white border border-[#E8DFC9] p-4 rounded-2xl space-y-1 shadow-2xs">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#8B1E10]">
                {formatCurrency(selectedVariant.price)}
              </span>
              {selectedVariant.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                <span className="text-sm text-stone-400 line-through font-bold">
                  {formatCurrency(selectedVariant.compare_at_price)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded">
                  Save {formatCurrency(selectedVariant.compare_at_price! - selectedVariant.price)}
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-600 font-medium">
              Tax included • 🎁 <strong>FREE 100g Podi</strong> on orders over ₹999 • <strong>FREE Express Delivery</strong> on orders over ₹2,499.
            </p>
          </div>

          {/* Description */}
          <p className="text-stone-700 text-xs sm:text-sm leading-relaxed font-medium">
            {product.description}
          </p>

          {/* Net Quantity & Shelf Life Admin info badge */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-800 bg-[#FAF6F0] p-2.5 rounded-xl border border-[#E8DFC9]">
            <div>Pack Weight: <span className="text-[#8B1E10] font-extrabold">{selectedVariant.size_label}</span></div>
            <div>Shelf Life: <span className="text-[#8B1E10] font-extrabold">{product.shelf_life}</span></div>
          </div>

          {/* Pack Size / Weight Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 flex justify-between">
              <span>Select Pack Size & Price:</span>
              <span className="text-[#8B1E10] font-black">{selectedVariant.size_label}</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(product.variants || []).map((v: ProductVariant) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B1E10] text-white border-[#8B1E10] shadow-sm font-bold ring-2 ring-[#8B1E10]/20'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-[#8B1E10]/40 font-medium'
                    }`}
                  >
                    <span className="block text-xs font-black">{v.size_label}</span>
                    <span className={`block text-xs font-extrabold mt-0.5 ${isSelected ? 'text-amber-200' : 'text-[#8B1E10]'}`}>
                      {formatCurrency(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & High-Converting CTA Buttons with Glowing Shimmer Effect */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shrink-0 shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3.5 text-xs sm:text-sm font-black text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                size="lg"
                className={`flex-1 font-extrabold shadow-md transition-all text-xs sm:text-sm py-3.5 rounded-xl ${
                  addedSuccess
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#8B1E10] hover:bg-[#72160B] text-white'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                  </>
                )}
              </Button>
            </div>

            {/* Glowing Buy Now Button with Shimmer & High-Converting Gold Gradient */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isShopifyCheckoutLoading}
              className="w-full bg-gradient-to-r from-[#C68B27] via-[#DDA74A] to-[#C68B27] hover:brightness-105 active:scale-[0.99] text-stone-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
            >
              {isShopifyCheckoutLoading ? (
                <div className="w-4 h-4 border-2 border-stone-900/30 border-t-stone-900 rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-current text-stone-950" />
              )}
              <span>{isShopifyCheckoutLoading ? 'CONNECTING TO CHECKOUT...' : 'BUY NOW — SECURE CHECKOUT'}</span>
            </button>
          </div>

          {/* Reassuring Dispatch & Delivery Policy Banner (Exact Address Calculation at Checkout) */}
          <div className="bg-[#FAF6F0] p-3 rounded-2xl border border-[#E8DFC9] text-xs text-stone-700 space-y-1.5 font-medium">
            <div className="flex items-center gap-1.5 font-extrabold text-stone-900">
              <Truck className="w-4 h-4 text-[#8B1E10]" />
              <span>Fresh Cooking & Pan-India Courier Timeline</span>
            </div>
            <ul className="text-[11px] text-stone-600 space-y-0.5 list-disc list-inside">
              <li><strong>48 Hours Fresh Batch Prep</strong>: Hand-cooked & oil-sealed in Tenali upon order.</li>
              <li><strong>3–5 Days Express Courier</strong>: Live tracking link sent to your WhatsApp.</li>
              <li>Exact delivery fee calculated at address step (FREE on orders above ₹2,499).</li>
            </ul>
          </div>

        </div>

      </div>

      {/* 3 Full-Width Purity & Heritage Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC9] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <span className="text-xs font-black block text-stone-900">100% Home Cooked</span>
            <span className="text-[11px] text-stone-500 font-medium">Saraswati's Small-Batch Kitchen</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC9] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-[#8B1E10]" />
          </div>
          <div>
            <span className="text-xs font-black block text-stone-900">Guntur Red Mirchi</span>
            <span className="text-[11px] text-stone-500 font-medium">Sun-Dried & Stone-Pestle Ground</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-[#E8DFC9] flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#C68B27]" />
          </div>
          <div>
            <span className="text-xs font-black block text-stone-900">Fresh 48h Batch</span>
            <span className="text-[11px] text-stone-500 font-medium">Cooked Fresh • Zero Chemicals</span>
          </div>
        </div>
      </div>

      {/* Serving Suggestions Section */}
      {isPickle && (
        <div className="bg-white border border-[#E8DFC9] rounded-3xl p-5 sm:p-7 space-y-3.5 shadow-2xs">
          <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#8B1E10]" /> Recommended Serving Suggestions
          </h3>
          <p className="text-xs text-stone-600 font-medium">
            This traditional Tenali recipe pairs exceptionally well with:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {['Hot Rice & Ghee', 'Creamy Curd Rice', 'Crispy Dosa', 'Soft Fluffy Idli', 'Warm Chapati'].map((item, idx) => (
              <div key={idx} className="bg-[#FAF6F0] border border-[#E8DFC9] p-2.5 rounded-xl text-center text-xs font-bold text-stone-800 shadow-2xs">
                🍚 {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tabs: Rich Ingredients, Grandmother Prep Method, Storage, Shelf Life, Real Reviews with Photo Upload ── */}
      <div className="pt-4 space-y-4">
        
        {/* Tab Headers */}
        <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar gap-1">
          {[
            { id: 'ingredients', label: '🌿 Ingredients' },
            { id: 'prep', label: '👩‍🍳 Preparation Method' },
            { id: 'storage', label: '🏺 Storage Instructions' },
            { id: 'shelf_life', label: '📅 Shelf Life & Care' },
            { id: 'reviews', label: `⭐ Reviews (${reviewsList.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 sm:px-6 py-3 font-extrabold text-xs sm:text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#8B1E10] text-[#8B1E10] bg-white rounded-t-xl'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white border border-[#E8DFC9] rounded-2xl p-5 sm:p-8 shadow-xs">
          
          {/* TAB 1: Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900">Farm-Fresh Authentic Ingredients</h3>
                <p className="text-xs text-stone-600 font-medium mt-0.5">
                  100% natural. Zero artificial food colors, zero commercial vinegar, zero chemical preservatives:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {(product.ingredients || []).map((ing: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 bg-[#FAF6F0] p-3 rounded-xl border border-[#E8DFC9] text-xs text-stone-800 font-bold"
                  >
                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{ing}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Wood-Pressed Sesame Oil (Nuvvula Nune)</span>
                </div>
                <div className="flex items-center gap-2.5 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
                  <Flame className="w-4 h-4 text-[#8B1E10] shrink-0" />
                  <span>Sun-Dried Guntur Red Chilies</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Preparation Method */}
          {activeTab === 'prep' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-stone-900">Traditional Tenali Slow-Cooking Process</h3>
                <p className="text-xs text-stone-600 font-medium mt-0.5">
                  Hand-cooked in small 5kg batches using Saraswati&apos;s grandmother&apos;s ancestral recipe:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] space-y-1">
                  <span className="font-black text-[#8B1E10] block text-xs">Step 1: Selection & Washing</span>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    Farm-fresh meat is cut to exact bite-sized portions and washed with natural turmeric and fresh lemon juice to seal pure tenderness.
                  </p>
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] space-y-1">
                  <span className="font-black text-[#8B1E10] block text-xs">Step 2: Slow Brass Uruli Roasting</span>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    Slowly roasted in pure wood-pressed sesame oil in traditional brass Urulis until all meat moisture completely evaporates, creating a crispy golden exterior.
                  </p>
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] space-y-1">
                  <span className="font-black text-[#8B1E10] block text-xs">Step 3: Hand-Pounded Spice Infusion</span>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    Fresh stone-ground garlic, ginger, roasted fenugreek, and Guntur chili powder are folded at a low simmer so flavors deeply penetrate every fiber.
                  </p>
                </div>

                <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] space-y-1">
                  <span className="font-black text-[#8B1E10] block text-xs">Step 4: 24-Hour Maturation & Sealing</span>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    The pickle is allowed to rest in stone jars for 24 hours to mature before being hygienically packed in oil-sealed jars for dispatch.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Storage Instructions */}
          {activeTab === 'storage' && (
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-black text-stone-900">How to Store & Maintain Freshness</h3>
              <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] space-y-2 text-xs text-stone-700 font-medium">
                <p className="flex items-start gap-2">
                  <span className="text-[#8B1E10] font-black">1.</span>
                  <span><strong>Always use a clean, completely dry spoon.</strong> Never use wet utensils as water drops can cause spoiling.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#8B1E10] font-black">2.</span>
                  <span><strong>Keep oil layer intact:</strong> The natural wood-pressed sesame oil acts as a natural air seal. Ensure oil covers the top surface.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-[#8B1E10] font-black">3.</span>
                  <span><strong>Cool pantry storage:</strong> Stays fresh for 3 months at normal room temperature. Refrigerate after opening for 6+ months of peak aroma.</span>
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Shelf Life & Care */}
          {activeTab === 'shelf_life' && (
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-black text-stone-900">Shelf Life & Purity Guarantee</h3>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                Official Shelf Life: <strong className="text-[#8B1E10]">{product.shelf_life}</strong> from the date of cooking.
              </p>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium space-y-1">
                <p className="font-bold">✨ Zero Chemical Preservatives Guarantee:</p>
                <p className="text-[11px] text-emerald-800">
                  Unlike commercial supermarket pickles loaded with sodium benzoate and artificial vinegar, NISA relies on pure sesame oil, sea salt, and roasted spices for 100% natural preservation.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Customer Reviews & Interactive Photo Upload Form */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Header & Write Review Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900">
                    Customer Reviews ({reviewsList.length})
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-600">
                    <span className="text-amber-500 font-extrabold">★ 4.9 out of 5</span>
                    <span>• Verified Tenali Kitchen buyers</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold text-xs py-2 px-4 rounded-xl"
                >
                  <Camera className="w-4 h-4 mr-1.5" />
                  {showReviewForm ? 'Cancel Review' : 'Write a Review with Photo'}
                </Button>
              </div>

              {/* Interactive Submit Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="bg-[#FAF6F0] p-4 sm:p-6 rounded-2xl border border-[#E8DFC9] space-y-3.5 animate-fadeIn">
                  <h4 className="text-sm font-black text-stone-900">Share Your Experience & Dish Photo</h4>

                  {/* Rating Selector */}
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-stone-700 block">Your Rating *</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-extrabold text-stone-700 block mb-1">Your Name & City *</label>
                      <input
                        type="text"
                        placeholder="e.g. Srinivas Rao (Hyderabad)"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        required
                        className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#8B1E10]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-stone-700 block mb-1">Review Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Pure authentic Andhra home taste!"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#8B1E10]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-stone-700 block mb-1">Your Review *</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about the flavor, spice level, and how you paired it (hot rice, ghee, dosa)..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      className="w-full bg-white border border-[#D8CCA8] rounded-xl p-3 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#8B1E10] resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-stone-700 block mb-1">
                      Dish / Plate Photo URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://... (Direct photo link of your meal)"
                      value={reviewImageUrl}
                      onChange={(e) => setReviewImageUrl(e.target.value)}
                      className="w-full bg-white border border-[#D8CCA8] rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#8B1E10]"
                    />
                    {reviewImageUrl && (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden mt-2 border border-stone-200">
                        <Image src={reviewImageUrl} alt="Review dish preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  {reviewSubmitted ? (
                    <div className="bg-emerald-100 text-emerald-900 p-2.5 rounded-xl text-xs font-extrabold text-center">
                      ✓ Thank you! Your review and photo have been published.
                    </div>
                  ) : (
                    <Button type="submit" className="bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold text-xs">
                      Submit Verified Review
                    </Button>
                  )}
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="bg-[#FAF6F0] p-4 sm:p-5 rounded-2xl border border-[#E8DFC9] space-y-2.5 shadow-2xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-xs sm:text-sm text-stone-900">{rev.customer_name}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex items-center text-amber-500">
                            {[...Array(rev.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            ✓ Verified Buyer
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">
                        {new Date(rev.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-stone-900">{rev.title}</h4>
                    <p className="text-xs text-stone-700 leading-relaxed font-medium">"{rev.comment}"</p>

                    {/* Reviewer Uploaded Dish Photo */}
                    {rev.image_url && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 shadow-2xs mt-2">
                        <Image src={rev.image_url} alt="Customer meal" fill className="object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Product FAQ Section */}
      <div className="bg-white border border-[#E8DFC9] rounded-3xl p-5 sm:p-7 space-y-3.5 shadow-xs">
        <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#8B1E10]" /> Product Questions & Answers
        </h3>
        <div className="space-y-3 text-xs text-stone-700 font-medium">
          <div>
            <strong className="block text-stone-900">Q: Is this made with pure wood-pressed sesame oil or vinegar?</strong>
            <p className="text-stone-600 mt-0.5">We strictly use 100% wood-pressed sesame oil (Nuvvula Nune). Zero commercial vinegar, zero chemical acid.</p>
          </div>
          <div>
            <strong className="block text-stone-900">Q: How is it packaged for transit?</strong>
            <p className="text-stone-600 mt-0.5">Hygienically sealed food-grade glass jars wrapped in shock-absorbent multi-layer bubble cushioning and protective corrugated boxes.</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-stone-900">
          Complete Your Andhra Meal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

    </div>
  );
}
