// GraphQL Queries and Mutations for Shopify Storefront API

// Fragment for product details
export const PRODUCT_FRAGMENT = `
  fragment ProductDetails on Product {
    id
    title
    handle
    description
    descriptionHtml
    availableForSale
    productType
    vendor
    tags
    images(first: 10) {
      nodes {
        url
        altText
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        sku
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
        }
        weight
        weightUnit
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "ingredients" },
      { namespace: "custom", key: "storage_info" },
      { namespace: "custom", key: "preparation_info" },
      { namespace: "custom", key: "shelf_life" },
      { namespace: "custom", key: "spice_level" }
    ]) {
      key
      value
      namespace
    }
  }
`;

// Fragment for Cart
export const CART_FRAGMENT = `
  fragment CartDetails on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            sku
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
            product {
              id
              title
              handle
              images(first: 1) {
                nodes {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
    discountCodes {
      code
      applicable
    }
  }
`;

// Query all products
export const GET_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int = 50, $query: String, $sortKey: ProductSortKeys = BEST_SELLING, $reverse: Boolean = false) {
    products(first: $first, query: $query, sortKey: $sortKey, reverse: $reverse) {
      nodes {
        ...ProductDetails
      }
    }
  }
`;

// Query single product by handle/slug
export const GET_PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductDetails
    }
  }
`;

// Shopify's own recommendation engine — "customers who viewed this also viewed/bought"
export const GET_PRODUCT_RECOMMENDATIONS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductDetails
    }
  }
`;

// Query collections
export const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int = 20) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        description
        image {
          url
          altText
        }
      }
    }
  }
`;

// Query products in a collection
export const GET_COLLECTION_PRODUCTS_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetCollectionProducts($handle: String!, $first: Int = 50) {
    collection(handle: $handle) {
      id
      title
      handle
      products(first: $first) {
        nodes {
          ...ProductDetails
        }
      }
    }
  }
`;

// Cart Create Mutation
export const CART_CREATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartDetails
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Cart Lines Add Mutation
export const CART_LINES_ADD_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartDetails
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Cart Lines Update Mutation
export const CART_LINES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartDetails
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Cart Lines Remove Mutation
export const CART_LINES_REMOVE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartDetails
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Cart Discount Codes Update Mutation
export const CART_DISCOUNT_CODES_UPDATE_MUTATION = `
  ${CART_FRAGMENT}
  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...CartDetails
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Query Cart by ID
export const GET_CART_QUERY = `
  ${CART_FRAGMENT}
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartDetails
    }
  }
`;

// Query real variant prices by ID (server-side price validation, prevents client tampering)
export const GET_VARIANT_PRICES_QUERY = `
  query GetVariantPrices($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        price {
          amount
        }
      }
    }
  }
`;

// Homepage hero banners — a "hero_banner" Metaobject definition created in
// Shopify Admin (Settings -> Custom data -> Metaobjects), entries managed the
// same way a merchant manages products. No external database involved.
export const GET_HERO_BANNERS_QUERY = `
  query GetHeroBanners {
    metaobjects(type: "hero_banner", first: 10) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;
