import React from 'react';
import { Eye, Edit3, CheckCircle2, ShieldCheck } from 'lucide-react';

const ROLES = [
  { id: 'consultar', label: 'Consultar', desc: 'Lectura y revisión de partidas...', icon: Eye },
  { id: 'capturar', label: 'Capturar', desc: 'Ingreso y registro de nuevos...', icon: Edit3 },
  { id: 'confirmar', label: 'Confirmar', desc: 'Validación y aprobación de...', icon: CheckCircle2 },
  { id: 'administrar', label: 'Administrar', desc: 'Control total de políticas y...', icon: ShieldCheck },
];

export default function RoleBadgePlate({ activeRole = 'administrar', onRoleSelect }) {
  return (
    <div className="w-full space-y-2.5 text-left">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>Asignación de Rol de Usuario</span>
        <span className="text-xs text-slate-500 font-normal">Nivel de Permisos Activo</span>
      </div>

      {/* Grid of Clean Role Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onRoleSelect && onRoleSelect(role.id)}
              className={`p-3.5 rounded-xl border text-left transition-all select-none cursor-pointer flex flex-col justify-between h-24 ${
                isActive
                  ? 'bg-blue-50/40 border-blue-600 ring-1 ring-blue-600/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              {/* Clean Icon Header */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                />
              </div>

              {/* Role Title and Description */}
              <div>
                <div
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isActive ? 'text-blue-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  {role.label}
                </div>
                <p className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                  {role.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
