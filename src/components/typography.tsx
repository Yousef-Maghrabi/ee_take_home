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
    <div className={`inline-flex items-end flex-col ${className}`} {...props}>
      {compareAtAmount && compareAtAmount > amount && (
        <span className={`line-through text-red-600 font-light`}>
          {currencySymbol}{compareAtAmount.toFixed(2)}
        </span>
      )}
      <span className={`text-xl font-light}`}>
        {currencySymbol}{amount.toFixed(2)}
      </span>
    </div>
  );
}