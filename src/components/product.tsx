import React, { useState } from 'react';
import st from '../theme';
import { Header, Body, Price, Image } from './index';

// The new schema structure
export interface ProductVariant {
  name: string; // The text to display next to the thumbnail, e.g., "White"
  img: string; // The URL of the specific color variant image
}

export interface ProductCardProps {
  title: string; // e.g., "Wyze Battery Cam Pro"
  description: string; // e.g., "Protect anywhere. See everything in 2.5K HDR..."
  price: number; // e.g., 89.98
  oldPrice: number | null;
  variants: ProductVariant[];
  // Added props to handle the state management for the product list/cart
  quantity?: number;
  onQuantityChange?: (newQuantity: number) => void;
  selectedVariantName?: string;
  onSelectVariant?: (variantName: string) => void;
  learnMoreUrl?: string; // Standardized learn more URL, for the inline link
  // Index of this card within its grid — used to cycle the discount badge color
  // so every card gets a distinct, consistent color (matches the design mock).
  index?: number;
}

// Color rotation for the "SAVE X%" ribbon. Cycles by card index so all 4 (or 5)
// cards in a section are colored, instead of only the first one or two.
const BADGE_COLORS = [
  'bg-violet-600',
  'bg-sky-600',
  'bg-emerald-600',
  'bg-amber-500',
  'bg-rose-500',
];

export function ProductCard({
  title,
  description,
  price,
  oldPrice, // Note: The design in image_0.png doesn't show oldPrice, but we'll include the logic in case.
  variants = [],
  quantity = 0,
  onQuantityChange,
  selectedVariantName,
  onSelectVariant,
  learnMoreUrl, // Inline link for the design
  index = 0,
}: ProductCardProps) {
  // Local state fallbacks if un-controlled
  const [internalVariant, setInternalVariant] = useState<string>(
    variants[0]?.name || ''
  );

  const activeVariantName = selectedVariantName ?? internalVariant;
  const isSelected = quantity > 0;

  // Find active variant object or fallback to first variant
  const activeVariant =
    variants.find((v) => v.name === activeVariantName) || variants[0];
  const displayImage = activeVariant?.img || '';

  const handleVariantClick = (name: string) => {
    setInternalVariant(name);
    onSelectVariant?.(name);
  };

  // Discount badge calculation — shown on every card that has a valid oldPrice,
  // colored per-card via BADGE_COLORS so all cards in a row are colored (not just one).
  const hasDiscount = typeof oldPrice === 'number' && oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice as number) - price) / (oldPrice as number) * 100)
    : null;
  const badgeColor = BADGE_COLORS[index % BADGE_COLORS.length];

  return (
    <div
      className={`
        ${st.components.card}
        ${isSelected ? st.components.cardSelected : st.components.cardUnselected}
        relative bg-white rounded-2xl p-6 flex items-start gap-6 border transition-all duration-200
        hover:shadow-lg
      `}
    >
      {/* Discount Ribbon Badge — floats over the top-left corner of the card */}
      {hasDiscount && (
        <span
          className={`
            absolute -top-2.5 -left-2.5 z-10 px-3 py-1 rounded-full
            text-[10px] font-bold text-white shadow-sm whitespace-nowrap
            ${badgeColor}
          `}
        >
          SAVE {discountPercent}%
        </span>
      )}

      {/* 1. Left Column: Product / Variant Hero Image */}
      <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center p-2 bg-slate-50 rounded-lg">
        {displayImage && (
          <Image
            src={displayImage}
            alt={title}
            aspectRatio="square"
            objectFit="contain"
            className="h-full w-full object-contain border-none bg-transparent p-0"
          />
        )}
      </div>

      {/* 2. Right Column: Content Block */}
      <div className="flex-grow space-y-4">
        {/* Top Section: Title and Description with Inline Learn More */}
        <div className="space-y-1">
          <Header as="h3" className="text-xl font-bold font-sans text-gray-900">
            {title}
          </Header>
          <Body className="text-sm text-slate-700 leading-relaxed">
            {description}
            {learnMoreUrl && (
              <>
                {' '}
                <a
                  href={learnMoreUrl}
                  className="inline font-medium text-blue-600 hover:underline"
                >
                  Learn More
                </a>
              </>
            )}
          </Body>
        </div>

        {/* Middle Section: Variant Option Selection */}
        {variants.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500 block">
              Option:{' '}
              <span className="text-slate-900 font-semibold">
                {activeVariant?.name}
              </span>
            </span>

            <div className="flex flex-wrap gap-3">
              {variants.map((v) => {
                const isChipSelected = v.name === activeVariant?.name;
                return (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => handleVariantClick(v.name)}
                    className={`
                      flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer
                      ${
                        isChipSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    <img
                      src={v.img}
                      alt={v.name}
                      className="w-5 h-5 rounded object-contain border border-slate-200 bg-slate-50"
                    />
                    <span>{v.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Section: Price & Quantity Stepper Row */}
        <div className="flex items-center justify-between pt-2">
          {/* Stepper Control (Cleaner design like image_0.png) */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-full p-0.5 bg-white shadow-xs">
            <button
              type="button"
              disabled={quantity <= 0}
              onClick={() => onQuantityChange?.(Math.max(0, quantity - 1))}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg
                text-slate-700 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed
                transition-colors
              `}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-semibold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange?.(quantity + 1)}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg
                text-slate-700 bg-white hover:bg-slate-100
                transition-colors
              `}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Price (Formatted like image_0.png, e.g., $89.98) */}
          <div className="text-xl font-medium text-gray-900">
            <Price amount={price} compareAtAmount={oldPrice} className="border-none p-0 bg-transparent text-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;