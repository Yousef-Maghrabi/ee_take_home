import React from 'react';
import st from '../theme';
import { Header, Body, Price } from './index';
import { Badge } from './index';
import { Image } from './index';

export interface VariantOption {
  id: string;
  name: string;
  image: string;
}

export interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discountBadge?: string;
  learnMoreUrl?: string;
  defaultImage: string;
  variants?: VariantOption[];
  
  // State from parent / context
  selectedVariantId?: string;
  activeQuantity: number;
  
  // Interactivity Handlers
  onSelectVariant?: (variantId: string) => void;
  onQuantityChange: (newQuantity: number) => void;
}

export function ProductCard({
  title,
  description,
  price,
  compareAtPrice,
  discountBadge,
  learnMoreUrl = '#',
  defaultImage,
  variants = [],
  selectedVariantId,
  activeQuantity,
  onSelectVariant,
  onQuantityChange,
}: ProductCardProps) {
  const isSelected = activeQuantity > 0;
  
  // Find current active variant or fallback to first variant / default image
  const activeVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const displayImage = activeVariant ? activeVariant.image : defaultImage;

  return (
    <div
      className={`
        ${st.components.card}
        ${isSelected ? st.components.cardSelected : st.components.cardUnselected}
        flex flex-col justify-between gap-4 h-full relative transition-all duration-200
      `}
    >
      {/* Top Row: Discount Badge & Display Image */}
      <div className="space-y-3">
        <div className="flex items-center justify-between min-h-[24px]">
          {discountBadge ? (
            <Badge text={discountBadge} />
          ) : compareAtPrice && compareAtPrice > price ? (
            <Badge price={price} compareAtPrice={compareAtPrice} />
          ) : (
            <div />
          )}
        </div>

        {/* Product / Variant Hero Image */}
        <div className="w-full h-44 flex items-center justify-center p-2 bg-slate-50 rounded-lg">
          <Image
            src={displayImage}
            alt={title}
            aspectRatio="square"
            objectFit="contain"
            className="h-full border-none bg-transparent p-0"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-1">
          <Header as="h3" className="text-lg font-semibold font-sans">
            {title}
          </Header>
          <Body className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">
            {description}
          </Body>
          {learnMoreUrl && (
            <a
              href={learnMoreUrl}
              className="inline-block text-xs font-semibold text-purple-600 hover:underline"
            >
              Learn More
            </a>
          )}
        </div>
      </div>

      {/* Bottom Row: Variant Selector & Quantity Stepper */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        {/* Color / Variant Options */}
        {variants.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500 block">
              Option: <span className="text-slate-900 font-semibold">{activeVariant?.name}</span>
            </span>
            
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const isChipSelected = v.id === (selectedVariantId || variants[0]?.id);
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onSelectVariant && onSelectVariant(v.id)}
                    className={`
                      flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer
                      ${
                        isChipSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-900 ring-1 ring-purple-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }
                    `}
                  >
                    <img
                      src={v.image}
                      alt={v.name}
                      className="w-4 h-4 rounded-full object-cover border border-slate-200"
                    />
                    <span>{v.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Quantity Stepper */}
        <div className="flex items-center justify-between pt-1">
          <Price amount={price} compareAtAmount={compareAtPrice} />

          {/* Stepper Control */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white shadow-xs">
            <button
              type="button"
              disabled={activeQuantity <= 0}
              onClick={() => onQuantityChange(activeQuantity - 1)}
              className={st.components.stepperBtn}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-semibold text-slate-800">
              {activeQuantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(activeQuantity + 1)}
              className={st.components.stepperBtn}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;