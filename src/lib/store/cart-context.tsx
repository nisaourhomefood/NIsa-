'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, ProductWithVariants, ProductVariant, Discount } from '@/types/database.types';
import { INITIAL_DISCOUNTS } from '@/lib/data/mock-products';

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 79;
const LOCAL_STORAGE_KEY = 'nisa_cart_v1';
const SHOPIFY_CART_ID_KEY = 'nisa_shopify_cart_id';
const SHOPIFY_CHECKOUT_URL_KEY = 'nisa_shopify_checkout_url';

function formatShopifyVariantId(id: string): string {
  if (id.startsWith('gid://shopify/ProductVariant/')) return id;
  if (/^\d+$/.test(id)) return `gid://shopify/ProductVariant/${id}`;
  return id;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: ProductWithVariants, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variant_id: string) => void;
  updateQuantity: (variant_id: string, quantity: number) => void;
  changeItemVariant: (oldVariantId: string, newVariant: { id: string; size_label: string; price: number; compare_at_price?: number | null; stock?: number }) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedDiscount: Discount | null;
  applyDiscountCode: (code: string) => { success: boolean; message: string };
  removeDiscountCode: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  totalItemCount: number;
  amountForFreeShipping: number;
  freeShippingProgress: number;
  shopifyCheckoutUrl: string | null;
  isShopifyCheckoutLoading: boolean;
  proceedToShopifyCheckout: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [shopifyCheckoutUrl, setShopifyCheckoutUrl] = useState<string | null>(null);
  const [shopifyCartId, setShopifyCartId] = useState<string | null>(null);
  const [isShopifyCheckoutLoading, setIsShopifyCheckoutLoading] = useState(false);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedCart) {
        const parsed: CartItem[] = JSON.parse(savedCart);
        // Deduplicate any accidental duplicate variant items
        const deduplicated: CartItem[] = [];
        parsed.forEach((item) => {
          const existing = deduplicated.find((d) => d.variant_id === item.variant_id);
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            deduplicated.push({ ...item });
          }
        });
        setItems(deduplicated);
      }
      const savedShopifyCheckout = localStorage.getItem(SHOPIFY_CHECKOUT_URL_KEY);
      if (savedShopifyCheckout) {
        setShopifyCheckoutUrl(savedShopifyCheckout);
      }
      const savedShopifyCartId = localStorage.getItem(SHOPIFY_CART_ID_KEY);
      if (savedShopifyCartId) {
        setShopifyCartId(savedShopifyCartId);
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, isMounted]);

  const addItem = (product: ProductWithVariants, variant: ProductVariant, quantity = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.variant_id === variant.id);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(newQty, variant.stock),
        };
        return updated;
      }

      const newItem: CartItem = {
        id: variant.id,
        product_id: product.id,
        variant_id: variant.id,
        name: product.name,
        slug: product.slug,
        size_label: variant.size_label,
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        quantity,
        image: product.images[0] || '',
        stock: variant.stock,
      };

      return [...prevItems, newItem];
    });

    setIsCartOpen(true);
  };

  const removeItem = (variant_id: string) => {
    setItems((prev) => prev.filter((item) => item.variant_id !== variant_id));
  };

  const updateQuantity = (variant_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variant_id);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.variant_id === variant_id
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const changeItemVariant = (
    oldVariantId: string,
    newVariant: { id: string; size_label: string; price: number; compare_at_price?: number | null; stock?: number }
  ) => {
    setItems((prev) => {
      const currentItem = prev.find((item) => item.variant_id === oldVariantId);
      if (!currentItem) return prev;

      // If the target variant is ALREADY in the cart under another line, merge them
      const alreadyHasTarget = prev.some(
        (item) => item.variant_id === newVariant.id && item.variant_id !== oldVariantId
      );

      if (alreadyHasTarget) {
        return prev
          .filter((item) => item.variant_id !== oldVariantId)
          .map((item) => {
            if (item.variant_id === newVariant.id) {
              return {
                ...item,
                quantity: item.quantity + currentItem.quantity,
              };
            }
            return item;
          });
      }

      return prev.map((item) => {
        if (item.variant_id === oldVariantId) {
          return {
            ...item,
            id: newVariant.id,
            variant_id: newVariant.id,
            size_label: newVariant.size_label,
            price: newVariant.price,
            compare_at_price: newVariant.compare_at_price || null,
            stock: newVariant.stock || item.stock,
          };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedDiscount(null);
    setShopifyCheckoutUrl(null);
    setShopifyCartId(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(SHOPIFY_CHECKOUT_URL_KEY);
      localStorage.removeItem(SHOPIFY_CART_ID_KEY);
    } catch (e) {
      console.error('Failed to clear cart storage', e);
    }
  };

  const proceedToShopifyCheckout = async (): Promise<boolean> => {
    if (items.length === 0) return false;
    setIsShopifyCheckoutLoading(true);

    try {
      // 1. Prepare Shopify cart lines
      const lines = items.map((item) => ({
        merchandiseId: formatShopifyVariantId(item.variant_id),
        quantity: item.quantity,
      }));

      // 2. Call Shopify Cart API
      const res = await fetch('/api/shopify/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', lines }),
      });

      if (!res.ok) {
        throw new Error('Failed to create Shopify cart');
      }

      const data = await res.json();
      if (data?.cart?.checkoutUrl) {
        const checkoutUrl = data.cart.checkoutUrl;
        setShopifyCheckoutUrl(checkoutUrl);
        setShopifyCartId(data.cart.id);
        try {
          localStorage.setItem(SHOPIFY_CHECKOUT_URL_KEY, checkoutUrl);
          localStorage.setItem(SHOPIFY_CART_ID_KEY, data.cart.id);
        } catch {}

        // Apply discount if one was active
        if (appliedDiscount) {
          try {
            await fetch('/api/shopify/cart', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'discount',
                cartId: data.cart.id,
                discountCodes: [appliedDiscount.code],
              }),
            });
          } catch {}
        }

        // Redirect directly to Shopify Checkout
        window.location.href = checkoutUrl;
        return true;
      }
    } catch (err) {
      console.warn('[Shopify Checkout] Direct Shopify checkout creation failed:', err);
    } finally {
      setIsShopifyCheckoutLoading(false);
    }

    return false;
  };

  const applyDiscountCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = INITIAL_DISCOUNTS.find(
      (d) => d.code.toUpperCase() === cleanCode && d.active
    );

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }

    const currentSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (currentSubtotal < found.min_order_amount) {
      return {
        success: false,
        message: `Add items worth ₹${found.min_order_amount - currentSubtotal} more to apply code ${found.code}`,
      };
    }

    setAppliedDiscount(found);
    return { success: true, message: `Coupon '${found.code}' applied successfully!` };
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (!appliedDiscount || subtotal < appliedDiscount.min_order_amount) return 0;
    if (appliedDiscount.discount_type === 'percentage') {
      return Math.round((subtotal * appliedDiscount.value) / 100);
    }
    return Math.min(subtotal, appliedDiscount.value);
  }, [subtotal, appliedDiscount]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingFee);
  }, [subtotal, discountAmount, shippingFee]);

  const amountForFreeShipping = useMemo(() => {
    return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  }, [subtotal]);

  const freeShippingProgress = useMemo(() => {
    return Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  }, [subtotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        changeItemVariant,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedDiscount,
        applyDiscountCode,
        removeDiscountCode,
        subtotal,
        discountAmount,
        shippingFee,
        totalAmount,
        totalItemCount,
        amountForFreeShipping,
        freeShippingProgress,
        shopifyCheckoutUrl,
        isShopifyCheckoutLoading,
        proceedToShopifyCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
