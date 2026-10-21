export interface ComboBundle {
  id: string;
  name: string;
  slug: string;
  badge: string;
  short_description: string;
  description: string;
  image: string;
  price: number;
  compare_at_price: number;
  active: boolean;
  included_items: {
    product_id: string;
    product_name: string;
    size_label: string;
    image: string;
  }[];
}

export const INITIAL_COMBOS: ComboBundle[] = [
  {
    id: 'combo-starter-box',
    name: 'NISA Andhra Starter Box',
    slug: 'nisa-andhra-starter-box',
    badge: 'POPULAR CHOICE',
    short_description: 'The essential trio of Andhra non-veg pickling: Boneless Chicken, Gongura Chicken & Sea Prawns.',
    description: 'Perfect for first-time buyers! Includes 250g jars of our top 3 bestsellers: Andhra Boneless Chicken Pickle, Gongura Chicken Pickle, and Andhra Prawns Pickle.',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop',
    price: 1049,
    compare_at_price: 1217,
    active: true,
    included_items: [
      {
        product_id: 'prod-boneless-chicken-pickle',
        product_name: 'Andhra Boneless Chicken Pickle',
        size_label: '250g Jar',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&auto=format&fit=crop',
      },
      {
        product_id: 'prod-gongura-chicken-pickle',
        product_name: 'Gongura Chicken Pickle',
        size_label: '250g Jar',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=400&auto=format&fit=crop',
      },
      {
        product_id: 'prod-andhra-prawns-pickle',
        product_name: 'Andhra Prawns Pickle',
        size_label: '250g Jar',
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'combo-non-veg-feast',
    name: 'NISA Non-Veg Feast Box',
    slug: 'nisa-non-veg-feast',
    badge: 'BEST VALUE',
    short_description: 'The ultimate 4-jar feast: Boneless Chicken, Gongura Chicken, Boneless Mutton & Prawns Pickle.',
    description: 'A grand feast for Andhra food lovers! 4 full 250g jars featuring chicken, mutton, prawns, and tangy sorrel gongura leaves.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop',
    price: 1499,
    compare_at_price: 1766,
    active: true,
    included_items: [
      {
        product_id: 'prod-boneless-chicken-pickle',
        product_name: 'Andhra Boneless Chicken Pickle',
        size_label: '250g Jar',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&auto=format&fit=crop',
      },
      {
        product_id: 'prod-gongura-chicken-pickle',
        product_name: 'Gongura Chicken Pickle',
        size_label: '250g Jar',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=400&auto=format&fit=crop',
      },
      {
        product_id: 'prod-boneless-mutton-pickle',
        product_name: 'Andhra Boneless Mutton Pickle',
        size_label: '250g Jar',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop',
      },
      {
        product_id: 'prod-andhra-prawns-pickle',
        product_name: 'Andhra Prawns Pickle',
        size_label: '250g Jar',
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'combo-family-box',
    name: 'NISA Family Jumbo Box',
    slug: 'nisa-family-box',
    badge: '500G JUMBO JARS',
    short_description: 'Generous 500g family jars of Boneless Chicken Pickle, Gongura Chicken & Chicken Podi.',
    description: 'Designed for family Sunday lunches! 500g Boneless Chicken Pickle + 500g Gongura Chicken + 250g Chicken Podi.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop',
    price: 1549,
    compare_at_price: 1767,
    active: true,
    included_items: [
      {
        product_id: 'prod-boneless-chicken-pickle',
        product_name: 'Andhra Boneless Chicken Pickle',
        size_label: '500g Jar',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&auto=format&fit=crop',
      },
      {
        product_id: 'prod-gongura-chicken-pickle',
        product_name: 'Gongura Chicken Pickle',
        size_label: '500g Jar',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=400&auto=format&fit=crop',
      },
      {
        product_id: 'prod-chicken-podi',
        product_name: 'Chicken Podi',
        size_label: '250g Pack',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
];
