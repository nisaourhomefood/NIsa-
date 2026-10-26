import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { CartProvider } from '@/lib/store/cart-context';
import { StorefrontWrapper } from '@/components/storefront-wrapper';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://nisaourhomefood.in';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'NISA (నిస) – Mana Inti Vanta | Authentic Small-Batch Andhra Pickles & Home Food',
    template: '%s | NISA Foods (నిస)',
  },
  description:
    'Order authentic handcrafted Andhra non-veg pickles (boneless chicken pickle, gongura mutton, sea prawns), roasted chicken podis, and traditional sweets made in Tenali, AP using pure wood-pressed sesame oil. Shipped across India.',
  keywords: [
    'NISA Foods',
    'Mana Inti Vanta',
    'Andhra Chicken Pickle',
    'Boneless Chicken Pickle Tenali',
    'Gongura Mutton Pickle Andhra',
    'Tenali Pickles Online',
    'Authentic Andhra Non Veg Pickles',
    'Wood Pressed Sesame Oil Pickles',
    'Chicken Podi Andhra Style',
    'Nuvvula Nune Pickles',
    'Tenali Andhra Pradesh Food Delivery',
  ],
  authors: [{ name: 'NISA Foods - Tenali Kitchen' }],
  creator: 'NISA Foods',
  publisher: 'NISA Foods',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: 'NISA (నిస) – Authentic Small-Batch Andhra Non-Veg Pickles & Podis',
    description:
      'Handcrafted Andhra delicacies from Tenali, AP. Fresh boneless chicken, gongura mutton & prawns pickles made with wood-pressed sesame oil (nuvvula nune). Order online with pan-India delivery.',
    url: BASE_URL,
    siteName: 'NISA - Mana Inti Vanta',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'NISA Authentic Andhra Pickles and Sweets from Tenali',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NISA (నిస) – Authentic Andhra Home Pickles & Food',
    description:
      'Small-batch non-veg Andhra pickles made in Tenali with wood-pressed sesame oil. Fast delivery across India.',
    images: ['https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'IN-AP',
    'geo.placename': 'Tenali, Andhra Pradesh',
    'geo.position': '16.2435;80.6400',
    'ICBM': '16.2435, 80.6400',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // AEO & GEO Structured Data JSON-LD Schema
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'Store'],
        '@id': `${BASE_URL}/#organization`,
        name: 'NISA - Mana Inti Vanta',
        alternateName: ['NISA Foods', 'నిస మన ఇంటి వంట', 'NISA Tenali Pickles'],
        url: BASE_URL,
        logo: `${BASE_URL}/nisaralogo.png`,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1200&auto=format&fit=crop',
        description:
          'Authentic handcrafted small-batch Andhra non-veg pickles, roasted podis, and traditional sweets made in Tenali, Andhra Pradesh with cold-pressed sesame oil.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Door No. 4-12-88, Guntur Road',
          addressLocality: 'Tenali',
          addressRegion: 'Andhra Pradesh',
          postalCode: '522201',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 16.2435,
          longitude: 80.6400,
        },
        priceRange: '₹₹',
        telephone: '+917569344938',
        email: 'nisaourhomefood@gmail.com',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+917569344938',
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['English', 'Telugu', 'Hindi'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'NISA Foods',
        publisher: {
          '@id': `${BASE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-[#FFFDF9] text-stone-900 font-sans min-h-screen flex flex-col selection:bg-red-800 selection:text-white">
        <CartProvider>
          <StorefrontWrapper>{children}</StorefrontWrapper>
        </CartProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
