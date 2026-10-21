'use client';

import React, { useState } from 'react';
import { Star, Check, X, Trash2, ShieldCheck } from 'lucide-react';
import { INITIAL_REVIEWS } from '@/lib/data/mock-products';
import { Review } from '@/types/database.types';
import { Button } from '@/components/ui/button';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  const toggleApproval = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_approved: !r.is_approved } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 border-b border-stone-200 pb-4 sm:pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900">Review Moderation Queue</h1>
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium mt-0.5">
            Approve, reject, or feature verified customer reviews displayed on product pages.
          </p>
        </div>
      </div>

      {/* Main Content: Mobile Cards + Desktop Table */}
      <div className="bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xs">
        {/* Mobile View: Cards */}
        <div className="block md:hidden space-y-3">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-stone-50/70 border border-stone-200/80 rounded-xl p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm">{rev.customer_name}</h4>
                  <div className="flex items-center gap-1 text-amber-600 font-extrabold text-xs mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating} / 5</span>
                    {rev.is_verified_purchase && (
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5 text-[10px] ml-1.5 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                  </div>
                </div>

                <button onClick={() => toggleApproval(rev.id)}>
                  {rev.is_approved ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Approved
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#8B1E10]/10 text-[#8B1E10] border border-[#8B1E10]/20">
                      Pending
                    </span>
                  )}
                </button>
              </div>

              <div className="text-xs pt-1">
                <strong className="block text-stone-900 font-bold text-xs">{rev.title}</strong>
                <p className="text-[#8B1E10] italic text-[11px] font-medium line-clamp-2 mt-0.5">"{rev.comment}"</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/60 text-xs">
                <button
                  onClick={() => toggleApproval(rev.id)}
                  className="px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200/60 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> {rev.is_approved ? 'Unpublish' : 'Approve'}
                </button>
                <button
                  onClick={() => deleteReview(rev.id)}
                  className="p-1 text-stone-400 hover:text-red-600 rounded"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-[#8B1E10] uppercase font-extrabold text-[10px] tracking-wider border-b border-stone-200">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Review Title & Comment</th>
                <th className="p-3">Verified Buyer</th>
                <th className="p-3">Approval Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-stone-50">
                  <td className="p-3 font-extrabold text-stone-900">{rev.customer_name}</td>
                  <td className="p-3 font-extrabold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {rev.rating} / 5
                  </td>
                  <td className="p-3 max-w-xs">
                    <strong className="block text-stone-900 font-bold">{rev.title}</strong>
                    <span className="text-[#8B1E10] italic text-[11px] font-medium line-clamp-2">"{rev.comment}"</span>
                  </td>
                  <td className="p-3">
                    {rev.is_verified_purchase ? (
                      <span className="text-emerald-800 font-bold flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified
                      </span>
                    ) : (
                      <span className="text-stone-400 text-[11px]">Guest</span>
                    )}
                  </td>
                  <td className="p-3">
                    <button onClick={() => toggleApproval(rev.id)}>
                      {rev.is_approved ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Approved & Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8B1E10]/10 text-[#8B1E10] border border-[#8B1E10]/20">
                          Pending Moderation
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => toggleApproval(rev.id)}
                      className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                      title="Toggle approval"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteReview(rev.id)}
                      className="p-1 text-stone-400 hover:text-red-600 rounded"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
