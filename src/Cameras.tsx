'use client';

import React, { useState } from 'react';
import { ProductCard } from './components/product';
import { Header, OutlinedButton } from './components/index';
import data from './data/index';
import { Camera } from 'lucide-react';

interface ProductVariant {
  name: string;
  img: string;
}

interface CameraItem {
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  variants: ProductVariant[];
}

// FIXED: Matches the new global state shape from SecurityBuilderPage
interface CartItemState {
  selectedVariant: string;
  quantities: Record<string, number>; 
}

interface CamerasSectionProps {
  cartState: Record<string, CartItemState>;
  // FIXED: Signature now expects the variantName to update the correct dictionary key
  onQuantityChange: (title: string, variantName: string, newQuantity: number) => void;
  onVariantChange: (title: string, variantName: string) => void;
  onNext: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function CamerasSection({
  cartState,
  onQuantityChange,
  onVariantChange,
  onNext,
  isOpen,
  onToggle,
}: CamerasSectionProps) {
  const cameras: CameraItem[] = data.cameras;

  // Local state fallback if uncontrolled
  const [internalOpen, setInternalOpen] = useState(true);
  const isProductsOpen = isOpen ?? internalOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((prev) => !prev);
    }
  };

  // FIXED: Sum up all quantities across all variants for the badge
  const totalSelectedCount = cameras.reduce((sum, item) => {
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
            Step 1 of 4
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
              <Camera className="w-4 h-4" />
            </div>
            <Header as="h2" className="text-2xl font-bold text-slate-900">
              Choose your cameras
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
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
              {cameras.slice(0, 4).map((camera, idx) => {
                // FIXED: Extract the active variant and its specific quantity
                const state = cartState[camera.title];
                const activeVariantName = state?.selectedVariant || camera.variants[0]?.name || '';
                const quantity = state?.quantities?.[activeVariantName] || 0;
    
                return (
                  <ProductCard
                    key={camera.title}
                    index={idx}
                    title={camera.title}
                    description={camera.description}
                    price={camera.price}
                    oldPrice={camera.oldPrice}
                    variants={camera.variants}
                    quantity={quantity} // Passes ONLY the quantity for the active variant
                    selectedVariantName={activeVariantName}
                    onQuantityChange={(qty: number) => onQuantityChange(camera.title, activeVariantName, qty)}
                    onSelectVariant={(variantName: string) =>
                      onVariantChange(camera.title, variantName)
                    }
                  />
                );
              })}
            </div>
    
            {/* Centered 5th Item (if present in dataset) */}
            {cameras[4] && (() => {
              const camera = cameras[4];
              const state = cartState[camera.title];
              const activeVariantName = state?.selectedVariant || camera.variants[0]?.name || '';
              const quantity = state?.quantities?.[activeVariantName] || 0;

              return (
                <div className="flex justify-center">
                  <div className="w-full md:w-1/2">
                    <ProductCard
                      index={4}
                      title={camera.title}
                      description={camera.description}
                      price={camera.price}
                      oldPrice={camera.oldPrice}
                      variants={camera.variants}
                      quantity={quantity}
                      selectedVariantName={activeVariantName}
                      onQuantityChange={(qty: number) => onQuantityChange(camera.title, activeVariantName, qty)}
                      onSelectVariant={(variantName: string) =>
                        onVariantChange(camera.title, variantName)
                      }
                    />
                  </div>
                </div>
              );
            })()}
    
            <div className="pt-2 flex justify-center">
              <OutlinedButton onClick={onNext}>
                Next: Choose your plan
              </OutlinedButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}