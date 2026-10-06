import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function RecessedInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  icon: Icon,
  error = '',
  required = false,
  autoComplete = 'off',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={id}
          className="flex items-center justify-between text-sm font-medium text-slate-500"
        >
          <span>
            {label} {required && <span className="text-[#dc2626]">*</span>}
          </span>
          {error && (
            <span className="text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </span>
          )}
        </label>
      )}

      {/* Clean Vercel/Linear Input Field */}
      <div
        className={`relative flex items-center w-full rounded-xl border transition-all bg-[#f8fafc] ${
          error
            ? 'border-red-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
            : 'border-slate-200 focus-within:border-[#dc2626] focus-within:ring-1 focus-within:ring-[#dc2626]'
        }`}
      >
        {Icon && (
          <div className="pl-3.5 pr-1 text-slate-400 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-slate-400" />
          </div>
        )}

        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full py-2.5 px-3 text-slate-900 font-medium text-sm bg-transparent placeholder-slate-400 focus:outline-none focus:ring-0"
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="mr-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

