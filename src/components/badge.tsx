import React, { HTMLAttributes } from 'react';
import st from '../theme';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  text?: string;
  price?: number;
  compareAtPrice?: number;
}

export function Badge({
  text,
  price,
  compareAtPrice,
  className = '',
  ...props
}: BadgeProps) {
  // If price and compareAtPrice are passed, calculate discount percentage automatically
  let calculatedText = text;

  if (!calculatedText && price !== undefined && compareAtPrice !== undefined && compareAtPrice > price) {
    const discountPercent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
    if (discountPercent > 0) {
      calculatedText = `Save ${discountPercent}%`;
    }
  }

  // If no valid text or calculated discount exists, don't render anything
  if (!calculatedText) {
    return null;
  }

  return (
    <span
      className={`${st.components.badgeDiscount} ${className}`}
      {...props}
    >
      {calculatedText}
    </span>
  );
}

export default Badge;