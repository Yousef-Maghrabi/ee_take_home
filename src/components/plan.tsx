import React from 'react';
import st from '../theme';
import { Header, Body, Price } from './index';
import { Badge } from './index';

export interface PlanCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discountBadge?: string;
  billingCycle?: string; // e.g. "/mo"
  learnMoreUrl?: string;
  features?: string[];
  
  // State & Interactivity Handlers
  isSelected: boolean;
  onSelect: () => void;
}

export function PlanCard({
  title,
  description,
  price,
  compareAtPrice,
  discountBadge,
  billingCycle = '/mo',
  learnMoreUrl = '#',
  features = [],
  isSelected,
  onSelect,
}: PlanCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        ${st.components.card}
        ${isSelected ? st.components.cardSelected : st.components.cardUnselected}
        flex flex-col justify-between gap-4 h-full relative cursor-pointer transition-all duration-200 p-5
      `}
    >
      {/* Top Header: Badge & Radio Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between min-h-[24px]">
          {discountBadge ? (
            <Badge text={discountBadge} />
          ) : compareAtPrice && compareAtPrice > price ? (
            <Badge price={price} compareAtPrice={compareAtPrice} />
          ) : (
            <div />
          )}

          {/* Custom Radio Indicator */}
          <div
            className={`
              w-5 h-5 rounded-full border flex items-center justify-center transition-all
              ${
                isSelected
                  ? 'border-purple-600 bg-purple-600 text-white'
                  : 'border-slate-300 bg-white'
              }
            `}
          >
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        </div>

        {/* Plan Title & Price */}
        <div className="space-y-1">
          <Header as="h3" className="text-lg font-semibold font-sans">
            {title}
          </Header>
          <div className="flex items-baseline gap-1">
            <Price amount={price} compareAtAmount={compareAtPrice} />
            <span className="text-xs text-slate-500 font-medium">{billingCycle}</span>
          </div>
        </div>

        {/* Description */}
        <Body className="text-xs text-slate-500 leading-relaxed">
          {description}
        </Body>

        {/* Optional Feature Bullet Points */}
        {features.length > 0 && (
          <ul className="space-y-1.5 pt-2 border-t border-slate-100">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                <svg
                  className="w-3.5 h-3.5 text-purple-600 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        {learnMoreUrl && (
          <a
            href={learnMoreUrl}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-semibold text-purple-600 hover:underline"
          >
            Learn More
          </a>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`
            px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ml-auto
            ${
              isSelected
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }
          `}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
}

export default PlanCard;