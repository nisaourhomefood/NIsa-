import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET /api/admin/products — fetch all products with variants
export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_variants(*), categories(name,slug)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data || []);
}

// POST /api/admin/products — create a new product
export async function POST(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();

  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      id: body.id || `prod-${Date.now()}`,
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      short_description: body.short_description || '',
      description: body.description || '',
      category_id: body.category_id || null,
      product_type: body.product_type || 'non-veg-pickle',
      images: body.images || [],
      ingredients: body.ingredients || [],
      preparation_info: body.preparation_info || null,
      storage_info: body.storage_info || null,
      shelf_life: body.shelf_life || '6 Months from date of manufacture',
      net_quantity: body.net_quantity || '250g / 500g / 1kg',
      featured_status: body.featured_status || false,
      bestseller_status: body.bestseller_status || false,
      active_status: true,
    })
    .select()
    .single();

  if (productError) return NextResponse.json({ error: productError.message }, { status: 500 });

  // Create default variant if provided
  if (body.default_price || body.variants) {
    if (Array.isArray(body.variants) && body.variants.length > 0) {
      for (const v of body.variants) {
        await supabase.from('product_variants').insert({
          id: v.id || `var-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          product_id: product.id,
          sku: v.sku || `NISA-${product.id.slice(0, 6).toUpperCase()}-${v.size_label}`,
          size_label: v.size_label || '250g',
          weight_g: v.weight_g || 250,
          price: v.price || 349,
          compare_at_price: v.compare_at_price || null,
          stock: v.stock || 30,
          is_default: v.is_default ?? true,
        });
      }
    } else if (body.default_price) {
      await supabase.from('product_variants').insert({
        id: `var-${Date.now()}-1`,
        product_id: product.id,
        sku: `NISA-${product.id.slice(0, 6).toUpperCase()}-250G`,
        size_label: '250g',
        weight_g: 250,
        price: body.default_price,
        compare_at_price: body.default_price + 50,
        stock: 30,
        is_default: true,
      });
    }
  }

  return NextResponse.json(product, { status: 201 });
}

// DELETE /api/admin/products — delete all or single product
export async function DELETE(req: Request) {
  const supabase = createAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id === 'all') {
    const { error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, message: 'All products deleted' });
  }

  if (id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Missing product id' }, { status: 400 });
}
