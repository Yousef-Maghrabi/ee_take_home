'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import CamerasSection from './Cameras';
import PlansSection from './Plans';
import SensorsSection from './Sensors';
import ExtrasSection from './Extras';
import ReviewSection, { CartItem } from './Review';
import data from './data/index';

// Unified State Structure
interface SectionState {
  selectedVariant: string;
  quantities: Record<string, number>; // Tracks qty per variant name
}

type GlobalCartState = Record<string, SectionState>;

const LOCAL_STORAGE_KEY = 'security_builder_cart_state';

export default function SecurityBuilderPage() {
  // 1. Controls active step state (1 = Cameras, 2 = Plans, 3 = Sensors, 4 = Extras)
  const [activeStep, setActiveStep] = useState<number>(1);
  const checkoutBtnRef = useRef<HTMLButtonElement | null>(null);

  // Initialize cart state dynamically from dataset or localStorage
  const [cartState, setCartState] = useState<GlobalCartState>(() => {
    // Check localStorage first if running in the browser
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to load cart state from localStorage', e);
      }
    }

    const initialState: GlobalCartState = {};

    const allProducts = [
      ...data.cameras.map((item) => ({ ...item, category: 'cameras' })),
      ...data.plans.map((item) => ({ ...item, category: 'plan' })),
      ...data.sensors.map((item) => ({ ...item, category: 'sensors' })),
      ...data.extras.map((item) => ({ ...item, category: 'accessories' })),
    ];

    allProducts.forEach((item) => {
      const defaultVariant = item.variants?.[0]?.name || '';
      initialState[item.title] = {
        selectedVariant: defaultVariant,
        quantities: {},
      };
      
      // Initialize all variants to 0
      item.variants?.forEach((v: any) => {
        initialState[item.title].quantities[v.name] = 0;
      });
    });

    // Default pre-selected values matching design mockup
    if (initialState['Wyze Cam v4']) {
      const defVar = initialState['Wyze Cam v4'].selectedVariant;
      initialState['Wyze Cam v4'].quantities[defVar] = 1;
    }
    if (initialState['Wyze Cam Pan v3']) {
      const defVar = initialState['Wyze Cam Pan v3'].selectedVariant;
      initialState['Wyze Cam Pan v3'].quantities[defVar] = 2;
    }

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
        if (state && state.quantities) {
          // Push a separate cart item for EVERY variant that has a quantity > 0
          Object.entries(state.quantities).forEach(([variantName, qty]) => {
            if (qty > 0) {
              const variantInfo = item.variants.find((v: any) => v.name === variantName) || item.variants[0];

              items.push({
                id: `${item.title}-${variantName}`, // Unique ID for rendering
                productId: item.title,
                variantName: variantName,
                title: `${item.title}${variantName ? ` (${variantName})` : ''}`,
                category: cat,
                price: item.price,
                oldPrice: item.oldPrice,
                quantity: qty,
                image: variantInfo?.img,
              });
            }
          });
        }
      });
    });

    return items;
  }, [cartState]);

  // Handlers
  const handleQuantityChange = (title: string, arg2: string | number, arg3?: number) => {
    setCartState((prev) => {
      const productState = prev[title];
      if (!productState) return prev;

      const variantName = typeof arg2 === 'string' ? arg2 : productState.selectedVariant;
      const newQuantity = typeof arg2 === 'number' ? arg2 : (arg3 || 0);

      return {
        ...prev,
        [title]: {
          ...productState,
          quantities: {
            ...productState.quantities,
            [variantName]: Math.max(0, newQuantity),
          },
        },
      };
    });
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
      checkoutBtnRef.current?.focus();
      checkoutBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCheckout = () => {
    console.log('Final Order Submitted:', cartState);
  };

  // Save current cart configuration into localStorage
  const handleSaveForLater = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartState));
      alert('Your security setup has been saved successfully!');
    } catch (e) {
      console.error('Failed to save cart state to localStorage', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-1 md:p-8 lg:p-12">
      <div className="lg:pr-6 lg:pl-6 max-w-full mx-auto space-y-6">
        {/* Top Title Banner */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
            Let's get started!
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Build your custom home security bundle in 4 easy steps.
          </p>
        </header>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Step Sections */}
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
              items={cartItems}
              shippingFee={5.99}
              isShippingFree={true}
              monthlyFinancingRate={19.19}
              onQuantityChange={handleQuantityChange}
              onCheckout={handleCheckout}
              onSaveForLater={handleSaveForLater}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}