import React, { useState } from 'react';
import RoleBadgePlate from './RoleBadgePlate';
import RotaryDialSelector from './RotaryDialSelector';
import IdentitySourceBadge from './IdentitySourceBadge';
import { User, LogOut, Sliders, CheckCircle2 } from 'lucide-react';

const TEAMS_MAP = {
  guayaquil: 'Aduana Guayaquil',
  quito: 'Aduana Quito',
  tulcan: 'Frontera Tulcán',
  central: 'Admin Central',
};

const ROLES_MAP = {
  consultar: 'Consultar',
  capturar: 'Capturar',
  confirmar: 'Confirmar',
  administrar: 'Administrar',
};

export default function DashboardContextPanel({ userSession, onLogout }) {
  const [activeRole, setActiveRole] = useState('administrar');
  const [activeTeamId, setActiveTeamId] = useState('quito');
  const [identitySource, setIdentitySource] = useState('HOST_SSO');

  const toggleIdentitySource = () => {
    setIdentitySource((prev) => (prev === 'HOST_SSO' ? 'LOCAL_DB' : 'HOST_SSO'));
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* Top Header Card */}
      <div className="clean-card rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                {userSession?.username || 'diego.ramirez@aranceles.gob.ec'}
              </h2>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                En Línea
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Panel de Control de Contexto y Permisos • Sistema Nacional de Aranceles
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Main Control Panel */}
      <div className="clean-card rounded-2xl p-6 sm:p-7 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Contexto de Trabajo y Control de Acceso
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-normal">
            Última sync: {userSession?.timestamp || '1:34:31 a.m.'}
          </span>
        </div>

        {/* Origen de Identidad */}
        <IdentitySourceBadge
          source={identitySource}
          onToggleSource={toggleIdentitySource}
        />

        {/* Asignación de Rol */}
        <RoleBadgePlate
          activeRole={activeRole}
          onRoleSelect={setActiveRole}
        />

        {/* Aislamiento de Datos por Equipo / Cliente (Flat List) */}
        <RotaryDialSelector
          activeTeamId={activeTeamId}
          onTeamChange={setActiveTeamId}
        />

        {/* Reestructurado: Panel Inferior Institucional Limpio (Reemplazo del bloque negro) */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resumen de Autorización Activa
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Acceso Concedido
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rol Asignado
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {ROLES_MAP[activeRole] || activeRole}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Equipo / Cliente
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {TEAMS_MAP[activeTeamId] || activeTeamId}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Origen Identidad
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {identitySource === 'HOST_SSO' ? 'Sistema Corporativo' : 'Base Local'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
