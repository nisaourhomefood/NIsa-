-- ==============================================================================
-- NISA (నిస) - Mana Inti Vanta • Master Supabase Database Schema
-- Production Ready Schema for Products, Variants, Categories, Orders, Banners & Discounts
-- Author: Dorabeen Agency for Saraswati's Tenali Kitchen
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    product_type TEXT NOT NULL DEFAULT 'non-veg-pickle' CHECK (product_type IN ('non-veg-pickle', 'podi', 'sweet', 'veg-pickle')),
    short_description TEXT,
    description TEXT,
    images TEXT[] DEFAULT '{}',
    ingredients TEXT[] DEFAULT '{}',
    preparation_info TEXT,
    storage_info TEXT,
    shelf_life TEXT DEFAULT '6 Months from date of manufacture',
    net_quantity TEXT,
    featured_status BOOLEAN DEFAULT FALSE,
    bestseller_status BOOLEAN DEFAULT FALSE,
    active_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS public.product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    size_label TEXT NOT NULL, -- e.g. 250g, 500g, 1kg, 150g
    weight_g INT NOT NULL DEFAULT 250,
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2), -- MRP for strikethrough discount
    stock INT NOT NULL DEFAULT 50,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. HOMEPAGE BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    cta_text TEXT DEFAULT 'Shop Now',
    cta_link TEXT DEFAULT '/products',
    image_url TEXT NOT NULL,
    bg_color TEXT DEFAULT '#1C0A08',
    sort_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DISCOUNTS & COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount_amount NUMERIC(10, 2),
    active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    usage_limit INT,
    times_used INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    guest_email TEXT,
    guest_phone TEXT,
    status TEXT NOT NULL DEFAULT 'placed' CHECK (status IN ('placed', 'confirmed', 'preparing', 'packed', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT NOT NULL DEFAULT 'upi',
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    shipping_fee NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    discount_code TEXT,
    awb_code TEXT,
    courier_name TEXT,
    tracking_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    variant_id TEXT,
    product_name TEXT NOT NULL,
    variant_label TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 11. PUBLIC READ POLICIES (Storefront Browsing)
CREATE POLICY "Allow public read on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read on product_variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Allow public read on banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Allow public read on active discounts" ON public.discounts FOR SELECT USING (true);
CREATE POLICY "Allow public read on reviews" ON public.reviews FOR SELECT USING (true);

-- 12. PUBLIC ORDER INSERT POLICIES
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- 13. SEED INITIAL ESSENTIAL CATEGORIES & COUPONS
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES
  ('cat-non-veg-pickles', 'Non-Veg Pickles', 'non-veg-pickles', 'Authentic small-batch Andhra chicken, mutton & prawns pickles made in wood-pressed sesame oil.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop', 1),
  ('cat-traditional-podis', 'Authentic Podis', 'authentic-podis', 'Hand-roasted spicy podis prepared with authentic Tenali household recipes.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop', 2),
  ('cat-sweets-laddus', 'Traditional Sweets', 'traditional-sweets', 'Wholesome home-style sweets made with pure A2 ghee, nuts, seeds, and organic jaggery.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO public.discounts (code, discount_type, value, min_order_amount, active)
VALUES
  ('FIRSTORDER99', 'fixed', 99, 1499, true),
  ('MANAINTI10', 'percentage', 10, 999, true),
  ('NISA10', 'percentage', 10, 1500, true)
ON CONFLICT (code) DO NOTHING;

-- 💡 HOW TO CLEAR PRODUCTS AND START FRESH:
-- If you want to wipe all dummy products to add your real products with clean state, run:
-- TRUNCATE TABLE public.products, public.product_variants CASCADE;
