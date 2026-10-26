// Shopify Customer Account API — OAuth (Authorization Code + PKCE) and GraphQL client.
// This is a separate system from the Storefront API: it lets a headless frontend build its
// own fully-branded login/account UI instead of redirecting to Shopify's hosted account pages.
// Endpoints below are not guessed — they must be copied from Shopify Admin →
// Settings → Customer accounts → the Customer Account API client setup screen.

import crypto from 'crypto';

const CLIENT_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID || '';
const AUTHORIZE_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZE_URL || '';
const TOKEN_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_URL || '';
const GRAPHQL_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_URL || '';
const LOGOUT_URL = process.env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_URL || '';
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/+$/, '');

export function isCustomerAccountConfigured(): boolean {
  return Boolean(CLIENT_ID && AUTHORIZE_URL && TOKEN_URL && GRAPHQL_URL && BASE_URL);
}

export function getRedirectUri(): string {
  return `${BASE_URL}/api/auth/callback`;
}

export function getLogoutUrl(idToken?: string): string | null {
  if (!LOGOUT_URL) return null;
  const url = new URL(LOGOUT_URL);
  if (idToken) url.searchParams.set('id_token_hint', idToken);
  url.searchParams.set('post_logout_redirect_uri', `${BASE_URL}/account`);
  return url.toString();
}

function base64url(input: Buffer): string {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function generatePkce(): { codeVerifier: string; codeChallenge: string } {
  const codeVerifier = base64url(crypto.randomBytes(32));
  const codeChallenge = base64url(crypto.createHash('sha256').update(codeVerifier).digest());
  return { codeVerifier, codeChallenge };
}

export function generateState(): string {
  return base64url(crypto.randomBytes(16));
}

export function buildAuthorizeUrl(params: { state: string; codeChallenge: string }): string {
  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set('client_id', CLIENT_ID);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('redirect_uri', getRedirectUri());
  url.searchParams.set('scope', 'openid email customer-account-api:full');
  url.searchParams.set('state', params.state);
  url.searchParams.set('code_challenge', params.codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  return url.toString();
}

export interface CustomerTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  id_token?: string;
}

export async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<CustomerTokens | null> {
  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        redirect_uri: getRedirectUri(),
        code,
        code_verifier: codeVerifier,
      }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[Customer Account] Token exchange failed:', res.status, await res.text());
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('[Customer Account] Token exchange error:', err);
    return null;
  }
}

export async function refreshCustomerTokens(refreshToken: string): Promise<CustomerTokens | null> {
  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        refresh_token: refreshToken,
      }),
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[Customer Account] Token refresh failed:', res.status, await res.text());
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('[Customer Account] Token refresh error:', err);
    return null;
  }
}

export async function customerAccountFetch<T>(
  accessToken: string,
  query: string,
  variables: Record<string, unknown> = {}
): Promise<{ data: T | null; errors?: any[] }> {
  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Shopify's Customer Account API expects the raw access token here, not "Bearer <token>".
        Authorization: accessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });

    const json = await res.json();

    if (!res.ok || json.errors) {
      console.error('[Customer Account API] GraphQL errors:', res.status, json.errors || json);
      return { data: json.data || null, errors: json.errors || [{ message: `HTTP ${res.status}` }] };
    }

    return { data: json.data };
  } catch (err: any) {
    console.error('[Customer Account API] Fetch error:', err);
    return { data: null, errors: [{ message: err.message || 'Network request failed' }] };
  }
}
