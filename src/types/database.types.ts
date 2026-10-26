// Database models and TypeScript interfaces for NISA (నిస) - Mana Inti Vanta

export type DiscountType = 'percentage' | 'flat';
export type OrderStatus = 'placed' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'cod' | 'razorpay' | 'online_placeholder' | 'upi' | 'card' | string;
export type AdminRole = 'superadmin' | 'admin' | 'editor';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  category_id: string | null;
  product_type: 'non-veg-pickle' | 'podi' | 'sweet';
  images: string[];
  ingredients: string[];
  preparation_info: string | null;
  storage_info: string | null;
  shelf_life: string;
  net_quantity: string;
  featured_status: boolean;
  bestseller_status: boolean;
  active_status: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size_label: string; // e.g., "250g", "500g", "1kg"
  weight_g: number;
  price: number;
  compare_at_price: number | null;
  stock: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductWithVariants extends Product {
  variants: ProductVariant[];
  category?: Category | null;
  reviews_count?: number;
  average_rating?: number;
}

export interface Customer {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  landmark?: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Discount {
  id: string;
  code: string;
  discount_type: DiscountType;
  value: number;
  min_order_amount: number;
  active: boolean;
  valid_from: string;
  valid_to?: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string | null;
  guest_email?: string | null;
  guest_phone?: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_amount: number;
  shipping_address: AddressInfo;
  billing_address?: AddressInfo | null;
  discount_code?: string | null;
  notes?: string | null;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface AddressInfo {
  full_name: string;
  phone: string;
  email?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  landmark?: string;
  country?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_label: string;
  price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  content_json: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  comment: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  image_url?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  name: string;
  slug: string;
  size_label: string;
  price: number;
  compare_at_price: number | null;
  quantity: number;
  image: string;
  stock: number;
}
