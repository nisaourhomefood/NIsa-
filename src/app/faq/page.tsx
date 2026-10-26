import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'FAQ — Shelf Life, Shipping & Payments',
  description:
    'Answers to common questions about NISA\'s Andhra pickles and podis: shelf life without preservatives, pan-India shipping timelines, and payment options via UPI or Cashfree.',
  alternates: { canonical: '/faq' },
};

const faqs = [
  {
    q: 'What makes NISA pickles authentic to Tenali home food?',
    a: 'NISA pickles are prepared strictly in 5kg small batches using traditional brass Urulis in Tenali. We use 100% cold wood-pressed sesame oil (Nuvvula Nune), sun-dried Guntur chilies, and zero artificial preservatives.',
  },
  {
    q: 'How long do non-veg pickles stay fresh?',
    a: 'When stored properly in a cool pantry with a clean dry spoon, NISA pickles remain fresh for up to 6 months. Always ensure the oil level covers the meat pieces.',
  },
  {
    q: 'Do you ship across India?',
    a: 'Yes! We ship across India via express courier. Orders are dispatched from Tenali within 24 hours of small-batch preparation. Delivery takes 3 to 5 business days.',
  },
  {
    q: 'What payment options are available?',
    a: 'You can order directly via WhatsApp and pay by UPI, or pay online through Cashfree (Google Pay, PhonePe, Paytm, Cards & NetBanking). We currently do not offer Cash on Delivery.',
  },
  {
    q: 'What ingredients are used in the Traditional Nut & Seed Laddu?',
    a: 'Our laddus are made with roasted California almonds, cashews, pumpkin seeds, melon seeds, flax seeds, organic palm jaggery, and pure A2 cow ghee. No refined sugar or artificial syrup.',
  },
];

export default function FAQPage() {
  // FAQPage schema — text here must stay identical to what's rendered below,
  // and this schema only lives on this page, not site-wide.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-extrabold text-red-900 tracking-widest flex items-center justify-center gap-1">
          <HelpCircle className="w-4 h-4" /> Got Questions?
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Frequently Asked Questions & Shelf Life
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-stone-200 rounded-2xl p-6 space-y-2 shadow-xs">
            <h3 className="text-base font-extrabold text-stone-900">{faq.q}</h3>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center space-y-3 shadow-xs">
        <h4 className="text-lg font-extrabold text-stone-900">Have More Questions?</h4>
        <p className="text-xs text-stone-600 font-medium">Reach out to our customer care team anytime.</p>
        <Link href="/contact" className="inline-block">
          <Button className="bg-red-900 text-white font-bold">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}
