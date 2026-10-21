import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Flame, CheckCircle2, HelpCircle, Shield, Clock, Award, Truck } from 'lucide-react';
import { BannerCarousel } from '@/components/storefront/banner-carousel';
import { ProductCard } from '@/components/storefront/product-card';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '@/lib/data/mock-products';
import { createAdminClient } from '@/lib/supabase/admin';
import { isShopifyConfigured, getShopifyProducts } from '@/lib/shopify/api';
import { Button } from '@/components/ui/button';

async function getLiveProducts() {
  // 1. Try Shopify if configured
  if (isShopifyConfigured()) {
    try {
      const shopifyProducts = await getShopifyProducts({ first: 50 });
      if (shopifyProducts && shopifyProducts.length > 0) {
        return shopifyProducts;
      }
    } catch (e) {
      console.warn('Failed to load products from Shopify on homepage:', e);
    }
  }

  // 2. Fallback to Supabase
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_variants(*), categories(id,name,slug)')
      .eq('active_status', true)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((p: any) => ({
        ...p,
        variants: p.product_variants && p.product_variants.length > 0
          ? p.product_variants.sort((a: any, b: any) => a.weight_g - b.weight_g)
          : [
              {
                id: `var-${p.id}-250`,
                product_id: p.id,
                size_label: '250g',
                weight_g: 250,
                price: 349,
                compare_at_price: 399,
                stock: 30,
                is_default: true,
              },
            ],
        category: p.categories || null,
      }));
    }
  } catch (e) {
    console.error('Failed to load products on homepage:', e);
  }
  return INITIAL_PRODUCTS;
}

export default async function HomePage() {
  const liveProducts = await getLiveProducts();

  // Trending: bestseller products
  const trendingProducts = liveProducts.filter((p) => p.bestseller_status || p.featured_status);

  // All products for second section
  const allProducts = liveProducts.filter((p) => p.active_status);

  const faqs = [
    {
      q: 'Where is NISA made?',
      a: 'All NISA pickles, podis, and sweets are handcrafted in small batches in our kitchen in Tenali, Guntur District, Andhra Pradesh.',
    },
    {
      q: 'Do you deliver across India?',
      a: 'Yes! We ship pan-India via express courier. Orders are dispatched within 24 hours of preparation from Tenali.',
    },
    {
      q: 'How should pickles be stored?',
      a: 'Store in a cool, dry pantry away from direct sunlight. Always use a clean, dry spoon and ensure the oil layer covers the pickle.',
    },
    {
      q: 'What sizes are available?',
      a: 'Pickles are available in 250g, 500g, and 1kg glass jars. Podis in 150g, 250g, and 500g packs.',
    },
    {
      q: 'Is there a first-order discount?',
      a: 'Yes! New customers get ₹99 off on orders above ₹1499. Use code FIRSTORDER99 at checkout.',
    },
    {
      q: 'How can I contact NISA?',
      a: 'WhatsApp +91 7569344938 (Mon–Sat, 9 AM–7 PM IST) or email care@nisafoods.com.',
    },
  ];

  const trustPoints = [
    { icon: Shield, title: 'Zero Preservatives', desc: 'No artificial additives. Ever.' },
    { icon: Award, title: 'Wood-Pressed Sesame Oil', desc: 'Cold-pressed Nuvvula Nune from Tenali.' },
    { icon: Clock, title: 'Small-Batch Freshness', desc: '5kg batches in brass Uruli vessels.' },
    { icon: Truck, title: 'Pan-India Shipping', desc: 'Express delivery in 3–5 business days.' },
  ];

  return (
    <div className="bg-[#FAF6F0]">

      {/* ── 1. BANNER CAROUSEL ── */}
      <BannerCarousel />

      {/* ── 2. MOST TRENDING PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#8B1E10]" /> Bestsellers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Most Trending Products
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-extrabold text-[#8B1E10] hover:text-[#72160B] flex items-center gap-1 group"
          >
            View Full Catalogue ({liveProducts.length}) <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {(trendingProducts.length > 0 ? trendingProducts : liveProducts).slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 3. TRUST POINTS STRIP ── */}
      <section className="bg-white border-t border-b border-[#E8DFC9] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((tp, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B1E10]/10 flex items-center justify-center shrink-0">
                  <tp.icon className="w-5 h-5 text-[#8B1E10]" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-stone-900">{tp.title}</h4>
                  <p className="text-xs text-stone-600 font-medium mt-0.5">{tp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. COMPLETE EXPLORE CATALOGUE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-wider">
              Handcrafted in Tenali
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Explore Our Pure Andhra Creations
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-extrabold text-[#8B1E10] hover:text-[#72160B] flex items-center gap-1"
          >
            All Products ({liveProducts.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {allProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── 5. BRAND STORY STRIP ── */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-widest">
                Our Roots in Tenali
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Authentic Andhra Flavors, Cooked With Love in Brass Urulis
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                NISA was founded on a simple truth: nothing beats mother’s hand-cooked pickle.
                We prepare every batch in small 5kg vessels using cold-pressed sesame oil,
                hand-ground Guntur red chilies, and grandmother’s recipe from Tenali.
                Zero factory preservatives. Pure nostalgia in every bite.
              </p>
              <div className="pt-2">
                <Link
                  href="/story"
                  className="inline-flex items-center gap-2 bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-colors shadow-md"
                >
                  Read Our Full Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-stone-700 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop"
                alt="Traditional Andhra kitchen in Tenali"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FAQ SECTION ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-wider">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-[#E8DFC9] rounded-2xl p-5 shadow-2xs space-y-1.5">
              <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#8B1E10] shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-stone-600 font-medium pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
