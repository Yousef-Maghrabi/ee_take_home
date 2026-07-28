import React from 'react';
import st from '../theme';
import { Header, Body, Price } from './index';
import { Badge } from './index';
import { Image } from './index';

export interface ExtraProtectionCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discountBadge?: string;
  image: string;
  learnMoreUrl?: string;
  allowMultiple?: boolean; // If true, shows stepper; if false, shows toggle button
  
  // State & Handlers
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export function ExtraProtectionCard({
  title,
  description,
  price,
  compareAtPrice,
  discountBadge,
  image,
  learnMoreUrl = '#',
  allowMultiple = false,
  quantity,
  onQuantityChange,
}: ExtraProtectionCardProps) {
  const isSelected = quantity > 0;

  return (
    <div
      className={`
        ${st.components.card}
        ${isSelected ? st.components.cardSelected : st.components.cardUnselected}
        flex flex-col justify-between gap-4 h-full relative transition-all duration-200 p-5
      `}
    >
      {/* Top Section: Badge, Image & Description */}
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

        {/* Protection Thumbnail */}
        <div className="w-full h-32 flex items-center justify-center p-2 bg-slate-50 rounded-lg">
          <Image
            src={image}
            alt={title}
            aspectRatio="square"
            objectFit="contain"
            className="h-full border-none bg-transparent p-0"
          />
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <Header as="h3" className="text-base font-semibold font-sans">
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

      {/* Bottom Section: Price & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <Price amount={price} compareAtAmount={compareAtPrice} />

        {/* Action Controls */}
        {allowMultiple ? (
          /* Stepper for multiple items (e.g., yard signs / decals) */
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 bg-white shadow-xs">
            <button
              type="button"
              disabled={quantity <= 0}
              onClick={() => onQuantityChange(quantity - 1)}
              className={st.components.stepperBtn}
              aria-label={`Decrease quantity of ${title}`}
            >
              -
            </button>
            <span className="w-6 text-center text-xs font-semibold text-slate-800">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className={st.components.stepperBtn}
              aria-label={`Increase quantity of ${title}`}
            >
              +
            </button>
          </div>
        ) : (
          /* Single Toggle Button for services (e.g., Extended Warranty) */
          <button
            type="button"
            onClick={() => onQuantityChange(isSelected ? 0 : 1)}
            className={`
              px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer
              ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }
            `}
          >
            {isSelected ? 'Added' : 'Add Protection'}
          </button>
        )}
      </div>
    </div>
  );
}

export default ExtraProtectionCard;