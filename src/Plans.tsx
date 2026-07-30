'use client';

import React, { useState } from 'react';
import { ProductCard } from './components/product';
import { Header, OutlinedButton } from './components/index';
import data from './data/index';
import { Shield } from 'lucide-react';

// Type definitions matching your schema
interface ProductVariant {
  name: string;
  img: string;
}

interface PlanItem {
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  variants: ProductVariant[];
}

// FIXED: Matches the new global state shape
interface CartItemState {
  selectedVariant: string;
  quantities: Record<string, number>;
}

interface PlansSectionProps {
  cartState: Record<string, CartItemState>;
  // FIXED: Signature now expects the variantName to update the correct dictionary key
  onQuantityChange: (title: string, variantName: string, newQuantity: number) => void;
  onVariantChange: (title: string, variantName: string) => void;
  onNext: () => void;
  isOpen?: boolean; // Connects to parent accordion state
  onToggle?: () => void;
}

export default function PlansSection({
  cartState,
  onQuantityChange,
  onVariantChange,
  onNext,
  isOpen,
  onToggle,
}: PlansSectionProps) {
  const plans: PlanItem[] = data.plans;

  // Sync with controlled `isOpen` prop from SecurityBuilderPage or fallback to local state
  const [internalOpen, setInternalOpen] = useState(false);
  const isProductsOpen = isOpen ?? internalOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  // FIXED: Sum up all quantities across all variants for the badge
  const totalSelectedCount = plans.reduce((sum, item) => {
    const productState = cartState[item.title];
    if (!productState || !productState.quantities) return sum;
    
    const productTotal = Object.values(productState.quantities).reduce((acc, qty) => acc + qty, 0);
    return sum + productTotal;
  }, 0);

  return (
    <section className="w-full max-w-6xl mx-auto sm:pl-1 sm:pr-2 md:pl-6 md:pr-0 rounded-2xl">
      {/* Top Header Bar */}
      <div className="space-y-4 mb-4">
        {/* Step Counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Step 2 of 4
          </span>
        </div>
    
        {/* Divider Line */}
        <div className="h-[1px] w-full bg-slate-200" />
      </div>
    
      {/* Active Area (Title Row + Products) */}
      <div
        className={`rounded-2xl transition-all duration-200 ${
          isProductsOpen ? 'bg-slate-100 p-6' : 'bg-transparent p-0'
        }`}
      >
        {/* Icon, Title, and Toggle Button Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <Header as="h2" className="text-2xl font-bold text-slate-900">
              Choose your protection plan
            </Header>
          </div>
    
          {/* Selected Badge & Toggle Trigger */}
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-indigo-700 rounded-full text-sm font-semibold border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer shrink-0"
            aria-expanded={isProductsOpen}
          >
            <span>{totalSelectedCount} selected</span>
            <span
              className={`text-xs transition-transform duration-200 ${
                isProductsOpen ? 'rotate-0' : 'rotate-180'
              }`}
            >
              ▲
            </span>
          </button>
        </div>
    
        {/* Products & CTA */}
        {isProductsOpen && (
          <div className="mt-6 space-y-6">
            {/* Grid Layout: 2 Columns for first 4 items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plans.slice(0, 4).map((plan, idx) => {
                // FIXED: Extract the active variant and its specific quantity
                const state = cartState[plan.title];
                const activeVariantName = state?.selectedVariant || plan.variants[0]?.name || '';
                const quantity = state?.quantities?.[activeVariantName] || 0;
    
                return (
                  <ProductCard
                    key={plan.title}
                    index={idx}
                    title={plan.title}
                    description={plan.description}
                    price={plan.price}
                    oldPrice={plan.oldPrice}
                    variants={plan.variants}
                    quantity={quantity} // Passes ONLY the quantity for the active variant
                    selectedVariantName={activeVariantName}
                    onQuantityChange={(qty: number) => onQuantityChange(plan.title, activeVariantName, qty)}
                    onSelectVariant={(variantName: string) =>
                      onVariantChange(plan.title, variantName)
                    }
                  />
                );
              })}
            </div>
    
            {/* Centered 5th Item (if present in dataset) */}
            {plans[4] && (() => {
              const plan = plans[4];
              const state = cartState[plan.title];
              const activeVariantName = state?.selectedVariant || plan.variants[0]?.name || '';
              const quantity = state?.quantities?.[activeVariantName] || 0;

              return (
                <div className="flex justify-center">
                  <div className="w-full md:w-1/2">
                    <ProductCard
                      index={4}
                      title={plan.title}
                      description={plan.description}
                      price={plan.price}
                      oldPrice={plan.oldPrice}
                      variants={plan.variants}
                      quantity={quantity}
                      selectedVariantName={activeVariantName}
                      onQuantityChange={(qty: number) => onQuantityChange(plan.title, activeVariantName, qty)}
                      onSelectVariant={(variantName: string) =>
                        onVariantChange(plan.title, variantName)
                      }
                    />
                  </div>
                </div>
              );
            })()}
    
            <div className="pt-2 flex justify-center">
              <OutlinedButton onClick={onNext}>
                Next: Choose your sensors
              </OutlinedButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}