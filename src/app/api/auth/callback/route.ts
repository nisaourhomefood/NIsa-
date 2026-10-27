import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/shopify/customer-account';
import { consumeOAuthHandshakeCookies, setCustomerSessionCookies } from '@/lib/shopify/customer-session';

// GET /api/auth/callback — Shopify redirects here after the customer logs in.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const oauthError = req.nextUrl.searchParams.get('error');

  const { state: expectedState, codeVerifier } = await consumeOAuthHandshakeCookies();

  if (oauthError || !code || !state || !codeVerifier || state !== expectedState) {
    return NextResponse.redirect(new URL('/account?error=login_failed', req.url));
  }

  const tokens = await exchangeCodeForTokens(code, codeVerifier);
  if (!tokens) {
    return NextResponse.redirect(new URL('/account?error=login_failed', req.url));
  }

  await setCustomerSessionCookies(tokens);
  return NextResponse.redirect(new URL('/account', req.url));
}
