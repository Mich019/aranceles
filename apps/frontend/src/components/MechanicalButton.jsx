import React from 'react';
import { Loader2 } from 'lucide-react';
import { playHeavySwitchSound } from '../utils/audio';

export default function MechanicalButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'rocker'
  disabled = false,
  loading = false,
  icon: Icon,
  fullWidth = true,
  className = '',
  title = '',
}) {
  const handleClick = (e) => {
    if (disabled || loading) return;
    playHeavySwitchSound();
    if (onClick) onClick(e);
  };

  const variantClasses = {
    primary: 'skeuo-button-primary uppercase tracking-wider font-extrabold text-white text-sm py-3.5',
    secondary: 'skeuo-button text-slate-700 font-bold uppercase text-xs py-3',
    danger: 'skeuo-button-danger text-white font-extrabold uppercase tracking-wider text-xs py-3',
    rocker: 'bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-md shadow-md active:shadow-inner',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      className={`relative group inline-flex items-center justify-center gap-2.5 rounded-lg font-mono transition-all duration-150 select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${variantClasses[variant] || variantClasses.primary} ${className}`}
    >
      {/* Metallic edge sheen highlight */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-white/40 rounded-t-lg pointer-events-none" />
      
      {/* Button Content */}
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>PROCESANDO CREDENCIALES...</span>
        </span>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 shrink-0 group-hover:scale-105 transition-transform" />}
          <span className="tracking-widest">{children}</span>
        </>
      )}

      {/* Tactile indicator dot for mechanical status */}
      <span className={`w-1.5 h-1.5 rounded-full ${variant === 'primary' ? 'bg-cyan-300 shadow-[0_0_6px_#67e8f9]' : 'bg-slate-400'}`} />
    </button>
  );
}
