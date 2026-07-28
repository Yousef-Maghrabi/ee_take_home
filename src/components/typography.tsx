import React, { HTMLAttributes } from 'react';
import st from '../theme';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

interface PriceProps extends HTMLAttributes<HTMLSpanElement> {
  amount: number;
  compareAtAmount?: number;
  currencySymbol?: string;
}

export function Header({ children, as: Component = 'h2', className = '', ...props }: TypographyProps) {
  return (
    <Component className={`${st.typography.headingSerif} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function Body({ children, as: Component = 'p', className = '', ...props }: TypographyProps) {
  return (
    <Component className={`${st.typography.bodyText} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function Small({ children, as: Component = 'span', className = '', ...props }: TypographyProps) {
  return (
    <Component className={`${st.typography.stepHeadline} ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function Price({
  amount,
  compareAtAmount,
  currencySymbol = '$',
  className = '',
  ...props
}: PriceProps) {
  return (
    <div className={`inline-flex items-baseline gap-2 ${className}`} {...props}>
      <span className={st.typography.priceActive}>
        {currencySymbol}{amount.toFixed(2)}
      </span>
      {compareAtAmount && compareAtAmount > amount && (
        <span className={st.typography.priceCompare}>
          {currencySymbol}{compareAtAmount.toFixed(2)}
        </span>
      )}
    </div>
  );
}