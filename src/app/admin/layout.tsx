'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Boxes,
  Tag,
  BookOpen,
  Star,
  Settings,
  Globe,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If viewing admin login page, bypass sidebar layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const adminNav = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Variants', href: '/admin/products', icon: Package },
    { name: 'Order Fulfillment', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customer CRM', href: '/admin/customers', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Combo Management', href: '/admin/combos', icon: Boxes },
    { name: 'Discounts & Coupons', href: '/admin/discounts', icon: Tag },
    { name: 'Content & Articles', href: '/admin/content', icon: BookOpen },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
    { name: 'SEO & Meta Tags', href: '/admin/seo', icon: Globe },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col md:flex-row">
      
      {/* Mobile Top Header Bar */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <Image src="/nisaralogo.png" alt="NISA" fill className="object-contain" />
          </div>
          <div>
            <span className="font-black text-[#8B1E10] text-sm block leading-none">NISA Admin</span>
            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Tenali Portal</span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 animate-fadeIn"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Desktop Static + Mobile Slide-In Drawer From Left) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-stone-200 p-5 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-out md:static md:w-64 md:shadow-none md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-5">
          
          {/* Header (with Close X button on mobile) */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image src="/nisaralogo.png" alt="NISA Logo" fill className="object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-[#8B1E10] text-sm block">NISA Admin</span>
                <span className="text-[10px] text-[#C68B27] font-bold uppercase tracking-wider">
                  Tenali Owner Portal
                </span>
              </div>
            </div>

            {/* Mobile Close X Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] pr-1 no-scrollbar">
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#8B1E10] text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-100 hover:text-[#8B1E10]'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions: Back to Storefront & Logout */}
        <div className="pt-4 border-t border-stone-200 space-y-1.5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-xs text-stone-600 hover:text-[#8B1E10] font-bold transition-colors py-1.5 px-2 rounded-lg hover:bg-stone-50"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-600 hover:text-red-800 font-bold transition-colors py-1.5 px-2 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-3 sm:p-5 md:p-8 overflow-y-auto min-h-screen">
        {children}
      </main>

    </div>
  );
}
