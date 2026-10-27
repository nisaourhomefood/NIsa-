import { NextResponse } from 'next/server';
import {
  buildAuthorizeUrl,
  generatePkce,
  generateState,
  isCustomerAccountConfigured,
} from '@/lib/shopify/customer-account';
import { setOAuthHandshakeCookies } from '@/lib/shopify/customer-session';

// GET /api/auth/login — starts the Shopify Customer Account OAuth (PKCE) flow.
export async function GET() {
  if (!isCustomerAccountConfigured()) {
    return NextResponse.json(
      { error: 'Customer accounts are not configured on this server yet.' },
      { status: 500 }
    );
  }

  const { codeVerifier, codeChallenge } = generatePkce();
  const state = generateState();

  await setOAuthHandshakeCookies(state, codeVerifier);

  const authorizeUrl = buildAuthorizeUrl({ state, codeChallenge });
  return NextResponse.redirect(authorizeUrl);
}
