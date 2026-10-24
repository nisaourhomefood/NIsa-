'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin');
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Invalid admin credentials. Please check email and password.');
    } catch (err) {
      console.error(err);
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E8DFC9] rounded-3xl p-8 space-y-6 shadow-2xl">
        
        {/* Header with Official Logo */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 mx-auto">
            <Image
              src="/nisaralogo.png"
              alt="NISA Admin Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8B1E10] bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
              Control Portal
            </span>
            <h1 className="text-2xl font-extrabold text-stone-900 mt-1">
              NISA Owner Login
            </h1>
            <p className="text-xs text-stone-600 font-medium">
              Manage products, orders, pricing, and homepage content for Tenali kitchen.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <Input
            label="Admin Email Address *"
            type="email"
            placeholder="admin@nisafoods.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password *"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            isLoading={loading}
            className="w-full bg-[#8B1E10] hover:bg-[#72160B] text-white font-extrabold py-3.5 shadow-md"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="pt-2 text-center text-[11px] text-stone-500 font-semibold flex items-center justify-center gap-1.5 border-t border-stone-100">
          <ShieldCheck className="w-4 h-4 text-emerald-700" /> Protected Superadmin Session
        </div>

      </div>
    </div>
  );
}
