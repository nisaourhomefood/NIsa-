-- ============================================================
-- NISA (నిస) – Mana Inti Vanta
-- Supabase Database Schema + Seed Data
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 2. PRODUCTS
-- ============================================================
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  category_id uuid references categories(id) on delete set null,
  product_type text not null check (product_type in ('non-veg-pickle','podi','sweet')),
  images text[] default '{}',
  ingredients text[] default '{}',
  preparation_info text,
  storage_info text,
  shelf_life text not null default '',
  net_quantity text not null default '',
  featured_status boolean default false,
  bestseller_status boolean default false,
  active_status boolean default true,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 3. PRODUCT VARIANTS
-- ============================================================
create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  size_label text not null,
  weight_g int not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock int not null default 0,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 4. CUSTOMERS
-- ============================================================
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  total_orders int default 0,
  lifetime_value numeric(12,2) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 5. ORDERS
-- ============================================================
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text not null unique,
  customer_id uuid references customers(id) on delete set null,
  guest_email text,
  guest_phone text,
  status text not null default 'placed' check (status in ('placed','confirmed','preparing','packed','shipped','delivered','cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  payment_method text not null default 'cod' check (payment_method in ('cod','cashfree','razorpay','upi','online_placeholder')),
  subtotal numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  shipping_address jsonb not null default '{}',
  discount_code text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 6. ORDER ITEMS
-- ============================================================
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  variant_label text not null,
  price numeric(10,2) not null,
  quantity int not null default 1,
  total_price numeric(12,2) not null,
  image_url text,
  created_at timestamptz default now()
);

-- ============================================================
-- 7. REVIEWS
-- ============================================================
create table if not exists reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  title text,
  comment text not null,
  is_verified_purchase boolean default false,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- 8. DISCOUNTS
-- ============================================================
create table if not exists discounts (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage','flat')),
  value numeric(10,2) not null,
  min_order_amount numeric(10,2) not null default 0,
  active boolean default true,
  valid_from timestamptz default now(),
  valid_to timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- 9. COMBOS
-- ============================================================
create table if not exists combos (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  badge text,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  image_url text,
  product_ids uuid[] default '{}',
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 10. CMS HOMEPAGE
-- ============================================================
create table if not exists cms_homepage (
  id uuid primary key default uuid_generate_v4(),
  section_key text not null unique,
  title text not null,
  subtitle text,
  content_json jsonb default '{}',
  sort_order int default 0,
  is_active boolean default true,
  updated_at timestamptz default now()
);

-- ============================================================
-- 11. ARTICLES (Recipes & Stories CMS)
-- ============================================================
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  category text not null default 'Serving Suggestions',
  excerpt text,
  content text,
  cover_image text,
  seo_title text,
  seo_description text,
  status text not null default 'published' check (status in ('draft','published')),
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table reviews enable row level security;
alter table discounts enable row level security;
alter table combos enable row level security;
alter table cms_homepage enable row level security;
alter table articles enable row level security;

-- Public read access for storefront
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read active products" on products for select using (active_status = true);
create policy "Public can read product variants" on product_variants for select using (true);
create policy "Public can read approved reviews" on reviews for select using (is_approved = true);
create policy "Public can read active discounts" on discounts for select using (active = true);
create policy "Public can read active combos" on combos for select using (active = true);
create policy "Public can read cms homepage" on cms_homepage for select using (is_active = true);
create policy "Public can read published articles" on articles for select using (status = 'published');

-- Anyone can insert orders (for checkout)
create policy "Anyone can create orders" on orders for insert with check (true);
create policy "Anyone can create order items" on order_items for insert with check (true);
create policy "Anyone can create customers" on customers for insert with check (true);
create policy "Anyone can submit reviews" on reviews for insert with check (true);

-- ============================================================
-- SEED DATA: CATEGORIES
-- ============================================================
insert into categories (id, name, slug, description, image_url, sort_order) values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Non-Veg Pickles', 'non-veg-pickles', 'Small-batch authentic Andhra style chicken, mutton and prawns pickles made in wood-pressed sesame oil.', 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop', 1),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Authentic Podis', 'authentic-podis', 'Hand-roasted spicy podis prepared with authentic Tenali household recipes.', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop', 2),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Traditional Sweets', 'traditional-sweets', 'Wholesome home-style sweets made with pure A2 ghee, nuts, seeds, and organic jaggery.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop', 3)
on conflict (slug) do nothing;

-- ============================================================
-- SEED DATA: PRODUCTS
-- ============================================================
insert into products (id, name, slug, short_description, description, category_id, product_type, images, ingredients, preparation_info, storage_info, shelf_life, net_quantity, featured_status, bestseller_status, active_status) values
('b1000001-0001-0001-0001-000000000001','Andhra Boneless Chicken Pickle','andhra-boneless-chicken-pickle','Tender boneless chicken pieces marinated in fiery Guntur red chilies, garlic & wood-pressed sesame oil.','Our crown jewel from Tenali! Hand-cut fresh tender boneless chicken pieces are fried in pure wood-pressed sesame oil, blended with hand-ground Guntur red chili powder, crushed garlic cloves, freshly squeezed lemon juice, and our heritage Andhra spice blend. Zero artificial preservatives or added color.','a1b2c3d4-0001-0001-0001-000000000001','non-veg-pickle',ARRAY['https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=800&auto=format&fit=crop'],ARRAY['Fresh Farm Chicken (Boneless)','Wood-Pressed Sesame Oil (Nuvvula Nune)','Guntur Red Chili Powder','Fresh Garlic & Ginger','Lemon Juice','Rock Salt','Fenugreek, Mustard & Cumin Powder'],'Cooked in small batches of 5kg each in traditional brass vessels (Uruli) to retain authentic home flavor.','Store in a cool, dry pantry away from direct sunlight. Always use a clean, dry spoon.','6 Months from date of manufacture','250g / 500g / 1kg',true,true,true),
('b1000002-0002-0002-0002-000000000002','Andhra Chicken Pickle With Bone','andhra-chicken-pickle-with-bone','Classic bone-in country style chicken pickle steeped in deep red chili masala and roasted spices.','For lovers of rich bone marrow flavor! Tender bone-in chicken cuts absorb the deep flavors of garlic, coriander, roasted cumin, and cold-pressed oil.','a1b2c3d4-0001-0001-0001-000000000001','non-veg-pickle',ARRAY['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop'],ARRAY['Fresh Bone-in Farm Chicken','Wood-Pressed Sesame Oil','Guntur Red Chili Powder','Garlic, Ginger, Lemon Juice','Rock Salt & Whole Spices'],'Slow-cooked with bone marrow essence steeping into spiced oil.','Store in airtight jar. Keep spoon dry.','6 Months from date of manufacture','250g / 500g / 1kg',false,true,true),
('b1000003-0003-0003-0003-000000000003','Gongura Chicken Pickle','gongura-chicken-pickle','Signature Andhra delicacy blending fiery chicken pieces with tangy sorrel leaves (Gongura).','Gongura (Sorrel leaves) is the pride of Andhra cuisine! Fresh organic red-stem Gongura leaves are sauteed until velvety, then folded into spiced boneless chicken.','a1b2c3d4-0001-0001-0001-000000000001','non-veg-pickle',ARRAY['https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop'],ARRAY['Fresh Sorrel Leaves (Red Stem Gongura)','Boneless Chicken Pieces','Wood-Pressed Sesame Oil','Red Chilies, Garlic, Mustard Seeds','Turmeric & Salt'],'Prepared using traditional Gongura reduction technique perfected by Tenali grandmothers.','Refrigeration recommended after opening.','6 Months from date of manufacture','250g / 500g / 1kg',true,true,true),
('b1000004-0004-0004-0004-000000000004','Andhra Boneless Mutton Pickle','andhra-boneless-mutton-pickle','Rich, melt-in-the-mouth boneless goat mutton slow-cooked with aromatic spices and sesame oil.','An indulgent feast for meat connoisseurs! Lean, tender boneless goat mutton pressure roasted with ginger-garlic paste and whole roasted spices.','a1b2c3d4-0001-0001-0001-000000000001','non-veg-pickle',ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'],ARRAY['Fresh Tender Goat Mutton (Boneless)','Cold-Pressed Sesame Oil','Special Guntur Chili Powder','Ginger, Garlic, Clove, Cinnamon','Rock Salt & Lemon'],'Slow pressure-roasted mutton bits cured in roasted whole spice oil.','Keep jar oil-sealed. Do not allow moisture inside.','6 Months from date of manufacture','250g / 500g / 1kg',true,false,true),
('b1000005-0005-0005-0005-000000000005','Andhra Mutton Pickle With Bone','andhra-mutton-pickle-with-bone','Authentic heritage bone-in mutton pickle packed with rich marrow flavor and roasted spices.','Traditional Coastal Andhra style bone-in mutton pickle. Succulent chops and bone pieces release their rich savory juices.','a1b2c3d4-0001-0001-0001-000000000001','non-veg-pickle',ARRAY['https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop'],ARRAY['Tender Goat Mutton With Bone','Cold-Pressed Sesame Oil','Hand-ground Chilies & Garam Masala','Lemon Juice & Rock Salt'],'Traditional slow pot-roasting method with bone marrow infusion.','Keep in cool dry pantry.','6 Months from date of manufacture','250g / 500g / 1kg',false,false,true),
('b1000006-0006-0006-0006-000000000006','Andhra Prawns Pickle','andhra-prawns-pickle','Golden fried sea prawns tossed in sharp mustard-chili masala and fragrant sesame oil.','Fresh sea prawns sourced daily from coastal Andhra markets, cleaned, deveined, and fried to lock in firm bite.','a1b2c3d4-0001-0001-0001-000000000001','non-veg-pickle',ARRAY['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=800&auto=format&fit=crop'],ARRAY['Fresh Sea Prawns (Deveined & Fried)','Wood-Pressed Sesame Oil','Mustard Powder & Guntur Chili Powder','Garlic Flakes & Ginger','Lemon Juice & Salt'],'Flash-fried in small batches to preserve sea prawn crunch and juice.','Refrigerate after opening to preserve crisp texture.','6 Months from date of manufacture','250g / 500g / 1kg',true,true,true),
('b1000007-0007-0007-0007-000000000007','Gongura Prawns Pickle','gongura-prawns-pickle','Coastal Andhra fusion of juicy crisp prawns cooked with tangy Gongura sorrel leaves.','A celebrated specialty of coastal Andhra households! Golden fried prawns infused into tangy Gongura sorrel leaf paste.','a1b2c3d4-0001-0001-0001-000000000001','non-veg-pickle',ARRAY['https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=800&auto=format&fit=crop'],ARRAY['Sorrel Leaves (Gongura)','Deveined Crisp Prawns','Sesame Oil & Mustard Powder','Garlic, Chili, Salt'],'Tangy sorrel reduction blended with crisp pan-fried prawns.','Store sealed in refrigerator for maximum tanginess.','6 Months from date of manufacture','250g / 500g / 1kg',false,false,true),
('b1000008-0008-0008-0008-000000000008','Chicken Podi','chicken-podi','Coarsely ground roasted chicken spice powder infused with garlic, curry leaves & roasted lentils.','Transform any simple meal into an extraordinary Andhra feast! Dehydrated seasoned roasted chicken meat hand-pounded with roasted chana dal, urad dal, Guntur dry chilies, garlic, and curry leaves.','a1b2c3d4-0002-0002-0002-000000000002','podi',ARRAY['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800&auto=format&fit=crop'],ARRAY['Dehydrated Roasted Chicken Flakes','Roasted Bengal Gram (Chana Dal)','Roasted Black Gram (Urad Dal)','Dry Guntur Red Chilies','Roasted Garlic & Curry Leaves','Rock Salt & Hing'],'Slow dry-roasted on iron skillet and stone ground.','Keep in an airtight jar. Moisture free spoon required.','4 Months from date of manufacture','150g / 250g / 500g',true,true,true),
('b1000009-0009-0009-0009-000000000009','Traditional Nut & Seed Laddu','traditional-nut-seed-laddu','Nutritious homemade laddus handcrafted with almonds, cashews, seeds, organic jaggery & pure A2 ghee.','A rich, wholesome traditional sweet crafted in Tenali. Hand-roasted almonds, cashews, pumpkin seeds, watermelon seeds, flax seeds, and white sesame seeds bound together using organic palm jaggery and pure A2 ghee.','a1b2c3d4-0003-0003-0003-000000000003','sweet',ARRAY['https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop'],ARRAY['Roasted Almonds & Cashews','Pumpkin Seeds & Melon Seeds','Flax Seeds & White Sesame Seeds','Organic Palm Jaggery (Bella)','Pure A2 Cow Ghee','Cardamom Powder (Elachi)'],'Hand-rolled daily in small quantities using pure A2 ghee.','Store at room temperature in airtight glass container.','45 Days from date of manufacture','250g / 500g / 1kg',true,true,true)
on conflict (slug) do nothing;

-- ============================================================
-- SEED DATA: PRODUCT VARIANTS
-- ============================================================
insert into product_variants (product_id, sku, size_label, weight_g, price, compare_at_price, stock, is_default) values
('b1000001-0001-0001-0001-000000000001','NISA-BCP-250G','250g',250,349,399,45,true),
('b1000001-0001-0001-0001-000000000001','NISA-BCP-500G','500g',500,649,749,30,false),
('b1000001-0001-0001-0001-000000000001','NISA-BCP-1KG','1kg',1000,1249,1449,20,false),
('b1000002-0002-0002-0002-000000000002','NISA-CPB-250G','250g',250,299,349,50,true),
('b1000002-0002-0002-0002-000000000002','NISA-CPB-500G','500g',500,569,649,35,false),
('b1000002-0002-0002-0002-000000000002','NISA-CPB-1KG','1kg',1000,1099,1249,15,false),
('b1000003-0003-0003-0003-000000000003','NISA-GCP-250G','250g',250,369,419,40,true),
('b1000003-0003-0003-0003-000000000003','NISA-GCP-500G','500g',500,689,799,25,false),
('b1000003-0003-0003-0003-000000000003','NISA-GCP-1KG','1kg',1000,1329,1499,18,false),
('b1000004-0004-0004-0004-000000000004','NISA-BMP-250G','250g',250,499,549,30,true),
('b1000004-0004-0004-0004-000000000004','NISA-BMP-500G','500g',500,949,1049,20,false),
('b1000004-0004-0004-0004-000000000004','NISA-BMP-1KG','1kg',1000,1849,1999,10,false),
('b1000005-0005-0005-0005-000000000005','NISA-MPB-250G','250g',250,439,499,25,true),
('b1000005-0005-0005-0005-000000000005','NISA-MPB-500G','500g',500,829,929,15,false),
('b1000005-0005-0005-0005-000000000005','NISA-MPB-1KG','1kg',1000,1599,1799,10,false),
('b1000006-0006-0006-0006-000000000006','NISA-APP-250G','250g',250,399,449,35,true),
('b1000006-0006-0006-0006-000000000006','NISA-APP-500G','500g',500,749,849,20,false),
('b1000006-0006-0006-0006-000000000006','NISA-APP-1KG','1kg',1000,1449,1599,12,false),
('b1000007-0007-0007-0007-000000000007','NISA-GPP-250G','250g',250,419,469,30,true),
('b1000007-0007-0007-0007-000000000007','NISA-GPP-500G','500g',500,789,899,18,false),
('b1000007-0007-0007-0007-000000000007','NISA-GPP-1KG','1kg',1000,1499,1699,10,false),
('b1000008-0008-0008-0008-000000000008','NISA-CP-150G','150g',150,199,249,60,true),
('b1000008-0008-0008-0008-000000000008','NISA-CP-250G','250g',250,319,379,45,false),
('b1000008-0008-0008-0008-000000000008','NISA-CP-500G','500g',500,599,699,25,false),
('b1000009-0009-0009-0009-000000000009','NISA-NSL-250G','250g (8-10 pcs)',250,279,329,40,true),
('b1000009-0009-0009-0009-000000000009','NISA-NSL-500G','500g (18-20 pcs)',500,529,599,25,false),
('b1000009-0009-0009-0009-000000000009','NISA-NSL-1KG','1kg (36-40 pcs)',1000,999,1149,15,false)
on conflict (sku) do nothing;

-- ============================================================
-- SEED DATA: DISCOUNTS
-- ============================================================
insert into discounts (code, discount_type, value, min_order_amount, active) values
('MANAINTI10','percentage',10,499,true),
('NISA100','flat',100,999,true)
on conflict (code) do nothing;

-- ============================================================
-- SEED DATA: REVIEWS
-- ============================================================
insert into reviews (product_id, customer_name, rating, title, comment, is_verified_purchase, is_approved) values
('b1000001-0001-0001-0001-000000000001','Srinivas Rao K.',5,'Pure Tenali Home Taste!','Reminds me of my grandmother cooking in Tenali. The chicken pieces are generous, oil smells fresh of sesame, and chili kick is perfect with curd rice!',true,true),
('b1000003-0003-0003-0003-000000000003','Ananya Reddy',5,'Best Gongura Chicken Pickle online','Ordered from Hyderabad. Delivery took only 2 days. The Gongura tanginess paired with boneless chicken pieces is addicting. 10/10 quality.',true,true),
('b1000008-0008-0008-0008-000000000008','Venkatesh M.',5,'Podi is incredible!','Never had chicken podi before. Tried it with hot rice and ghee... mind blowing crunch and spice level. Will order 500g next time.',true,true),
('b1000009-0009-0009-0009-000000000009','Dr. Radhika P.',5,'Healthy & delicious sweet','Loved that there is no sugar or artificial syrup. Pure ghee aroma and loaded with nuts and seeds. Great evening snack for my kids!',true,true);

-- ============================================================
-- SEED DATA: CMS HOMEPAGE DEFAULTS
-- ============================================================
insert into cms_homepage (section_key, title, subtitle, content_json) values
('announcement_bar','Authentic Andhra Home Food - Made in Small Batches - Delivered Across India',null,'{}'),
('hero','THE TASTE OF ANDHRA, JUST LIKE HOME.','Traditional Andhra recipes made in small batches in Tenali, Andhra Pradesh.','{"cta_primary":"Shop All Pickles","cta_secondary":"Our Story"}'),
('final_cta','Bring Andhra Home.','Order directly from our Tenali kitchen. Delivered fresh across India.','{"cta":"Shop NISA Now"}')
on conflict (section_key) do nothing;

select 'NISA database schema created and seeded successfully!' as result;

-- ============================================================
-- cms_banners table (add after initial schema)
-- ============================================================
create table if not exists cms_banners (
  id uuid primary key default uuid_generate_v4(),
  title text not null default '',
  subtitle text not null default '',
  cta_text text not null default 'Shop Now',
  cta_link text not null default '/products',
  image_url text not null default '',
  bg_color text not null default '#1C0A08',
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table cms_banners enable row level security;
create policy "Public can read active banners" on cms_banners for select using (active = true);

-- First Order discount seed
insert into discounts (code, discount_type, value, min_order_amount, active) values
('FIRSTORDER99', 'flat', 99, 1499, true)
on conflict (code) do nothing;

select 'cms_banners and FIRSTORDER99 added!' as result;
