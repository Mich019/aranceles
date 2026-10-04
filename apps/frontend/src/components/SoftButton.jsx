import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SoftButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary'
  disabled = false,
  loading = false,
  icon: Icon,
  fullWidth = true,
  className = '',
}) {
  const variantStyles = {
    primary: 'clean-button-primary font-semibold text-sm py-3 px-4 rounded-xl',
    secondary: 'clean-button-secondary font-semibold text-sm py-3 px-4 rounded-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-all select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant] || variantStyles.primary} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Verificando...</span>
        </span>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
