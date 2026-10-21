import { NextResponse } from 'next/server';
import {
  createShopifyCart,
  addToShopifyCart,
  updateShopifyCartLines,
  removeFromShopifyCart,
  applyShopifyDiscountCode,
  getShopifyCart,
  isShopifyConfigured,
} from '@/lib/shopify/api';

// GET /api/shopify/cart?cartId=...
export async function GET(req: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: 'Shopify is not configured' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const cartId = searchParams.get('cartId');

  if (!cartId) {
    return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
  }

  const cart = await getShopifyCart(cartId);
  return NextResponse.json({ cart });
}

// POST /api/shopify/cart
// Actions:
// - { action: 'create', lines: [{ merchandiseId, quantity }] }
// - { action: 'add', cartId, lines: [{ merchandiseId, quantity }] }
export async function POST(req: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: 'Shopify is not configured' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { action, cartId, lines } = body;

    if (action === 'create') {
      const cart = await createShopifyCart(lines || []);
      return NextResponse.json({ cart });
    }

    if (action === 'add') {
      if (!cartId || !lines || lines.length === 0) {
        return NextResponse.json({ error: 'cartId and lines are required' }, { status: 400 });
      }
      const cart = await addToShopifyCart(cartId, lines);
      return NextResponse.json({ cart });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Cart operation failed' }, { status: 500 });
  }
}

// PUT /api/shopify/cart
// Actions:
// - { action: 'update', cartId, lines: [{ id, quantity }] }
// - { action: 'discount', cartId, discountCodes: ['CODE'] }
export async function PUT(req: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: 'Shopify is not configured' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { action, cartId, lines, discountCodes } = body;

    if (!cartId) {
      return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
    }

    if (action === 'update' && lines) {
      const cart = await updateShopifyCartLines(cartId, lines);
      return NextResponse.json({ cart });
    }

    if (action === 'discount' && discountCodes) {
      const cart = await applyShopifyDiscountCode(cartId, discountCodes);
      return NextResponse.json({ cart });
    }

    return NextResponse.json({ error: 'Invalid update action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

// DELETE /api/shopify/cart
// Body: { cartId, lineIds: ['...'] }
export async function DELETE(req: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: 'Shopify is not configured' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { cartId, lineIds } = body;

    if (!cartId || !lineIds || lineIds.length === 0) {
      return NextResponse.json({ error: 'cartId and lineIds are required' }, { status: 400 });
    }

    const cart = await removeFromShopifyCart(cartId, lineIds);
    return NextResponse.json({ cart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
