'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs uppercase font-extrabold text-red-900 tracking-widest">
          Customer Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
          Get in Touch With NISA
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium">
          Have a question about your order, custom bulk orders, or corporate gifting? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-8 space-y-6 shadow-xs">
          <h2 className="text-xl font-extrabold text-stone-900 border-b border-stone-200 pb-3">
            Kitchen & Support Contact
          </h2>

          <div className="space-y-4 text-xs text-stone-700 font-medium">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 text-sm font-bold">Tenali Kitchen Address:</strong>
                <p>NISA Foods, Door No. 4-12-88, Guntur Road, Tenali - 522201, Guntur District, Andhra Pradesh.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 text-sm font-bold">Phone / WhatsApp Support:</strong>
                <p>+91 75693 44938 (Mon-Sat, 9 AM - 7 PM IST)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 text-sm font-bold">Email Address:</strong>
                <p>nisaourhomefood@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 text-sm font-bold">Operating Hours:</strong>
                <p>Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-3xl p-8 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-700 mx-auto" />
              <h3 className="text-xl font-extrabold text-stone-900">Message Sent Successfully!</h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto font-medium">
                Thank you for reaching out. Our customer care team in Tenali will reply within 24 hours.
              </p>
              <Button onClick={() => setSubmitted(false)} className="bg-red-900 text-white font-bold">
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-extrabold text-stone-900 border-b border-stone-200 pb-3">
                Send Us a Message
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Your Name *" placeholder="Srinivas Rao" required />
                <Input label="Mobile Number *" placeholder="10-digit number" required />
              </div>

              <Input label="Email Address *" type="email" placeholder="care@example.com" required />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Your Query or Feedback *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you with NISA pickles or orders?"
                  className="w-full rounded-xl border border-[#D8CCA8] bg-white px-3.5 py-2.5 text-xs text-stone-900 focus:border-[#8B1E10] focus:outline-none focus:ring-2 focus:ring-[#8B1E10]/20 transition-colors"
                />
              </div>

              <Button type="submit" className="w-full bg-red-900 hover:bg-red-950 text-white font-bold">
                <Send className="w-4 h-4 mr-2" /> Send Message
              </Button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
