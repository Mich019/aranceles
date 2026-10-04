import React from 'react';
import { Check } from 'lucide-react';

const TEAMS = [
  { id: 'guayaquil', name: 'Aduana Guayaquil', type: 'Distrito Marítimo', records: '14,250 partidas' },
  { id: 'quito', name: 'Aduana Quito', type: 'Distrito Aéreo', records: '8,910 partidas' },
  { id: 'tulcan', name: 'Frontera Tulcán', type: 'Distrito Terrestre', records: '3,420 partidas' },
  { id: 'central', name: 'Admin Central', type: 'Sede Nacional', records: 'Acceso Total' },
];

export default function RotaryDialSelector({ activeTeamId = 'quito', onTeamChange }) {
  return (
    <div className="w-full space-y-2.5 text-left">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>Aislamiento de Datos por Equipo / Cliente</span>
        <span className="text-xs text-blue-600 font-medium">Contexto Activo</span>
      </div>

      {/* Clean Grid of Team Options without Rotary Dial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TEAMS.map((team) => {
          const isSelected = activeTeamId === team.id;

          return (
            <button
              key={team.id}
              type="button"
              onClick={() => onTeamChange && onTeamChange(team.id)}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-blue-50/40 border-blue-600 ring-1 ring-blue-600/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Clean Flat Check Icon for Selected State */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-slate-300 bg-slate-100 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {team.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {team.type}
                  </div>
                </div>
              </div>

              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                  isSelected ? 'bg-blue-100/80 text-blue-700 font-semibold' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {team.records}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
