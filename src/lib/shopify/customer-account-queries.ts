// Customer Account API GraphQL queries. This is a distinct schema from the Storefront
// and Admin APIs — field names here are specific to shopify.com/{shop_id}/account/customer/api.

export const CUSTOMER_PROFILE_AND_ORDERS_QUERY = `
  query CustomerProfileAndOrders($first: Int = 20) {
    customer {
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillments(first: 5) {
            nodes {
              status
              trackingInformation {
                number
                url
                company
              }
            }
          }
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 15) {
            nodes {
              title
              quantity
              image {
                url
                altText
              }
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export interface CustomerAccountOrderLineItem {
  title: string;
  quantity: number;
  image: { url: string; altText: string | null } | null;
  totalPrice: { amount: string; currencyCode: string };
}

export interface CustomerAccountOrder {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillments: {
    nodes: Array<{
      status: string | null;
      trackingInformation: Array<{ number: string | null; url: string | null; company: string | null }>;
    }>;
  };
  totalPrice: { amount: string; currencyCode: string };
  lineItems: { nodes: CustomerAccountOrderLineItem[] };
}

export interface CustomerProfileAndOrdersData {
  customer: {
    firstName: string | null;
    lastName: string | null;
    emailAddress: { emailAddress: string } | null;
    orders: { nodes: CustomerAccountOrder[] };
  } | null;
}
