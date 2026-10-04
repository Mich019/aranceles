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
    primary: 'bg-[#2563eb] text-white shadow-none hover:opacity-90 font-semibold text-sm py-2.5 px-4 rounded-xl',
    secondary: 'bg-white border border-slate-200 text-slate-700 shadow-none hover:bg-slate-50 font-semibold text-sm py-2.5 px-4 rounded-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-opacity duration-150 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
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

