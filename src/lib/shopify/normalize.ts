import { ShopifyProduct, ShopifyProductVariant, ShopifyCollection } from './types';
import { ProductWithVariants, ProductVariant, Category } from '@/types/database.types';

// Helper to parse weight from title or number.
// The variant title (e.g. "250g", "1kg") is the merchant's deliberately-chosen size
// label and is authoritative — it's checked first. Shopify's native "Weight" field is
// meant for shipping calculations and is often left at a stale/default value per
// variant, so it's only used as a fallback when the title has no parseable size in it.
function parseWeightFromTitle(title: string, weight?: number | null, unit?: string | null): number {
  const clean = title.toLowerCase();
  const kgMatch = clean.match(/(\d+(\.\d+)?)\s*kg/);
  if (kgMatch) {
    return Math.round(parseFloat(kgMatch[1]) * 1000);
  }

  const gMatch = clean.match(/(\d+)\s*g/);
  if (gMatch) {
    return parseInt(gMatch[1], 10);
  }

  if (weight && weight > 0) {
    if (unit?.toLowerCase().includes('kilo') || unit?.toLowerCase() === 'kg') {
      return Math.round(weight * 1000);
    }
    return Math.round(weight);
  }

  return 250;
}

// Helper to determine clean size label
function getCleanSizeLabel(variantTitle: string, weightG: number): string {
  if (variantTitle && variantTitle !== 'Default Title' && variantTitle.trim() !== '') {
    return variantTitle.trim();
  }
  return weightG >= 1000 ? `${weightG / 1000}kg` : `${weightG}g`;
}

// Parse metafield by key
function getMetafieldValue(product: ShopifyProduct, key: string): string | null {
  if (!product.metafields) return null;
  const match = product.metafields.find((m) => m && m.key === key);
  return match ? match.value : null;
}

export function normalizeShopifyVariant(
  variant: ShopifyProductVariant,
  productId: string,
  index: number
): ProductVariant {
  const price = Math.round(parseFloat(variant.price.amount) || 0);
  const compareAtPrice = variant.compareAtPrice
    ? Math.round(parseFloat(variant.compareAtPrice.amount) || 0)
    : null;
  const weightG = parseWeightFromTitle(variant.title, variant.weight, variant.weightUnit);
  const sizeLabel = getCleanSizeLabel(variant.title, weightG);

  return {
    id: variant.id,
    product_id: productId,
    sku: variant.sku || `SKU-${productId.replace(/\D/g, '').slice(-4)}-${sizeLabel}`,
    size_label: sizeLabel,
    weight_g: weightG,
    price,
    compare_at_price: compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
    stock: variant.availableForSale ? (variant.quantityAvailable ?? 50) : 0,
    is_default: index === 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export function normalizeShopifyProduct(product: ShopifyProduct): ProductWithVariants {
  const images = (product.images?.nodes || []).map((img) => img.url);
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop');
  }

  const tags = (product.tags || []).map((t) => t.toLowerCase());
  const isBestseller = tags.includes('bestseller') || tags.includes('best-seller') || tags.includes('trending');
  const isFeatured = tags.includes('featured') || isBestseller;

  // Determine product_type
  let productType: 'non-veg-pickle' | 'podi' | 'sweet' = 'non-veg-pickle';
  const typeLower = (product.productType || '').toLowerCase();
  if (tags.includes('podi') || tags.includes('podis') || tags.includes('powder') || typeLower.includes('podi')) {
    productType = 'podi';
  } else if (tags.includes('sweet') || tags.includes('sweets') || tags.includes('mithai') || typeLower.includes('sweet')) {
    productType = 'sweet';
  }

  // Parse Metafields — set per-product in Shopify Admin (Product > Metafields, namespace
  // "custom"). No generic fallback text here: a product with an empty metafield shows that
  // section as "not added yet" in the UI rather than the same copy as every other product.
  const rawIngredients = getMetafieldValue(product, 'ingredients');
  let ingredients: string[] = [];
  if (rawIngredients) {
    try {
      const parsed = JSON.parse(rawIngredients);
      if (Array.isArray(parsed)) ingredients = parsed;
    } catch {
      ingredients = rawIngredients.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  const storageInfo = getMetafieldValue(product, 'storage_info');
  const preparationInfo = getMetafieldValue(product, 'preparation_info');
  const shelfLife = getMetafieldValue(product, 'shelf_life') || '';

  // Build variants
  const variantsNodes = product.variants?.nodes || [];
  const variants: ProductVariant[] = variantsNodes.length > 0
    ? variantsNodes.map((v, i) => normalizeShopifyVariant(v, product.id, i)).sort((a, b) => a.weight_g - b.weight_g)
    : [
        {
          id: `${product.id}-default`,
          product_id: product.id,
          sku: `SKU-${product.handle}-250g`,
          size_label: '250g',
          weight_g: 250,
          price: Math.round(parseFloat(product.priceRange?.minVariantPrice?.amount || '349')),
          compare_at_price: Math.round(parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || '399')),
          stock: product.availableForSale ? 50 : 0,
          is_default: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

  const defaultVariant = variants[0];

  return {
    id: product.id,
    name: product.title,
    slug: product.handle,
    short_description: product.description?.slice(0, 140) || product.title,
    description: product.descriptionHtml || product.description || '',
    category_id: null,
    product_type: productType,
    images,
    ingredients,
    preparation_info: preparationInfo,
    storage_info: storageInfo,
    shelf_life: shelfLife,
    net_quantity: defaultVariant.size_label,
    featured_status: isFeatured,
    bestseller_status: isBestseller,
    active_status: product.availableForSale,
    meta_title: `${product.title} | NISA Authentic Andhra Foods`,
    meta_description: product.description?.slice(0, 160) || product.title,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants,
    reviews_count: 0,
    average_rating: undefined,
  };
}

export function normalizeShopifyCollection(collection: ShopifyCollection): Category {
  return {
    id: collection.id,
    name: collection.title,
    slug: collection.handle,
    description: collection.description || null,
    image_url: collection.image?.url || null,
    sort_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
