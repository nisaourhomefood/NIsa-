// Shopify Storefront GraphQL API Types for NISA Storefront

export interface ShopifyImage {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number | null;
  sku?: string | null;
  price: ShopifyPrice;
  compareAtPrice?: ShopifyPrice | null;
  selectedOptions: ShopifySelectedOption[];
  image?: ShopifyImage | null;
  weight?: number | null;
  weightUnit?: string | null;
}

export interface ShopifyMetafield {
  id?: string;
  namespace: string;
  key: string;
  value: string;
  type?: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  tags: string[];
  productType: string;
  vendor: string;
  images: {
    nodes: ShopifyImage[];
  };
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  variants: {
    nodes: ShopifyProductVariant[];
  };
  metafields?: (ShopifyMetafield | null)[];
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyImage | null;
  products?: {
    nodes: ShopifyProduct[];
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyPrice;
    subtotalAmount?: ShopifyPrice;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        nodes: ShopifyImage[];
      };
    };
    price: ShopifyPrice;
    compareAtPrice?: ShopifyPrice | null;
    selectedOptions: ShopifySelectedOption[];
    image?: ShopifyImage | null;
  };
}

export interface ShopifyDiscountAllocation {
  discountedAmount: ShopifyPrice;
}

export interface ShopifyDiscountCode {
  code: string;
  applicable: boolean;
}

export interface ShopifyCartCost {
  totalAmount: ShopifyPrice;
  subtotalAmount: ShopifyPrice;
  totalTaxAmount?: ShopifyPrice | null;
  totalDutyAmount?: ShopifyPrice | null;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: ShopifyCartCost;
  lines: {
    nodes: ShopifyCartLine[];
  };
  discountCodes?: ShopifyDiscountCode[];
}

export interface ShopifyCartLineInput {
  merchandiseId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
}

export interface ShopifyCartLineUpdateInput {
  id: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
}
