'use client';

import React, { useState, useMemo } from 'react';
import CamerasSection from './Cameras';
import PlansSection from './Plans';
import SensorsSection from './Sensors';
import ExtrasSection from './Extras';
import ReviewSection, { CartItem } from './Review';
import data from './data/index';

// Unified State Structure
interface SectionState {
  quantity: number;
  selectedVariant: string;
}

type GlobalCartState = Record<string, SectionState>;

export default function SecurityBuilderPage() {
  // Initialize cart state for all categories dynamically from datasets
  const [cartState, setCartState] = useState<GlobalCartState>(() => {
    const initialState: GlobalCartState = {};

    const allProducts = [
      ...data.cameras.map((item) => ({ ...item, category: 'cameras' })),
      ...data.plans.map((item) => ({ ...item, category: 'plan' })),
      ...data.sensors.map((item) => ({ ...item, category: 'sensors' })),
      ...data.extras.map((item) => ({ ...item, category: 'accessories' })),
    ];

    allProducts.forEach((item) => {
      initialState[item.title] = {
        quantity: 0,
        selectedVariant: item.variants?.[0]?.name || '',
      };
    });

    // Default pre-selected values matching design mockup
    if (initialState['Wyze Cam v4']) initialState['Wyze Cam v4'].quantity = 1;
    if (initialState['Wyze Cam Pan v3']) initialState['Wyze Cam Pan v3'].quantity = 2;

    return initialState;
  });

  // Convert global state into CartItem array for the ReviewSection
  const cartItems: CartItem[] = useMemo(() => {
    const items: CartItem[] = [];

    const categories = [
      { list: data.cameras, cat: 'cameras' as const },
      { list: data.sensors, cat: 'sensors' as const },
      { list: data.extras, cat: 'accessories' as const },
      { list: data.plans, cat: 'plan' as const },
    ];

    categories.forEach(({ list, cat }) => {
      list.forEach((item) => {
        const state = cartState[item.title];
        if (state && state.quantity > 0) {
          const activeVariant =
            item.variants.find((v) => v.name === state.selectedVariant) || item.variants[0];

          items.push({
            id: item.title,
            title: `${item.title}${state.selectedVariant ? ` (${state.selectedVariant})` : ''}`,
            category: cat,
            price: item.price,
            oldPrice: item.oldPrice,
            quantity: state.quantity,
            image: activeVariant?.img,
          });
        }
      });
    });

    return items;
  }, [cartState]);

  // Handlers
  const handleQuantityChange = (title: string, newQuantity: number) => {
    setCartState((prev) => ({
      ...prev,
      [title]: {
        ...prev[title],
        quantity: Math.max(0, newQuantity),
      },
    }));
  };

  const handleVariantChange = (title: string, variantName: string) => {
    setCartState((prev) => ({
      ...prev,
      [title]: {
        ...prev[title],
        selectedVariant: variantName,
      },
    }));
  };

  const handleCheckout = () => {
    console.log('Final Order Submitted:', cartState);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Title Banner */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Let's get started!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Build your custom home security bundle in 4 easy steps.
          </p>
        </header>

        {/* Main 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Step Sections (Accordion Stack) */}
          <main className="lg:col-span-8 space-y-6 bg-slate-100">
            <CamerasSection
              cartState={cartState}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
            />
            <PlansSection
              cartState={cartState}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
            />
            <SensorsSection
              cartState={cartState}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
            />
            <ExtrasSection
              cartState={cartState}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
            />
          </main>

          {/* Right Side: Sticky Review Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8">
            <ReviewSection
              items={cartItems}
              shippingFee={5.99}
              isShippingFree={true}
              monthlyFinancingRate={19.19}
              onQuantityChange={handleQuantityChange}
              onCheckout={handleCheckout}
              onSaveForLater={() => console.log('Saved setup')}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}