import { shopifyFetch, isShopifyConfigured } from './client';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_DISCOUNT_CODES_UPDATE_MUTATION,
  GET_CART_QUERY,
  GET_VARIANT_PRICES_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
  GET_HERO_BANNERS_QUERY,
} from './queries';
import {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
  ShopifyCartLineInput,
  ShopifyCartLineUpdateInput,
} from './types';
import { normalizeShopifyProduct, normalizeShopifyCollection } from './normalize';
import { ProductWithVariants, Category } from '@/types/database.types';

export { isShopifyConfigured };

// Fetch all products from Shopify
export async function getShopifyProducts(options?: {
  first?: number;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<ProductWithVariants[]> {
  if (!isShopifyConfigured()) return [];

  const { data, errors } = await shopifyFetch<{
    products: { nodes: ShopifyProduct[] };
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: {
      first: options?.first || 50,
      query: options?.query,
      sortKey: options?.sortKey || 'BEST_SELLING',
      reverse: options?.reverse || false,
    },
    revalidate: 60, // ISR cache for 60s
    tags: ['shopify_products'],
  });

  if (errors) {
    console.warn('[Shopify] getShopifyProducts returned partial errors (using any data received):', errors);
  }
  if (!data?.products?.nodes) {
    return [];
  }

  return data.products.nodes.map(normalizeShopifyProduct);
}

// Fetch single product by handle/slug
export async function getShopifyProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  if (!isShopifyConfigured()) return null;

  const { data, errors } = await shopifyFetch<{
    product: ShopifyProduct | null;
  }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle: slug },
    revalidate: 60,
    tags: [`shopify_product_${slug}`],
  });

  if (errors) {
    console.warn('[Shopify] getShopifyProductBySlug returned partial errors (using any data received):', errors);
  }
  if (!data?.product) {
    return null;
  }

  return normalizeShopifyProduct(data.product);
}

// Fetch Shopify's own recommended products for a given product ("customers also bought")
export async function getShopifyProductRecommendations(productId: string): Promise<ProductWithVariants[]> {
  if (!isShopifyConfigured()) return [];

  const { data, errors } = await shopifyFetch<{
    productRecommendations: ShopifyProduct[] | null;
  }>({
    query: GET_PRODUCT_RECOMMENDATIONS_QUERY,
    variables: { productId },
    revalidate: 60,
    tags: ['shopify_products'],
  });

  if (errors) {
    console.warn('[Shopify] getShopifyProductRecommendations returned partial errors (using any data received):', errors);
  }
  if (!data?.productRecommendations) {
    return [];
  }

  return data.productRecommendations.map(normalizeShopifyProduct);
}

// Fetch collections
export async function getShopifyCollections(): Promise<Category[]> {
  if (!isShopifyConfigured()) return [];

  const { data, errors } = await shopifyFetch<{
    collections: { nodes: ShopifyCollection[] };
  }>({
    query: GET_COLLECTIONS_QUERY,
    variables: { first: 20 },
    revalidate: 300,
    tags: ['shopify_collections'],
  });

  if (errors) {
    console.warn('[Shopify] getShopifyCollections returned partial errors (using any data received):', errors);
  }
  if (!data?.collections?.nodes) {
    return [];
  }

  return data.collections.nodes.map(normalizeShopifyCollection);
}

// Fetch products for a collection
export async function getShopifyCollectionProducts(handle: string): Promise<ProductWithVariants[]> {
  if (!isShopifyConfigured()) return [];

  const { data, errors } = await shopifyFetch<{
    collection: { products: { nodes: ShopifyProduct[] } } | null;
  }>({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first: 50 },
    revalidate: 60,
  });

  if (errors) {
    console.warn('[Shopify] getShopifyCollectionProducts returned partial errors (using any data received):', errors);
  }
  if (!data?.collection?.products?.nodes) {
    return [];
  }

  return data.collection.products.nodes.map(normalizeShopifyProduct);
}

// ─── SHOPIFY CART API ────────────────────────────────────────────────────────

// Create a new cart with items
export async function createShopifyCart(
  lines: ShopifyCartLineInput[] = []
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured()) return null;

  const { data, errors } = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart | null; userErrors: any[] };
  }>({
    query: CART_CREATE_MUTATION,
    variables: { lines },
    cache: 'no-store',
  });

  if (errors || !data?.cartCreate?.cart) {
    console.error('[Shopify Cart] Failed to create cart:', errors || data?.cartCreate?.userErrors);
    return null;
  }

  return data.cartCreate.cart;
}

