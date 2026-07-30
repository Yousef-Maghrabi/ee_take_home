import React, { useState } from 'react';
import st from '../theme';
import { Header, Body, Price, Image } from './index'; 

// *************************************************** 
// *************************************************** 
// ***************************************************  

export interface ProductVariant {
  name: string; 
  img: string; 
}

export interface ProductCardProps {
  title: string; 
  description: string; 
  price: number; 
  oldPrice: number | null;
  variants: ProductVariant[];
  
  quantity?: number;
  onQuantityChange?: (newQuantity: number) => void;
  selectedVariantName?: string;
  onSelectVariant?: (variantName: string) => void;
  learnMoreUrl?: string; 
  index?: number;
}

// *************************************************** 
// *************************************************** 
// *************************************************** 

export function ProductCard({
  title,
  description,
  price,
  oldPrice,
  variants = [],
  quantity = 0,
  onQuantityChange,
  selectedVariantName,
  onSelectVariant,
  learnMoreUrl,
  index = 0,
}: ProductCardProps) {
  
  const [internalVariant, setInternalVariant] = useState<string>(
    variants[0]?.name || ''
  );

  const activeVariantName = selectedVariantName ?? internalVariant;
  const isSelected = quantity > 0;
  const activeVariant =
    variants.find((v) => v.name === activeVariantName) || variants[0];
  const displayImage = activeVariant?.img || '';

  const handleVariantClick = (name: string) => {
    setInternalVariant(name);
    onSelectVariant?.(name);
  };
  
  const hasDiscount = typeof oldPrice === 'number' && oldPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((oldPrice as number) - price) / (oldPrice as number) * 100)
    : null;
  
  return (
    <div
      className={`
        ${st.components.card}
        ${isSelected ? st.components.cardSelected : st.components.cardUnselected}
        relative bg-white rounded-2xl p-4 sm:p-6 border transition-all duration-200 hover:shadow-lg
        
        /* sm -> md: Stays as is (Flex side-by-side) */
        flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6
        
        /* lg -> xl: 2 Rows. Top Row = 2 Cols (Image + Title) */
        lg:grid lg:grid-cols-[auto_1fr] lg:gap-6
        
        /* xl+: Stays as is (Resets to Flex side-by-side) */
        xl:flex xl:flex-row
      `}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute top-2.5 left-2.5 z-10 px-3 py-1 rounded-full text-[10px] font-bold text-white bg-indigo-600 shadow-sm whitespace-nowrap">
          SAVE {discountPercent}%
        </span>
      )}

      {/* --- TOP ROW, LEFT COL: Image --- */}
      <div className="w-full sm:w-36 max-w-full aspect-[4/3] sm:aspect-[3/4] flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden p-1 lg:col-start-1 lg:row-start-1">
        {displayImage && (
          <Image
            src={displayImage}
            alt={title}
            aspectRatio="3/4"
            objectFit="cover"
            className="h-full w-full object-cover rounded-md"
          />
        )}
      </div>

      {/* Wrapper: Becomes 'contents' on LG to let inner elements join the parent Grid naturally */}
      <div className="w-full flex-grow flex flex-col gap-4 lg:contents xl:flex xl:flex-col">
        
        {/* --- TOP ROW, RIGHT COL: Title & Description --- */}
        <div className="w-full space-y-1 lg:col-start-2 lg:row-start-1">
          <Header as="h3" className="text-lg sm:text-xl font-bold font-sans text-gray-900">
            {title}
          </Header>
          <Body className="text-sm text-slate-700 leading-relaxed">
            {description}
            {learnMoreUrl && (
              <>
                {' '}
                <a
                  href={learnMoreUrl}
                  className="inline font-medium text-indigo-600 hover:underline"
                >
                  Learn More
                </a>
              </>
            )}
          </Body>
        </div>

        {/* --- BOTTOM ROW: Variants, Incrementer, and Prices --- */}
        {/* On LG: Spans full width (col-span-2) and aligns elements horizontally (flex-row) */}
        <div className="
          w-full flex flex-col gap-4
          lg:col-span-2 lg:row-start-2 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between
          xl:col-span-1 xl:flex-col xl:items-stretch xl:justify-start
        ">
          
          {/* Variants */}
          {variants.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-500 block">
                Option:{' '}
                <span className="text-slate-900 font-semibold">
                  {activeVariant?.name}
                </span>
              </span>

              <div className="flex flex-row flex-wrap gap-2.5">
                {variants.map((v) => {
                  const isChipSelected = v.name === activeVariant?.name;
                  return (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => handleVariantClick(v.name)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all cursor-pointer
                        ${
                          isChipSelected
                            ? 'border-indigo-600 bg-purple-50 text-indigo-900 ring-2 ring-indigo-600'
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

          {/* Stepper & Price */}
          <div className="flex items-center justify-between gap-4 flex-wrap lg:justify-end">
            {/* Stepper Control */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-full p-0.5 bg-white shadow-xs">
              <button
                type="button"
                disabled={quantity <= 0}
                onClick={() => onQuantityChange?.(Math.max(0, quantity - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg text-slate-700 bg-white hover:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-colors"
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
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg text-slate-700 bg-white hover:bg-slate-100 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Price */}
            <div className="text-xl font-medium text-gray-900">
              <Price amount={price} compareAtAmount={oldPrice} className="border-none p-0 bg-transparent text-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;