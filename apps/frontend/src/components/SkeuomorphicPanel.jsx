import React from 'react';
import { Shield } from 'lucide-react';

export default function SkeuomorphicPanel({ children, mode = 'LOGIN', onTabChange }) {
  return (
    <div className="w-full max-w-md mx-auto clean-card rounded-2xl p-7 sm:p-8 shadow-sm transition-all duration-300">
      {/* Header Branding */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-3">
          <Shield className="w-6 h-6 stroke-[2.2]" />
        </div>

        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          Sistema Nacional de Aranceles
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Plataforma Institucional de Control Arancelario
        </p>

        {/* Clean Segment Tabs */}
        {mode !== 'AUTHENTICATED' && (
          <div className="w-full grid grid-cols-2 gap-1 mt-5 p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => onTabChange && onTabChange('LOGIN')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'LOGIN' ? 'clean-tab-active shadow-sm' : 'clean-tab-inactive'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => onTabChange && onTabChange('RECOVERY')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                mode === 'RECOVERY' ? 'clean-tab-active shadow-sm' : 'clean-tab-inactive'
              }`}
            >
              Recuperar Acceso
            </button>
          </div>
        )}
      </div>

      {/* Main Content Form */}
      <div>{children}</div>
    </div>
  );
}
