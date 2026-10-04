import React from 'react';
import { Network, Database, ShieldCheck, RefreshCw } from 'lucide-react';

export default function IdentitySourceBadge({
  source = 'HOST_SSO', // 'HOST_SSO' | 'LOCAL_DB'
  onToggleSource,
}) {
  const isHost = source === 'HOST_SSO';

  return (
    <div className="w-full space-y-2 text-left">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>Origen de la Identidad</span>
        <button
          type="button"
          onClick={onToggleSource}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Cambiar Origen</span>
        </button>
      </div>

      <div
        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
          isHost
            ? 'bg-blue-50/40 border-blue-200 text-slate-800'
            : 'bg-emerald-50/40 border-emerald-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              isHost
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-emerald-600 text-white border-emerald-600'
            }`}
          >
            {isHost ? <Network className="w-5 h-5" /> : <Database className="w-5 h-5" />}
          </div>

          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>{isHost ? 'Sistema Corporativo Anfitrión (SSO)' : 'Credenciales Institucionales Locales'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              {isHost
                ? 'Rol y permisos sincronizados automáticamente desde el servidor central corporativo.'
                : 'Identidad y credenciales gestionadas en la base de datos local.'}
            </p>
          </div>
        </div>

        {/* Clean Flat Badge without Mono Tech Codes */}
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-lg shrink-0 ${
            isHost
              ? 'bg-blue-100/80 text-blue-700 border border-blue-200'
              : 'bg-emerald-100/80 text-emerald-700 border border-emerald-200'
          }`}
        >
          {isHost ? 'Sistema Corporativo' : 'Base Local'}
        </span>
      </div>
    </div>
  );
}
