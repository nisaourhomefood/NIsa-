import type { Metadata } from 'next';
import { ContactPageClient } from './contact-client';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with NISA — Tenali, Guntur district, Andhra Pradesh. WhatsApp, phone, and email support for orders, delivery questions, and feedback.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
