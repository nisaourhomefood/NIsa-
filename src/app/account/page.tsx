import Link from 'next/link';
import { Package, Truck, LogIn, MessageCircle } from 'lucide-react';

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '';
const ACCOUNT_URL = SHOPIFY_DOMAIN ? `https://${SHOPIFY_DOMAIN}/account` : '#';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_STORE_WHATSAPP_NUMBER || '';

export default function CustomerAccountPage() {
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

        <Link
          href={ACCOUNT_URL}
          className="w-full flex items-center justify-center gap-2 bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold py-3.5 rounded-xl shadow-md transition-colors"
        >
          <LogIn className="w-4 h-4" /> Log In / Create Account
        </Link>

        <p className="text-[11px] text-stone-500 font-medium text-center">
          Use the same email you ordered with. First time? You'll be able to set a password or
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
