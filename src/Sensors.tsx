'use client';

import React, { useState } from 'react';
import { ProductCard } from './components/product';
import { Header, OutlinedButton } from './components/index';
import data from './data/index';
import { Activity } from 'lucide-react';

// Type definitions matching your schema
interface ProductVariant {
  name: string;
  img: string;
}

interface SensorItem {
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

interface SensorsSectionProps {
  cartState: Record<string, CartItemState>;
  onQuantityChange: (title: string, newQuantity: number) => void;
  onVariantChange: (title: string, variantName: string) => void;
  onNext: () => void;
  isOpen?: boolean; // Connects to parent accordion state
  onToggle?: () => void;
}

export default function SensorsSection({
  cartState,
  onQuantityChange,
  onVariantChange,
  onNext,
  isOpen,
  onToggle,
}: SensorsSectionProps) {
  const sensors: SensorItem[] = data.sensors;

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

  // Calculate total selected items across this section's sensors only
  const totalSelectedCount = sensors.reduce(
    (sum, item) => sum + (cartState[item.title]?.quantity || 0),
    0
  );

  return (
    <section className="w-full max-w-6xl mx-auto pl-6 pr-6 rounded-2xl">
      {/* Top Header Bar */}
      <div className="space-y-4 mb-4">
        {/* Step Counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Step 3 of 4
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
              <Activity className="w-4 h-4" />
            </div>
            <Header as="h2" className="text-2xl font-bold text-slate-900">
              Choose your sensors
            </Header>
          </div>
    
          {/* Selected Badge & Toggle Trigger */}
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer shrink-0"
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
              {sensors.slice(0, 4).map((sensor, idx) => {
                const state = cartState[sensor.title] || {
                  quantity: 0,
                  selectedVariant: sensor.variants[0]?.name || '',
                };
    
                return (
                  <ProductCard
                    key={sensor.title}
                    index={idx}
                    title={sensor.title}
                    description={sensor.description}
                    price={sensor.price}
                    oldPrice={sensor.oldPrice}
                    variants={sensor.variants}
                    quantity={state.quantity}
                    selectedVariantName={state.selectedVariant}
                    onQuantityChange={(qty: number) => onQuantityChange(sensor.title, qty)}
                    onSelectVariant={(variantName: string) =>
                      onVariantChange(sensor.title, variantName)
                    }
                  />
                );
              })}
            </div>
    
            {/* Centered 5th Item (if present in dataset) */}
            {sensors[4] && (
              <div className="flex justify-center">
                <div className="w-full md:w-1/2">
                  <ProductCard
                    index={4}
                    title={sensors[4].title}
                    description={sensors[4].description}
                    price={sensors[4].price}
                    oldPrice={sensors[4].oldPrice}
                    variants={sensors[4].variants}
                    quantity={cartState[sensors[4].title]?.quantity || 0}
                    selectedVariantName={
                      cartState[sensors[4].title]?.selectedVariant ||
                      sensors[4].variants[0]?.name
                    }
                    onQuantityChange={(qty: number) => onQuantityChange(sensors[4].title, qty)}
                    onSelectVariant={(variantName: string) =>
                      onVariantChange(sensors[4].title, variantName)
                    }
                  />
                </div>
              </div>
            )}
    
            <div className="pt-2 flex justify-center">
              <OutlinedButton onClick={onNext}>
                Next: Choose your extras
              </OutlinedButton>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}