// Add items to existing cart
export async function addToShopifyCart(
  cartId: string,
  lines: ShopifyCartLineInput[]
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured() || !cartId) return null;

  const { data, errors } = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart | null; userErrors: any[] };
  }>({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (errors || !data?.cartLinesAdd?.cart) {
    console.error('[Shopify Cart] Failed to add lines:', errors || data?.cartLinesAdd?.userErrors);
    return null;
  }

  return data.cartLinesAdd.cart;
}

// Update quantity of lines in cart
export async function updateShopifyCartLines(
  cartId: string,
  lines: ShopifyCartLineUpdateInput[]
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured() || !cartId) return null;

  const { data, errors } = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart | null; userErrors: any[] };
  }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: { cartId, lines },
    cache: 'no-store',
  });

  if (errors || !data?.cartLinesUpdate?.cart) {
    console.error('[Shopify Cart] Failed to update lines:', errors || data?.cartLinesUpdate?.userErrors);
    return null;
  }

  return data.cartLinesUpdate.cart;
}

// Remove lines from cart
export async function removeFromShopifyCart(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured() || !cartId) return null;

  const { data, errors } = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart | null; userErrors: any[] };
  }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: { cartId, lineIds },
    cache: 'no-store',
  });

  if (errors || !data?.cartLinesRemove?.cart) {
    console.error('[Shopify Cart] Failed to remove lines:', errors || data?.cartLinesRemove?.userErrors);
    return null;
  }

  return data.cartLinesRemove.cart;
}

// Apply discount code to Shopify Cart
export async function applyShopifyDiscountCode(
  cartId: string,
  discountCodes: string[]
): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured() || !cartId) return null;

  const { data, errors } = await shopifyFetch<{
    cartDiscountCodesUpdate: { cart: ShopifyCart | null; userErrors: any[] };
  }>({
    query: CART_DISCOUNT_CODES_UPDATE_MUTATION,
    variables: { cartId, discountCodes },
    cache: 'no-store',
  });

  if (errors || !data?.cartDiscountCodesUpdate?.cart) {
    return null;
  }

  return data.cartDiscountCodesUpdate.cart;
}

// Fetch Cart by ID
export async function getShopifyCart(cartId: string): Promise<ShopifyCart | null> {
  if (!isShopifyConfigured() || !cartId) return null;

  const { data, errors } = await shopifyFetch<{
    cart: ShopifyCart | null;
  }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: 'no-store',
  });

  if (errors || !data?.cart) {
    return null;
  }

  return data.cart;
}

// Fetch real variant prices by ID — used server-side to validate order totals against
// what Shopify actually charges, instead of trusting a client-supplied price.
export async function getShopifyVariantPrices(variantIds: string[]): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  if (!isShopifyConfigured() || variantIds.length === 0) return prices;

  const { data, errors } = await shopifyFetch<{
    nodes: ({ id: string; price: { amount: string } } | null)[];
  }>({
    query: GET_VARIANT_PRICES_QUERY,
    variables: { ids: variantIds },
    cache: 'no-store',
  });

  if (errors) {
    console.warn('[Shopify] getShopifyVariantPrices returned partial errors:', errors);
  }

  for (const node of data?.nodes || []) {
    if (node?.id && node.price?.amount) {
      prices.set(node.id, parseFloat(node.price.amount));
    }
  }

  return prices;
}

export interface HeroBanner {
  id: string;
  title: string; // used only as the image's alt text, never rendered
  cta_text: string;
  cta_link: string;
  image_url: string;
  image_url_mobile: string;
}

interface MetaobjectField {
  key: string;
  value: string | null;
  reference: { image?: { url: string; altText: string | null } } | null;
}

// Homepage hero banners, managed entirely in Shopify Admin as "hero_banner"
// Metaobject entries — no external database, same place products live.
export async function getShopifyBanners(): Promise<HeroBanner[]> {
  if (!isShopifyConfigured()) return [];

  const { data, errors } = await shopifyFetch<{
    metaobjects: { nodes: { id: string; fields: MetaobjectField[] }[] };
  }>({
    query: GET_HERO_BANNERS_QUERY,
    revalidate: 60,
    tags: ['shopify_banners'],
  });

  if (errors) {
    console.warn('[Shopify] getShopifyBanners returned partial errors:', errors);
  }

  return (data?.metaobjects?.nodes || []).map((node) => {
    const get = (key: string) => node.fields.find((f) => f.key === key);
    const image_url = get('image')?.reference?.image?.url || '';
    return {
      id: node.id,
      title: get('title')?.value || 'NISA — Authentic Andhra Home Food',
      cta_text: get('cta_text')?.value || 'Shop Now',
      cta_link: get('cta_link')?.value || '/products',
      image_url,
      // Falls back to the desktop image if no mobile-specific one was uploaded.
      image_url_mobile: get('image_mobile')?.reference?.image?.url || image_url,
    };
  }).filter((b) => b.image_url);
}
