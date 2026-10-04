import React from 'react';
import { Shield } from 'lucide-react';

export default function SkeuomorphicPanel({ children, mode = 'LOGIN', onTabChange }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl p-7 sm:p-8 shadow-none ring-1 ring-slate-900/5 transition-all duration-200">
      {/* Header Branding */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-11 h-11 rounded-xl bg-[#2563eb]/10 text-[#2563eb] border border-[#2563eb]/20 flex items-center justify-center mb-3.5">
          <Shield className="w-5 h-5 stroke-[2.2]" />
        </div>

        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
          Sistema Nacional de Aranceles
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Plataforma Institucional de Control Arancelario
        </p>

        {/* Clean Segment Tabs */}
        {mode !== 'AUTHENTICATED' && (
          <div className="w-full grid grid-cols-2 gap-1 mt-6 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80">
            <button
              type="button"
              onClick={() => onTabChange && onTabChange('LOGIN')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'LOGIN'
                  ? 'bg-white text-slate-900 ring-1 ring-slate-900/5 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => onTabChange && onTabChange('RECOVERY')}
              className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'RECOVERY'
                  ? 'bg-white text-slate-900 ring-1 ring-slate-900/5 font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
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

