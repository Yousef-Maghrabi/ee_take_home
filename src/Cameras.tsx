'use client';

import React, { useState } from 'react';
import { ProductCard } from './components/product';
import { Header, OutlinedButton } from './components/index';
import data from './data/index';
import { Camera } from 'lucide-react';

// Type definitions matching your schema
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

interface CartItemState {
  quantity: number;
  selectedVariant: string;
}

interface CamerasSectionProps {
  cartState: Record<string, CartItemState>;
  onQuantityChange: (title: string, newQuantity: number) => void;
  onVariantChange: (title: string, variantName: string) => void;
}

export default function CamerasSection({
  cartState,
  onQuantityChange,
  onVariantChange,
}: CamerasSectionProps) {
  const cameras: CameraItem[] = data.cameras;

  // Controls whether the products dropdown/grid is expanded
  const [isProductsOpen, setIsProductsOpen] = useState(true);

  // Calculate total selected items across this section's cameras only
  // (scoped against the shared cartState, not every product in the app)
  const totalSelectedCount = cameras.reduce(
    (sum, item) => sum + (cartState[item.title]?.quantity || 0),
    0
  );

  return (
    <section className="w-full max-w-6xl mx-auto p-6 bg-slate-100 rounded-2xl">
      {/* Top Header Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Step 1 of 4
          </span>

          {/* Selected Badge - toggles the products dropdown */}
          <button
            type="button"
            onClick={() => setIsProductsOpen((prev) => !prev)}
            className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
            aria-expanded={isProductsOpen}
          >
            <span>{totalSelectedCount} selected</span>
            <span
              className="text-xs transition-transform duration-200"
              style={{ transform: isProductsOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
            >
              ▲
            </span>
          </button>
        </div>

        <div className="h-[1px] w-full bg-slate-200" />
      </div>

      {isProductsOpen && (
        <>
          <div className="flex items-center gap-3 pt-2 pb-3">
            {/* Camera Icon Placeholder */}
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold">
              <Camera /> 
            </div>
            <Header as="h2" className="text-2xl font-bold text-slate-900">
              Choose your cameras
            </Header>
          </div>
          {/* Grid Layout: 2 Columns for first 4 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cameras.slice(0, 4).map((camera, idx) => {
              const state = cartState[camera.title] || {
                quantity: 0,
                selectedVariant: camera.variants[0]?.name || '',
              };

              return (
                <ProductCard
                  key={camera.title}
                  index={idx}
                  title={camera.title}
                  description={camera.description}
                  price={camera.price}
                  oldPrice={camera.oldPrice}
                  variants={camera.variants}
                  quantity={state.quantity}
                  selectedVariantName={state.selectedVariant}
                  onQuantityChange={(qty: number) => onQuantityChange(camera.title, qty)}
                  onSelectVariant={(variantName: string) =>
                    onVariantChange(camera.title, variantName)
                  }
                />
              );
            })}
          </div>

          {/* Centered 5th Item (if present in dataset) */}
          {cameras[4] && (
            <div className="mt-6 flex justify-center">
              <div className="w-full md:w-1/2">
                <ProductCard
                  index={4}
                  title={cameras[4].title}
                  description={cameras[4].description}
                  price={cameras[4].price}
                  oldPrice={cameras[4].oldPrice}
                  variants={cameras[4].variants}
                  quantity={cartState[cameras[4].title]?.quantity || 0}
                  selectedVariantName={
                    cartState[cameras[4].title]?.selectedVariant ||
                    cameras[4].variants[0]?.name
                  }
                  onQuantityChange={(qty: number) => onQuantityChange(cameras[4].title, qty)}
                  onSelectVariant={(variantName: string) =>
                    onVariantChange(cameras[4].title, variantName)
                  }
                />
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <OutlinedButton
              onClick={() => {
                // Step progression logic
              }}
            >
              Next: Choose your plan
            </OutlinedButton>
          </div>
        </>
      )}

      {/* Bottom CTA Button */}
      
    </section>
  );
}