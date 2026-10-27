import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getRecipeBySlug, RECIPE_ARTICLES } from '@/lib/content/recipes';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nisaourhomefood.in';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return RECIPE_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getRecipeBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const url = `${BASE_URL}/recipes/${article.slug}`;

  return {
    title: article.title,
    description: article.desc,
    alternates: { canonical: `/recipes/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.desc,
      url,
      type: 'article',
      images: [{ url: `${BASE_URL}${article.image}`, width: 1200, height: 750, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.desc,
      images: [`${BASE_URL}${article.image}`],
    },
  };
}

export default async function RecipeArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getRecipeBySlug(slug);

  if (!article) {
    notFound();
  }

  const url = `${BASE_URL}/recipes/${article.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.desc,
    image: `${BASE_URL}${article.image}`,
    datePublished: article.date,
    author: { '@type': 'Organization', name: 'NISA Foods' },
    publisher: {
      '@type': 'Organization',
      name: 'NISA Foods',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/nisaralogo.png` },
    },
    mainEntityOfPage: url,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Recipes & Stories', item: `${BASE_URL}/recipes` },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  };

  const otherArticles = RECIPE_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="bg-[#FAF6F0] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
        <div className="text-xs text-stone-500 font-medium mb-6">
          <Link href="/" className="hover:text-[#8B1E10]">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/recipes" className="hover:text-[#8B1E10]">Recipes & Stories</Link>
          <span className="mx-1.5">/</span>
          <span className="text-stone-800 font-bold">{article.title}</span>
        </div>

        <span className="text-[10px] uppercase font-extrabold text-[#8B1E10] bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
          {article.categoryLabel}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 mt-3">{article.title}</h1>
        <div className="text-xs text-stone-500 font-medium mt-2">
          {article.author} • {article.date} • {article.readTime}
        </div>

        <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-stone-100 mt-6">
          <Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, 700px" className="object-cover" priority />
        </div>

        <div className="text-sm sm:text-base text-stone-700 leading-relaxed font-medium space-y-4 pt-8">
          {article.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="pt-10 flex flex-wrap gap-3">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1.5 bg-white border border-[#E8DFC9] text-stone-900 text-xs font-extrabold px-5 py-2.5 rounded-xl hover:border-[#8B1E10]/40"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Recipes & Stories
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 bg-[#8B1E10] hover:bg-[#72160B] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-colors"
          >
            Shop NISA's Catalogue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {otherArticles.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-4">
          <h2 className="text-lg font-black text-stone-900">More from the Journal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/recipes/${a.slug}`}
                className="bg-white border border-[#E8DFC9] rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden">
                  <Image src={a.image} alt={a.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-extrabold text-stone-900 group-hover:text-[#8B1E10] transition-colors line-clamp-2">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
