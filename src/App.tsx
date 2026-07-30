'use client';

import React, { useState, useMemo, useRef } from 'react';
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
  // 1. Controls active step state (1 = Cameras, 2 = Plans, 3 = Sensors, 4 = Extras)
  // Default is step 1 open, others closed
  const [activeStep, setActiveStep] = useState<number>(1);

  // Ref to target the checkout button in ReviewSection
  const checkoutBtnRef = useRef<HTMLButtonElement | null>(null);

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

  // Step progression logic
  const handleNextStep = (currentStep: number) => {
    if (currentStep < 4) {
      setActiveStep(currentStep + 1);
    } else {
      // Step 4 (Extras) complete: focus Checkout button
      checkoutBtnRef.current?.focus();
      checkoutBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCheckout = () => {
    console.log('Final Order Submitted:', cartState);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 lg:p-12">
      <div className="lg:pr-24 lg:pl-24 max-w-full mx-auto space-y-6">
        {/* Top Title Banner */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Let's get started!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Build your custom home security bundle in 4 easy steps.
          </p>
        </header>

        {/* Main 2-Column Layout on Desktop / Single Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Step Sections (Accordion Stack) */}
          <main className="lg:col-span-8 space-y-6 pt-4 pb-4 rounded-2xl w-full">
            <CamerasSection
              isOpen={activeStep === 1}
              onToggle={() => setActiveStep(activeStep === 1 ? 0 : 1)}
              onNext={() => handleNextStep(1)}
              cartState={cartState}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
            />
            <PlansSection
              isOpen={activeStep === 2}
              onToggle={() => setActiveStep(activeStep === 2 ? 0 : 2)}
              onNext={() => handleNextStep(2)}
              cartState={cartState}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
            />
            <SensorsSection
              isOpen={activeStep === 3}
              onToggle={() => setActiveStep(activeStep === 3 ? 0 : 3)}
              onNext={() => handleNextStep(3)}
              cartState={cartState}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
            />
            <ExtrasSection
              isOpen={activeStep === 4}
              onToggle={() => setActiveStep(activeStep === 4 ? 0 : 4)}
              onNext={() => handleNextStep(4)}
              cartState={cartState}
              onQuantityChange={handleQuantityChange}
              onVariantChange={handleVariantChange}
            />
          </main>

          {/* Right Side: Sticky Review Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 w-full">
            <ReviewSection
              ref={checkoutBtnRef}
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