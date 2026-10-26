import type { Metadata } from 'next';
import { RecipesPageClient } from './recipes-client';

export const metadata: Metadata = {
  title: 'Recipes & Stories from Tenali',
  description:
    'Heritage articles, serving guides, and behind-the-scenes stories from NISA\'s Tenali kitchen — how to pair, serve, and get the most out of authentic Andhra pickles and podis.',
  alternates: { canonical: '/recipes' },
};

export default function RecipesPage() {
  return <RecipesPageClient />;
}
