import type { Metadata } from 'next';
import { CombosPageClient } from './combos-client';

export const metadata: Metadata = {
  title: 'Combo Packs — Pickles, Podis & Sweets',
  description:
    'Mix-and-match combo packs of NISA\'s Andhra pickles, podis, and traditional sweets — a convenient way to try more of Saraswati\'s Tenali kitchen in one order.',
  alternates: { canonical: '/combos' },
};

export default function CombosPage() {
  return <CombosPageClient />;
}
