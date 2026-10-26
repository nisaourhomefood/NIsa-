import { NextRequest, NextResponse } from 'next/server';
import { clearCustomerSessionCookies } from '@/lib/shopify/customer-session';

// GET /api/auth/logout — clears the local session cookies and returns to the account page.
export async function GET(req: NextRequest) {
  await clearCustomerSessionCookies();
  return NextResponse.redirect(new URL('/account', req.url));
}
