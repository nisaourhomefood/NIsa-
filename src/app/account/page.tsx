import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { LogIn, MessageCircle, Package, Truck, LogOut, ExternalLink, CheckCircle2, Clock } from 'lucide-react';
import { customerAccountFetch, isCustomerAccountConfigured } from '@/lib/shopify/customer-account';
import { getCustomerSession, isSessionExpired } from '@/lib/shopify/customer-session';
import {
  CUSTOMER_PROFILE_AND_ORDERS_QUERY,
  CustomerProfileAndOrdersData,
} from '@/lib/shopify/customer-account-queries';
import { formatCurrency } from '@/lib/utils';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '';

function formatStatusLabel(value: string | null | undefined): string {
  if (!value) return 'Pending';
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function LoggedOutView({ notConfigured, loginFailed }: { notConfigured?: boolean; loginFailed?: boolean }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 bg-[#FAF6F0] min-h-[70vh]">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-extrabold text-stone-900">My Account</h1>
        <p className="text-sm text-stone-600 font-medium max-w-md mx-auto">
          Log in to see your order history, delivery status, and tracking — handled securely by
          Shopify, the same system that processes your payment at checkout.
        </p>
      </div>

      <div className="bg-white border border-[#E8DFC9] rounded-3xl p-8 space-y-6 shadow-xs">
        {loginFailed && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl p-3 text-center">
            Login didn&apos;t go through. Please try again.
          </div>
        )}
        {notConfigured && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-xl p-3 text-center">
            Account login is being set up. Please check back shortly, or use WhatsApp below.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] flex items-start gap-3">
            <Package className="w-5 h-5 text-[#8B1E10] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Order History</h3>
              <p className="text-xs text-stone-600 font-medium">Every order you've placed, with items and totals.</p>
            </div>
          </div>
          <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E8DFC9] flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#8B1E10] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Delivery Status</h3>
              <p className="text-xs text-stone-600 font-medium">Live fulfillment and shipment tracking per order.</p>
            </div>
          </div>
        </div>

        {notConfigured ? (
          <div className="w-full flex items-center justify-center gap-2 bg-stone-200 text-stone-500 font-extrabold py-3.5 rounded-xl cursor-not-allowed">
            <LogIn className="w-4 h-4" /> Log In / Create Account
          </div>
        ) : (
          <a
            href="/api/auth/login"
            className="w-full flex items-center justify-center gap-2 bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold py-3.5 rounded-xl shadow-md transition-colors"
          >
            <LogIn className="w-4 h-4" /> Log In / Create Account
          </a>
        )}

        <p className="text-[11px] text-stone-500 font-medium text-center">
          Use the same email you ordered with. First time? You&apos;ll be able to set a password or
          sign in with a one-time code sent to your email.
        </p>
      </div>

      {WHATSAPP_NUMBER && (
        <div className="text-center text-xs text-stone-600 font-medium">
          Prefer WhatsApp? Message us at{' '}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B1E10] font-bold underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" /> +{WHATSAPP_NUMBER}
          </a>{' '}
          with your order number for a delivery update.
        </div>
      )}
    </div>
  );
}

function AccountErrorView() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 bg-[#FAF6F0] min-h-[70vh] text-center">
      <h1 className="text-2xl font-extrabold text-stone-900">Couldn&apos;t load your account</h1>
      <p className="text-sm text-stone-600 font-medium max-w-md mx-auto">
        Something went wrong talking to Shopify. Please try again, or sign out and log back in.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/account"
          className="bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-md"
        >
          Try again
        </Link>
        <a
          href="/api/auth/logout"
          className="border border-stone-300 text-stone-700 font-bold text-sm px-5 py-2.5 rounded-xl"
        >
          Sign out
        </a>
      </div>
    </div>
  );
}

export default async function CustomerAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  if (!isCustomerAccountConfigured()) {
    return <LoggedOutView notConfigured />;
  }

  const session = await getCustomerSession();
  if (!session) {
    return <LoggedOutView loginFailed={params.error === 'login_failed'} />;
  }

  if (isSessionExpired(session)) {
    redirect('/api/auth/refresh?next=/account');
  }

  const { data } = await customerAccountFetch<CustomerProfileAndOrdersData>(
    session.accessToken,
    CUSTOMER_PROFILE_AND_ORDERS_QUERY
  );

  if (!data?.customer) {
    return <AccountErrorView />;
  }

  const { customer } = data;
  const orders = customer.orders.nodes;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-[#FAF6F0] min-h-[70vh]">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Welcome{customer.firstName ? `, ${customer.firstName}` : ''}
          </h1>
          {customer.emailAddress?.emailAddress && (
            <p className="text-sm text-stone-600 font-medium mt-0.5">{customer.emailAddress.emailAddress}</p>
          )}
        </div>
        <a
          href="/api/auth/logout"
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#8B1E10] border border-stone-300 rounded-xl px-3.5 py-2 bg-white"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </a>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-stone-900">Your Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#E8DFC9] rounded-2xl p-8 text-center space-y-3">
            <Package className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm text-stone-600 font-medium">No orders yet.</p>
            <Link
              href="/products"
              className="inline-block bg-[#8B1E10] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          orders.map((order) => {
            const fulfillment = order.fulfillments.nodes[0];
            const tracking = fulfillment?.trackingInformation?.[0];
            const isPaid = order.financialStatus === 'PAID';

            return (
              <div key={order.id} className="bg-white border border-[#E8DFC9] rounded-2xl p-5 space-y-4 shadow-xs">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-extrabold text-stone-900">{order.name}</p>
                    <p className="text-xs text-stone-500 font-medium">
                      {new Date(order.processedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {formatStatusLabel(order.financialStatus)}
                    </span>
                    {fulfillment && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                        <Truck className="w-3 h-3" /> {formatStatusLabel(fulfillment.status)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {order.lineItems.nodes.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#FAF6F0] rounded-xl p-2 border border-[#E8DFC9] shrink-0">
                      {item.image?.url && (
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                          <Image src={item.image.url} alt={item.image.altText || item.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 pr-2">
                        <p className="text-[11px] font-bold text-stone-900 truncate max-w-[140px]">{item.title}</p>
                        <p className="text-[10px] text-stone-500 font-medium">Qty {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-sm font-extrabold text-stone-900">
                    {formatCurrency(parseFloat(order.totalPrice.amount))}
                  </span>
                  {tracking?.url ? (
                    <a
                      href={tracking.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-bold text-[#8B1E10] underline"
                    >
                      Track Shipment <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium">Tracking not available yet</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {WHATSAPP_NUMBER && (
        <div className="text-center text-xs text-stone-600 font-medium">
          Prefer WhatsApp? Message us at{' '}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B1E10] font-bold underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5" /> +{WHATSAPP_NUMBER}
          </a>{' '}
          with your order number for a delivery update.
        </div>
      )}
    </div>
  );
}
