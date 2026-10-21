// Shopify Storefront GraphQL Client

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const API_VERSION = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2025-01';

export function isShopifyConfigured(): boolean {
  return Boolean(
    DOMAIN &&
    ACCESS_TOKEN &&
    !DOMAIN.includes('your-shop-name') &&
    ACCESS_TOKEN.length > 5
  );
}

export function getShopifyEndpoint(): string {
  // Normalize domain (strip https:// or trailing slashes)
  const cleanDomain = DOMAIN.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return `https://${cleanDomain}/api/${API_VERSION}/graphql.json`;
}

interface ShopifyFetchParams {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = 'default',
  revalidate,
  tags = [],
}: ShopifyFetchParams): Promise<{ data: T | null; errors?: any[] }> {
  if (!isShopifyConfigured()) {
    return { data: null, errors: [{ message: 'Shopify Storefront API credentials are not configured.' }] };
  }

  const endpoint = getShopifyEndpoint();

  try {
    const nextOptions: Record<string, any> = {};
    if (typeof revalidate === 'number' || revalidate === false) {
      nextOptions.revalidate = revalidate;
    }
    if (tags.length > 0) {
      nextOptions.tags = tags;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      cache,
      ...(Object.keys(nextOptions).length > 0 ? { next: nextOptions } : {}),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Shopify Client] HTTP error ${response.status}:`, errorText);
      return { data: null, errors: [{ message: `HTTP ${response.status}: ${errorText}` }] };
    }

    const json = await response.json();

    if (json.errors) {
      console.error('[Shopify Client] GraphQL errors:', json.errors);
      return { data: json.data || null, errors: json.errors };
    }

    return { data: json.data, errors: undefined };
  } catch (error: any) {
    console.error('[Shopify Client] Fetch error:', error);
    return { data: null, errors: [{ message: error.message || 'Network request failed' }] };
  }
}
