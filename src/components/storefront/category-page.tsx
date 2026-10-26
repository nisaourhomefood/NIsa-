import Link from 'next/link';
import { PackageX } from 'lucide-react';
import { ProductCard } from '@/components/storefront/product-card';
import { ProductWithVariants } from '@/types/database.types';

interface CategoryPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  products: ProductWithVariants[];
}

export function CategoryPage({ eyebrow, title, intro, body, products }: CategoryPageProps) {
  return (
    <div className="bg-[#FAF6F0] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-6 text-center space-y-3">
        <span className="text-xs uppercase font-extrabold text-[#8B1E10] tracking-widest">{eyebrow}</span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900">{title}</h1>
        <p className="text-sm text-stone-600 font-medium max-w-2xl mx-auto">{intro}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {products.length === 0 ? (
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-10 text-center space-y-3 max-w-md mx-auto">
            <PackageX className="w-10 h-10 text-[#8B1E10] mx-auto" />
            <h3 className="text-base font-bold text-stone-900">Nothing listed here right now</h3>
            <p className="text-xs text-stone-500">Check back soon, or browse the full catalogue.</p>
            <Link href="/products" className="inline-block bg-[#8B1E10] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl">
              View Full Catalogue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white border border-[#E8DFC9] rounded-2xl p-6 sm:p-8 text-sm text-stone-700 leading-relaxed font-medium">
          {body}
        </div>
      </div>
    </div>
  );
}
