import React, { ButtonHTMLAttributes } from 'react';
import st from '../theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export function FilledButton({
  children,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`
        ${st.components.btnPrimary}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-indigo-600' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export function OutlinedButton({
  children,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`
        border-2 border-indigo-600 text-indigo-600 font-semibold py-3 px-6 rounded-lg 
        hover:bg-purple-50 transition-colors shadow-sm text-center cursor-pointer
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${disabled ? 'opacity-50 cursor-not-allowed border-slate-300 text-slate-400 hover:bg-transparent' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}