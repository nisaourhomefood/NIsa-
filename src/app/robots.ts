import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nisaourhomefood.in';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/products/*',
          '/pickles',
          '/podis',
          '/sweets',
          '/combos',
          '/story',
          '/how-we-make-it',
          '/recipes',
          '/recipes/*',
          '/faq',
          '/contact',
          '/shipping-policy',
          '/return-policy',
          '/privacy-policy',
          '/terms',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/checkout',
          '/checkout/*',
          '/account',
          '/account/*',
        ],
      },
      {
        userAgent: ['GPTBot', 'PerplexityBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended'],
        allow: ['/', '/products', '/products/*', '/pickles', '/podis', '/sweets', '/combos', '/story', '/how-we-make-it', '/recipes', '/recipes/*', '/faq'],
        disallow: ['/admin/*', '/api/*', '/checkout/*'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
