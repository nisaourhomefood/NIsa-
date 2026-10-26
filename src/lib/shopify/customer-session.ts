// Server-only cookie session for the signed-in Shopify customer (Customer Account API tokens).
// Cookies are httpOnly so the access/refresh tokens are never readable from client JS.

import { cookies } from 'next/headers';
import { CustomerTokens } from './customer-account';

const AT_COOKIE = 'nisa_customer_at';
const RT_COOKIE = 'nisa_customer_rt';
const EXP_COOKIE = 'nisa_customer_exp';
const ID_TOKEN_COOKIE = 'nisa_customer_idt';

export interface CustomerSession {
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
  expiresAt: number;
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const store = await cookies();
  const accessToken = store.get(AT_COOKIE)?.value;
  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: store.get(RT_COOKIE)?.value || null,
    idToken: store.get(ID_TOKEN_COOKIE)?.value || null,
    expiresAt: Number(store.get(EXP_COOKIE)?.value || 0),
  };
}

// 60s safety buffer so we refresh slightly before Shopify would reject the token.
export function isSessionExpired(session: CustomerSession): boolean {
  return Date.now() >= session.expiresAt - 60_000;
}

export async function setCustomerSessionCookies(tokens: CustomerTokens): Promise<void> {
  const store = await cookies();
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  const common = { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/' };

  store.set(AT_COOKIE, tokens.access_token, { ...common, maxAge: tokens.expires_in });
  store.set(EXP_COOKIE, String(expiresAt), { ...common, maxAge: tokens.expires_in });

  // Refresh tokens outlive access tokens — keep for 30 days or until explicitly cleared.
  if (tokens.refresh_token) {
    store.set(RT_COOKIE, tokens.refresh_token, { ...common, maxAge: 60 * 60 * 24 * 30 });
  }
  if (tokens.id_token) {
    store.set(ID_TOKEN_COOKIE, tokens.id_token, { ...common, maxAge: 60 * 60 * 24 * 30 });
  }
}

export async function clearCustomerSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete(AT_COOKIE);
  store.delete(RT_COOKIE);
  store.delete(EXP_COOKIE);
  store.delete(ID_TOKEN_COOKIE);
}

// Short-lived cookies for the PKCE code_verifier + CSRF state, alive only during the
// redirect-to-Shopify-and-back round trip.
const OAUTH_STATE_COOKIE = 'nisa_oauth_state';
const OAUTH_VERIFIER_COOKIE = 'nisa_oauth_verifier';

export async function setOAuthHandshakeCookies(state: string, codeVerifier: string): Promise<void> {
  const store = await cookies();
  const common = { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/', maxAge: 60 * 10 };
  store.set(OAUTH_STATE_COOKIE, state, common);
  store.set(OAUTH_VERIFIER_COOKIE, codeVerifier, common);
}

export async function consumeOAuthHandshakeCookies(): Promise<{ state: string | null; codeVerifier: string | null }> {
  const store = await cookies();
  const state = store.get(OAUTH_STATE_COOKIE)?.value || null;
  const codeVerifier = store.get(OAUTH_VERIFIER_COOKIE)?.value || null;
  store.delete(OAUTH_STATE_COOKIE);
  store.delete(OAUTH_VERIFIER_COOKIE);
  return { state, codeVerifier };
}
