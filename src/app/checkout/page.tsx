'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, Truck, MessageSquare } from 'lucide-react';
import { useCart } from '@/lib/store/cart-context';
import { formatCurrency, generateOrderNumber, getEstimatedDeliveryDate } from '@/lib/utils';
import { addressSchema, AddressFormData } from '@/lib/validations/schemas';
import { calculateShippingFee, ShippingEstimate } from '@/lib/utils/shipping';
import { buildWhatsAppOrderMessage, getStoreWhatsAppLink } from '@/lib/utils/whatsapp-order';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    Cashfree?: any;
  }
}

// Dynamically load Cashfree JS SDK v3
function loadCashfreeScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Cashfree) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discountAmount,
    shippingFee: fallbackShippingFee,
    appliedDiscount,
    clearCart,
  } = useCart();

  // 4-step wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState<AddressFormData>({
    full_name: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: 'Andhra Pradesh',
    postal_code: '',
    landmark: '',
  });

  const [paymentOption, setPaymentOption] = useState<'whatsapp' | 'cashfree'>('whatsapp');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Live shipping estimate the moment a valid 6-digit pincode is entered
  const pincodeShipping: ShippingEstimate | null = useMemo(() => {
    const clean = formData.postal_code.replace(/\D/g, '');
    return clean.length === 6 ? calculateShippingFee(clean, subtotal) : null;
  }, [formData.postal_code, subtotal]);

  const shippingFee = pincodeShipping ? pincodeShipping.fee : fallbackShippingFee;
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4 bg-[#FAF6F0]">
        <h1 className="text-2xl font-extrabold text-stone-900">Your Cart is Empty</h1>
        <p className="text-stone-600 text-sm">Please add items to your cart before proceeding to checkout.</p>
        <Link href="/products">
          <Button className="bg-[#8B1E10] text-white font-bold">Browse Catalogue</Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    const step1Errors: Record<string, string> = {};
    if (!formData.full_name || formData.full_name.length < 2) step1Errors.full_name = 'Enter your full name';
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) step1Errors.phone = 'Enter a valid 10-digit mobile number';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) step1Errors.email = 'Enter a valid email address';

    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      return;
    }
    setErrors({});
    setCurrentStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    const result = addressSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setCurrentStep(3);
  };

  const createSupabaseOrder = async (paymentStatus: 'pending' | 'paid', paymentMethod: string) => {
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
          },
          address: formData,
          items: items.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.name,
            size_label: item.size_label,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal,
          discount_amount: discountAmount,
          shipping_fee: shippingFee,
          total_amount: totalAmount,
          payment_method: paymentMethod,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return { orderNumber: data.order_number || generateOrderNumber(), orderDbId: data.order_id };
      }
    } catch (err) {
      console.error('Failed to create live Supabase order:', err);
    }
    return { orderNumber: generateOrderNumber(), orderDbId: null };
  };

  const handleCashfreeOnlinePayment = async () => {
    setIsSubmitting(true);
    setPaymentError(null);

    try {
      // 1. Create order on server via Cashfree Orders API
      const orderRes = await fetch('/api/payment/cashfree/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          customer: {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
          },
          address: formData,
          items: items.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
          discount_code: appliedDiscount?.code,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.payment_session_id) {
        throw new Error(orderData.error || 'Failed to initialize Cashfree payment gateway');
      }

      // If in demo mode without credentials
      if (orderData.demoMode) {
        const { orderNumber } = await createSupabaseOrder('paid', 'cashfree');

        const orderPayload = {
          orderId: orderNumber,
          createdAt: new Date().toISOString(),
          customer: formData,
          items,
          subtotal,
          discountAmount,
          shippingFee,
          totalAmount,
          paymentMethod: 'cashfree',
          payment_status: 'paid',
          order_status: 'placed',
          estimatedDelivery: getEstimatedDeliveryDate(),
        };

        try {
          localStorage.setItem(`nisa_order_${orderNumber}`, JSON.stringify(orderPayload));
        } catch (e) {
          console.error(e);
        }

        clearCart();
        setIsSubmitting(false);
        router.push(`/checkout/success/${orderNumber}`);
        return;
      }

      // 2. Load SDK & open Cashfree modal
      const isLoaded = await loadCashfreeScript();
      if (!isLoaded) {
        throw new Error('Cashfree SDK failed to load. Please check your connection.');
      }

      const cashfree = window.Cashfree({
        mode: orderData.environment || 'sandbox',
      });

      const { orderNumber, orderDbId } = await createSupabaseOrder('pending', 'cashfree');

      cashfree.checkout({
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: '_modal',
      }).then(async (result: any) => {
        if (result.error) {
          setPaymentError(result.error.message || 'Payment was cancelled or failed.');
          setIsSubmitting(false);
          return;
        }

        if (result.paymentDetails) {
          // Verify with server
          await fetch('/api/payment/cashfree/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order_id: orderData.order_id,
              db_order_id: orderDbId,
            }),
          });
        }

        const orderPayload = {
          orderId: orderNumber,
          createdAt: new Date().toISOString(),
          customer: formData,
          items,
          subtotal,
          discountAmount,
          shippingFee,
          totalAmount,
          paymentMethod: 'cashfree',
          payment_status: 'paid',
          order_status: 'placed',
          estimatedDelivery: getEstimatedDeliveryDate(),
        };

        try {
          localStorage.setItem(`nisa_order_${orderNumber}`, JSON.stringify(orderPayload));
        } catch (e) {
          console.error(e);
        }

        clearCart();
        setIsSubmitting(false);
        router.push(`/checkout/success/${orderNumber}`);
      }).catch((err: any) => {
        setPaymentError(err.message || 'Payment process was interrupted.');
        setIsSubmitting(false);
      });

    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'Something went wrong with Cashfree checkout.');
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    setIsSubmitting(true);
    setPaymentError(null);

    // Open the tab synchronously on the click so mobile browsers don't treat it as a blocked popup
    const whatsappWindow = window.open('', '_blank');

    const { orderNumber } = await createSupabaseOrder('pending', 'upi');

    const message = buildWhatsAppOrderMessage({
      orderNumber,
      items,
      subtotal,
      discountAmount,
      shippingFee,
      shippingZoneLabel: pincodeShipping?.zoneLabel || 'Standard Delivery',
      totalAmount,
      address: formData,
    });

    const orderPayload = {
      orderId: orderNumber,
      createdAt: new Date().toISOString(),
      customer: formData,
      items,
      subtotal,
      discountAmount,
      shippingFee,
      totalAmount,
      paymentMethod: 'upi',
      payment_status: 'pending',
      order_status: 'placed',
      estimatedDelivery: getEstimatedDeliveryDate(),
    };

    try {
      localStorage.setItem(`nisa_order_${orderNumber}`, JSON.stringify(orderPayload));
    } catch (e) {
      console.error(e);
    }

    const waLink = getStoreWhatsAppLink(message);
    if (whatsappWindow) {
      whatsappWindow.location.href = waLink;
    } else {
      window.open(waLink, '_blank');
    }

    clearCart();
    setIsSubmitting(false);
    router.push(`/checkout/success/${orderNumber}`);
  };

  const handleSubmitOrder = async () => {
    if (paymentOption === 'cashfree') {
      await handleCashfreeOnlinePayment();
    } else {
      await handleWhatsAppOrder();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 bg-[#FAF6F0] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8DFC9] pb-3 sm:pb-4">
        <Link href="/products" className="text-xs text-[#8B1E10] hover:underline flex items-center gap-1 font-bold">
          <ArrowLeft className="w-4 h-4" /> Return to Shop
        </Link>
        <span className="text-[11px] sm:text-xs text-stone-600 flex items-center gap-1 font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-700" /> 100% Secure Checkout
        </span>
      </div>

      {/* Progress Bar / Steps Indicator */}
      <div className="grid grid-cols-4 text-center text-[10px] sm:text-xs font-extrabold border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`pb-2 border-b-2 transition-colors ${currentStep === 1 ? 'border-[#8B1E10] text-[#8B1E10]' : 'border-transparent text-stone-400'}`}
        >
          1. Contact
        </button>
        <button
          type="button"
          onClick={() => currentStep > 1 && setCurrentStep(2)}
          className={`pb-2 border-b-2 transition-colors ${currentStep === 2 ? 'border-[#8B1E10] text-[#8B1E10]' : 'border-transparent text-stone-400'}`}
        >
          2. Address
        </button>
        <button
          type="button"
          onClick={() => currentStep > 2 && setCurrentStep(3)}
          className={`pb-2 border-b-2 transition-colors ${currentStep === 3 ? 'border-[#8B1E10] text-[#8B1E10]' : 'border-transparent text-stone-400'}`}
        >
          3. Summary
        </button>
        <button
          type="button"
          onClick={() => currentStep > 3 && setCurrentStep(4)}
          className={`pb-2 border-b-2 transition-colors ${currentStep === 4 ? 'border-[#8B1E10] text-[#8B1E10]' : 'border-transparent text-stone-400'}`}
        >
          4. Payment
        </button>
      </div>

      {/* STEP 1: Customer Details */}
      {currentStep === 1 && (
        <form onSubmit={handleStep1Next} className="bg-white border border-[#E8DFC9] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <h2 className="text-base sm:text-lg font-extrabold text-stone-900 border-b border-stone-100 pb-3">
            Step 1: Customer Details
          </h2>

          <Input
            label="Full Name *"
            placeholder="e.g. Srinivas Rao"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            error={errors.full_name}
            required
          />

          <Input
            label="Mobile Phone Number *"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            required
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="care@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            required
          />

          <Button type="submit" className="w-full bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold py-3 text-xs sm:text-sm">
            Continue to Delivery Address →
          </Button>
        </form>
      )}

      {/* STEP 2: Delivery Address */}
      {currentStep === 2 && (
        <form onSubmit={handleStep2Next} className="bg-white border border-[#E8DFC9] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xs">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
              Step 2: Delivery Address
            </h2>
            <button type="button" onClick={() => setCurrentStep(1)} className="text-xs text-[#8B1E10] font-bold underline">
              Edit Details
            </button>
          </div>

          <Input
            label="House / Flat No. & Building *"
            placeholder="Door No. 4-12, Heritage Apartments"
            value={formData.address_line1}
            onChange={(e) => handleInputChange('address_line1', e.target.value)}
            error={errors.address_line1}
            required
          />

          <Input
            label="Street & Area *"
            placeholder="Guntur Road, Near Clock Tower"
            value={formData.address_line2 || ''}
            onChange={(e) => handleInputChange('address_line2', e.target.value)}
            required
          />

          <Input
            label="Landmark (Optional)"
            placeholder="e.g. Opposite State Bank"
            value={formData.landmark || ''}
            onChange={(e) => handleInputChange('landmark', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Input
              label="City / Town *"
              placeholder="e.g. Tenali / Vijayawada"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              error={errors.city}
              required
            />

            <Input
              label="State *"
              placeholder="Andhra Pradesh"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              error={errors.state}
              required
            />

            <Input
              label="6-Digit Pincode *"
              placeholder="522201"
              value={formData.postal_code}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
              error={errors.postal_code}
              required
            />
          </div>

          {pincodeShipping && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 space-y-1.5 text-xs text-stone-700">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-emerald-950 font-extrabold">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{pincodeShipping.locationName} ({formData.postal_code})</span>
                </span>
                <span className="text-[#8B1E10] font-black bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {pincodeShipping.fee === 0 ? 'FREE Express Delivery' : `${formatCurrency(pincodeShipping.fee)} Delivery Fee`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-emerald-200/60 font-medium">
                <span>Estimated Arrival:</span>
                <strong className="text-stone-900 font-extrabold">{pincodeShipping.estimatedArrival}</strong>
              </div>

              <p className="text-[10px] text-stone-500 font-medium">
                ⏱️ {pincodeShipping.dispatchNote}
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="w-full sm:w-auto">
              ← Back
            </Button>
            <Button type="submit" className="w-full sm:flex-1 bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold py-3 text-xs sm:text-sm">
              Continue to Order Summary →
            </Button>
          </div>
        </form>
      )}

      {/* STEP 3: Order Summary */}
      {currentStep === 3 && (
        <div className="bg-white border border-[#E8DFC9] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
              Step 3: Review Order Summary
            </h2>
            <button type="button" onClick={() => setCurrentStep(2)} className="text-xs text-[#8B1E10] font-bold underline">
              Edit Address
            </button>
          </div>

          {/* Delivery Address Review */}
          <div className="bg-[#FAF6F0] p-3 sm:p-4 rounded-xl border border-[#E8DFC9] text-xs space-y-1 font-medium text-stone-700">
            <strong className="text-stone-900 block text-xs sm:text-sm">{formData.full_name} ({formData.phone})</strong>
            <p>{formData.address_line1}, {formData.address_line2}</p>
            {formData.landmark && <p>Near: {formData.landmark}</p>}
            <p>{formData.city}, {formData.state} – {formData.postal_code}</p>
          </div>

          {/* Cart Items List */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">
              Order Items ({items.length})
            </h3>
            <div className="divide-y divide-stone-100 border rounded-xl overflow-hidden">
              {items.map((item) => {
                return (
                  <div key={item.id} className="p-3 bg-white space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-extrabold text-stone-900 text-xs truncate block">{item.name}</span>
                        <span className="text-[11px] text-stone-500 font-medium">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                      </div>
                      <span className="font-black text-xs text-[#8B1E10]">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[9px] font-bold text-stone-400 uppercase">Pack Size:</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-md font-bold bg-[#8B1E10] text-white">
                        {item.size_label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Free Shipping Unlocked Confirmation */}
            {subtotal >= 2499 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 mt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-xs font-bold text-emerald-900">Free shipping unlocked on this order!</span>
              </div>
            )}
          </div>

          {/* Bill Calculation */}
          <div className="bg-[#FAF6F0] p-3 sm:p-4 rounded-xl space-y-2 text-xs border border-[#E8DFC9]">
            <div className="flex justify-between text-stone-600">
              <span>Item Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Coupon Savings:</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Shipping Fee{pincodeShipping ? ` (${pincodeShipping.zoneLabel})` : ''}:</span>
              <span>{formatCurrency(shippingFee)}</span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-extrabold text-stone-900 pt-2 border-t border-[#E8DFC9]">
              <span>Final Total Amount:</span>
              <span className="text-[#8B1E10]">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} className="w-full sm:w-auto">
              ← Back
            </Button>
            <Button onClick={() => setCurrentStep(4)} className="w-full sm:flex-1 bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold py-3 text-xs sm:text-sm">
              Proceed to Payment Option →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Payment Section Architecture */}
      {currentStep === 4 && (
        <div className="bg-white border border-[#E8DFC9] rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xs">
          <div className="flex justify-between items-center border-b border-stone-100 pb-3">
            <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
              Step 4: Select Payment Option
            </h2>
            <button type="button" onClick={() => setCurrentStep(3)} className="text-xs text-[#8B1E10] font-bold underline">
              Review Summary
            </button>
          </div>

          {paymentError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{paymentError}</span>
            </div>
          )}

          {/* 100% Prepaid Policy Banner */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-extrabold text-[#8B1E10]">
              <span>🛡️ 100% Prepaid Orders Only (No COD)</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
              Because each batch is hand-cooked fresh to order in Tenali without factory chemicals, we only process prepaid orders. Please complete your payment via UPI on WhatsApp and send your screenshot.
            </p>
          </div>

          {/* Payment Choices */}
          <div className="space-y-3">
            {/* WhatsApp + UPI (direct, zero gateway fee) */}
            <label
              onClick={() => setPaymentOption('whatsapp')}
              className={`flex items-start justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                paymentOption === 'whatsapp'
                  ? 'bg-red-50/70 border-[#8B1E10] text-[#8B1E10] ring-1 ring-[#8B1E10]'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-[#8B1E10] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs sm:text-sm block">Direct WhatsApp Order (UPI / GPay / PhonePe)</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Recommended</span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium leading-relaxed">
                    Opens WhatsApp with your complete order & address pre-filled. Pay via Google Pay, PhonePe, Paytm, or BHIM UPI. Share your payment screenshot to confirm — we dispatch within 48 hours with live tracking!
                  </p>
                  <div className="flex items-center gap-2 pt-0.5 text-[10px] text-stone-500 font-bold">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">GPay</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">PhonePe</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">Paytm</span>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">BHIM UPI</span>
                  </div>
                </div>
              </div>
              <input type="radio" checked={paymentOption === 'whatsapp'} onChange={() => setPaymentOption('whatsapp')} className="accent-[#8B1E10] mt-1 shrink-0" />
            </label>

            {/* Cashfree Online Gateway */}
            <label
              onClick={() => setPaymentOption('cashfree')}
              className={`flex items-start justify-between p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                paymentOption === 'cashfree'
                  ? 'bg-red-50/70 border-[#8B1E10] text-[#8B1E10] ring-1 ring-[#8B1E10]'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-[#8B1E10] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-xs sm:text-sm block">Online Cards / NetBanking (Cashfree)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-medium">
                    Credit/Debit Cards (Visa, Mastercard, RuPay) & NetBanking via Cashfree Gateway
                  </p>
                </div>
              </div>
              <input type="radio" checked={paymentOption === 'cashfree'} onChange={() => setPaymentOption('cashfree')} className="accent-[#8B1E10] mt-1 shrink-0" />
            </label>
          </div>

          {/* 48-Hour Dispatch & Trust Badges */}
          <div className="bg-[#FAF6F0] p-3 rounded-xl border border-[#E8DFC9] text-[11px] text-stone-700 space-y-1 text-center font-medium">
            <p className="font-extrabold text-stone-900">
              ⏱️ Fresh Preparation Timeline: 48 Hours Dispatch
            </p>
            <p className="text-[10px] text-stone-500">
              Each jar is freshly cooked, cooled, oil-sealed, and dispatched from Tenali within 48 hours. Live courier tracking ID will be sent to your WhatsApp.
            </p>
          </div>

          {/* Submit Order Action */}
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(3)} className="w-full sm:w-auto">
              ← Back
            </Button>
            <Button
              onClick={handleSubmitOrder}
              isLoading={isSubmitting}
              className="w-full sm:flex-1 bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold py-3.5 sm:py-4 shadow-lg text-xs sm:text-sm"
            >
              {paymentOption === 'whatsapp'
                ? `Continue on WhatsApp — Pay ${formatCurrency(totalAmount)}`
                : `Pay ${formatCurrency(totalAmount)} via Cashfree`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
