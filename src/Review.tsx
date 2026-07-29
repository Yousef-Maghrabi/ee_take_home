'use client';

import React from 'react';
import { Header, Body, OutlinedButton } from './components/index';
import { Truck, ShieldCheck } from 'lucide-react';

export interface CartItem {
  id: string;
  title: string;
  category: 'cameras' | 'sensors' | 'accessories' | 'plan';
  price: number;
  oldPrice?: number | null;
  quantity: number;
  image?: string;
  isFree?: boolean;
}

export interface ReviewSectionProps {
  items: CartItem[];
  shippingFee?: number;
  isShippingFree?: boolean;
  monthlyFinancingRate?: number;
  onQuantityChange?: (id: string, newQuantity: number) => void;
  onCheckout?: () => void;
  onSaveForLater?: () => void;
}

export default function ReviewSection({
  items = [],
  shippingFee = 5.99,
  isShippingFree = true,
  monthlyFinancingRate = 19.19,
  onQuantityChange,
  onCheckout,
  onSaveForLater,
}: ReviewSectionProps) {
  // Group active cart items by category
  const activeItems = items.filter((item) => item.quantity > 0);
  const categories = ['cameras', 'sensors', 'accessories', 'plan'] as const;

  const groupedItems = categories.map((cat) => ({
    category: cat,
    items: activeItems.filter((i) => i.category === cat),
  }));

  // Calculations
  const subtotal = activeItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalSubtotal = activeItems.reduce(
    (sum, item) => sum + (item.oldPrice ?? item.price) * item.quantity,
    0
  );
  
  const totalSavings = Math.max(0, originalSubtotal - subtotal);
  const finalTotal = subtotal + (isShippingFree ? 0 : shippingFee);

  return (
    <aside className="w-full max-w-md bg-sky-50/70 p-6 rounded-3xl border border-sky-100 flex flex-col gap-5 text-slate-800">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
          Review
        </span>
        <Header as="h2" className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Your security system
        </Header>
        <Body className="text-xs text-slate-500 leading-normal">
          Review your personalized protection system designed to keep what matters most safe.
        </Body>
      </div>

      {/* Grouped Cart Items */}
      <div className="space-y-5">
        {groupedItems.map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.category} className="space-y-3 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">
                  {group.category}
                </span>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      {/* Left: Thumbnail & Title */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.image ? (
                          <div className="w-9 h-9 rounded-lg bg-white p-1 border border-slate-200/80 flex items-center justify-center shrink-0">
                            <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                          </div>
                        ) : null}
                        <span className="text-xs font-semibold text-slate-800 truncate">
                          {item.title}
                        </span>
                      </div>

                      {/* Right: Stepper & Pricing */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Stepper */}
                        {group.category !== 'plan' && (
                          <div className="flex items-center gap-1.5 bg-slate-100/80 px-1 py-0.5 rounded-md border border-slate-200">
                            <button
                              type="button"
                              onClick={() => onQuantityChange?.(item.id, item.quantity - 1)}
                              className="w-4 h-4 flex items-center justify-center text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-slate-800 w-3 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onQuantityChange?.(item.id, item.quantity + 1)}
                              className="w-4 h-4 flex items-center justify-center text-xs font-bold text-slate-500 hover:text-slate-800"
                            >
                              +
                            </button>
                          </div>
                        )}

                        {/* Price */}
                        <div className="text-right">
                          {item.isFree ? (
                            <span className="text-xs font-bold text-indigo-600 block">FREE</span>
                          ) : (
                            <>
                              {item.oldPrice && item.oldPrice > item.price && (
                                <span className="text-[10px] text-slate-400 line-through block leading-none">
                                  ${(item.oldPrice * item.quantity).toFixed(2)}
                                </span>
                              )}
                              <span className="text-xs font-bold text-indigo-600 block">
                                ${(item.price * item.quantity).toFixed(2)}
                                {group.category === 'plan' && '/mo'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}

        {/* Fast Shipping Row */}
        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-600">
              <Truck size={16} />
            </div>
            <span className="text-xs font-bold text-slate-800">Fast Shipping</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 line-through block leading-none">
              ${shippingFee.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-indigo-600 block">
              {isShippingFree ? 'FREE' : `$${shippingFee.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Total & Checkout Section */}
      <div className="pt-4 border-t border-slate-200/60 space-y-4">
        {/* Total Price Display */}
        <div className="flex items-end justify-between">
          {/* Satisfaction Seal Badge */}
          <div className="relative w-14 h-14 bg-indigo-600 rounded-full flex flex-col items-center justify-center text-center p-1 text-white shadow-md border-2 border-dashed border-white">
            <span className="text-[9px] font-black uppercase leading-tight">100%</span>
            <span className="text-[7px] font-medium leading-none">Satisfaction</span>
            <span className="text-[6px] opacity-80 leading-tight">Guarantee</span>
          </div>

          <div className="text-right space-y-1">
            {monthlyFinancingRate > 0 && (
              <span className="inline-block bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                as low as ${monthlyFinancingRate.toFixed(2)}/mo
              </span>
            )}

            <div className="flex items-baseline justify-end gap-2">
              {totalSavings > 0 && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  ${originalSubtotal.toFixed(2)}
                </span>
              )}
              <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Savings Alert Banner */}
        {totalSavings > 0 && (
          <div className="bg-emerald-100/70 border border-emerald-200 text-emerald-700 text-[11px] font-semibold text-center py-1.5 rounded-lg">
            Congrats! You're saving ${totalSavings.toFixed(2)} on your security bundle!
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-2">
          <OutlinedButton
            onClick={onCheckout}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl transition-colors shadow-sm"
          >
            Checkout
          </OutlinedButton>

          <button
            type="button"
            onClick={onSaveForLater}
            className="w-full text-center text-xs text-slate-500 underline font-medium hover:text-slate-800 transition-colors"
          >
            Save my system for later
          </button>
        </div>
      </div>
    </aside>
  );
}