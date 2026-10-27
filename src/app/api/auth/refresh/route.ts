import { NextRequest, NextResponse } from 'next/server';
import { refreshCustomerTokens } from '@/lib/shopify/customer-account';
import { clearCustomerSessionCookies, getCustomerSession, setCustomerSessionCookies } from '@/lib/shopify/customer-session';

// GET /api/auth/refresh?next=/account — silently refreshes the customer session using the
// stored refresh token, then sends the browser back to `next`. Cookie writes must happen in
// a Route Handler (not a Server Component), which is why this is a separate redirect hop.
export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get('next') || '/account';
  const safeNext = next.startsWith('/') ? next : '/account';

  const session = await getCustomerSession();
  if (!session?.refreshToken) {
    await clearCustomerSessionCookies();
    return NextResponse.redirect(new URL('/account', req.url));
  }

  const tokens = await refreshCustomerTokens(session.refreshToken);
  if (!tokens) {
    await clearCustomerSessionCookies();
    return NextResponse.redirect(new URL('/account', req.url));
  }

  await setCustomerSessionCookies(tokens);
  return NextResponse.redirect(new URL(safeNext, req.url));
}
