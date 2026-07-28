"use client";

import React, { useState } from "react";
import data, { BundleData, Product, Variant } from "./data/bundle";
import st from "./theme"; // assuming st styling object is here
import {
  Header,
  Body,
  Small,
  Price,
  Badge,
  ProductCard,
  PlanCard,
  SensorCard,
  ExtraProtectionCard,
  FilledButton,
  OutlinedButton,
} from "./components/index"; // 

export interface CartItemState {
  productId: string;
  variantId: string | null;
  quantity: number;
  category: string;
}

export function Products() {
  // Initialize cart with initialCart from JSON
  const [cart, setCart] = useState<CartItemState[]>(data.initialCart);
  // Track selected variants for products (e.g. { "cam-smart-hd": "white" })
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    data.initialCart.forEach((item: any) => {
      if (item.variantId) {
        initial[item.productId] = item.variantId;
      }
    });
    return initial;
  });

  // Helper to retrieve quantity for a product/variant
  const getItemQuantity = (productId: string, variantId?: string | null) => {
    const item = cart.find(
      (c) => c.productId === productId && (variantId === undefined || c.variantId === variantId)
    );
    return item ? item.quantity : 0;
  };

  // Handler to update quantity (stepper logic)
  const handleQuantityChange = (
    product: Product,
    category: string,
    delta: number,
    variantId: string | null = null
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );

      if (existingIndex > -1) {
        const newQty = prevCart[existingIndex].quantity + delta;
        if (newQty <= 0) {
          // Remove from cart if quantity hits 0
          return prevCart.filter((_, idx) => idx !== existingIndex);
        }
        const updated = [...prevCart];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else if (delta > 0) {
        // Add new item to cart
        return [
          ...prevCart,
          {
            productId: product.id,
            variantId: variantId,
            quantity: delta,
            category: category,
          },
        ];
      }
      return prevCart;
    });
  };

  // Handler for single-selection items (radio logic like Plans/Protection)
  const handleSingleSelect = (product: Product, category: string) => {
    setCart((prevCart) => {
      // Remove any existing products in this specific category (since it's single select)
      const filtered = prevCart.filter((item) => item.category !== category);
      return [
        ...filtered,
        {
          productId: product.id,
          variantId: null,
          quantity: 1,
          category: category,
        },
      ];
    });
  };

  // Handle variant selection (e.g., changing camera color)
  const handleVariantSelect = (productId: string, variantId: string) => {
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
    // Update cart item variant if it already exists in the cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, variantId } : item
      )
    );
  };

  return (
    <div className="flex flex-col gap-12 w-full max-w-4xl mx-auto py-6">
      {data.steps.map((step: any) => (
        <section key={step.id} className="flex flex-col gap-6">
          {/* Step Header */}
          <div className="border-b border-slate-200 pb-3">
            <span className={st.typography.stepHeadline}>
              Step {step.stepNumber}
            </span>
            <Header className="mt-1">{step.title}</Header>
          </div>

          {/* Step Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {step.products.map((product: any) => {
              const activeVariantId =
                selectedVariants[product.id] ||
                (product.variants && product.variants.length > 0
                  ? product.variants[0].id
                  : null);

              const activeVariant = product.variants?.find(
                (v) => v.id === activeVariantId
              );

              const currentQuantity = getItemQuantity(
                product.id,
                product.variants ? activeVariantId : null
              );

              const isSelected = currentQuantity > 0;

              // Render custom card layout per category or use standard ProductCard
              return (
                <div
                  key={product.id}
                  className={`${st.components.card} ${
                    isSelected
                      ? st.components.cardSelected
                      : st.components.cardUnselected
                  } flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    {/* Header & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Header size="sm" className={st.typography.productTitle}>
                          {product.title}
                        </Header>
                        <Body className="mt-1">{product.description}</Body>
                      </div>

                      {product.discountBadge && (
                        <Badge className={st.components.badgeDiscount}>
                          {product.discountBadge}
                        </Badge>
                      )}
                    </div>

                    {/* Image handling (supports variant dynamic image) */}
                    {(product.defaultImage || activeVariant?.image) && (
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-100">
                        <img
                          src={activeVariant?.image || product.defaultImage}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    {/* Color Swatches / Variants */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="flex items-center gap-2 pt-2">
                        <Small className="font-medium text-slate-700">Color:</Small>
                        <div className="flex items-center gap-1.5">
                          {product.variants.map((variant: any) => (
                            <button
                              key={variant.id}
                              type="button"
                              onClick={() =>
                                handleVariantSelect(product.id, variant.id)
                              }
                              className={`${st.components.colorChip} ${
                                activeVariantId === variant.id
                                  ? "border-purple-600 scale-110"
                                  : "border-slate-300"
                              }`}
                              style={{ backgroundColor: variant.colorHex }}
                              title={variant.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Pricing & Action Controls */}
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <Price amount={product.price} className={st.typography.priceActive} />
                      {product.compareAtPrice && (
                        <Price
                          amount={product.compareAtPrice}
                          className={st.typography.priceCompare}
                        />
                      )}
                    </div>

                    {/* Selection Controls */}
                    {product.selectionType === "single" ? (
                      /* Radio / Select Toggle */
                      <FilledButton
                        onClick={() => handleSingleSelect(product, step.category)}
                        className={
                          isSelected
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : undefined
                        }
                      >
                        {isSelected ? "Selected" : "Select"}
                      </FilledButton>
                    ) : (
                      /* Stepper Quantity Controls */
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  product,
                                  step.category,
                                  -1,
                                  activeVariantId
                                )
                              }
                              className={st.components.stepperBtn}
                            >
                              -
                            </button>
                            <span className="font-semibold text-sm w-4 text-center">
                              {currentQuantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  product,
                                  step.category,
                                  1,
                                  activeVariantId
                                )
                              }
                              className={st.components.stepperBtn}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <OutlinedButton
                            onClick={() =>
                              handleQuantityChange(
                                product,
                                step.category,
                                1,
                                activeVariantId
                              )
                            }
                          >
                            Add
                          </OutlinedButton>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default Products;