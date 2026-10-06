import React from 'react';

export interface DatosSimulados {
  material: string;
  tipoProducto: string;
  espesor: string;
  norma: string;
  origen: string;
  confianzaOcr: number;
  fraccionSugerida: string;
  descripcionArancelaria: string;
  pesoNeto?: string;
  unidadMedida?: string;
  paisOrigen?: string;
  supervisorVoBo?: {
    nombre: string;
    cargo: string;
    fechaHora: string;
  };
}

export interface AppShellProps {
  pasoActual: number;
  setPasoActual: (paso: number) => void;
  tipoDocumento: 'ficha' | 'pedimento';
  setTipoDocumento: (tipo: 'ficha' | 'pedimento') => void;
  qwenActivo: boolean;
  setQwenActivo: React.Dispatch<React.SetStateAction<boolean>>;
  layaActivo: boolean;
  setLayaActivo: React.Dispatch<React.SetStateAction<boolean>>;
  datosSimulados: DatosSimulados;
  usuarioActivo?: { nombre: string; cargo: string; correo: string; sede?: string } | null;
  modoVista?: 'admin_hub' | 'operacion';
  onReset?: () => void;
  onIrAAdminHub?: () => void;
  children: React.ReactNode;
}

const ETAPAS_FLUJO = [
  { id: 1, label: '1. Recepción', desc: 'Ingesta de documento' },
  { id: 2, label: '2. Validación', desc: 'Revisión de atributos técnicos' },
  { id: 3, label: '3. Evaluación', desc: 'Pregunta arancelaria decisiva' },
  { id: 4, label: '4. Dictamen', desc: 'Ranking y clasificación final' },
  { id: 5, label: 'Auditoría', desc: 'Contraste pedimento vs ficha' },
  { id: 6, label: 'Expediente', desc: 'Descarga y certificación' },
];

export const AppShell: React.FC<AppShellProps> = ({
  pasoActual,
  setPasoActual,
  tipoDocumento,
  setTipoDocumento,
  qwenActivo,
  setQwenActivo,
  layaActivo,
  setLayaActivo,
  datosSimulados,
  usuarioActivo,
  modoVista = 'operacion',
  onReset,
  onIrAAdminHub,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-[#0f172a] font-sans antialiased selection:bg-[#dc2626]/10 selection:text-[#dc2626]">
      {/* 1. BARRA SUPERIOR INSTITUCIONAL LIMPIA */}
      <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Lado Izquierdo: Branding Oficial */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo Institucional"
              className="w-8 h-8 object-contain shrink-0 drop-shadow-xs"
            />
            <div>
              <h1 className="text-sm font-semibold text-[#0f172a] leading-tight">
                Sistema Nacional de Aranceles
              </h1>
              <p className="text-xs text-[#64748b] leading-tight font-normal">
                {modoVista === 'admin_hub'
                  ? 'Centro de Mando Administrativo'
                  : 'Plataforma Institucional de Control Arancelario'}
              </p>
            </div>
          </div>

          {/* Centro: Asistentes IA compactos y limpios */}
          {modoVista !== 'admin_hub' && pasoActual > 0 && (
            <div className="hidden lg:flex items-center gap-4 bg-[#f8fafc] border border-[#e2e8f0] px-3 py-1.5 rounded-full text-xs">
              {/* Toggle Qwen 2.5 */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-medium text-[#475569]">Qwen 2.5</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={qwenActivo}
                  onClick={() => setQwenActivo((prev) => !prev)}
                  className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                    qwenActivo ? 'bg-[#dc2626]' : 'bg-[#cbd5e1]'
                  }`}
                  title="Normalización ortográfica"
                >
                  <span
                    className={`w-3 h-3 bg-white rounded-full transition-transform shadow-sm block ${
                      qwenActivo ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>

              <span className="w-px h-3 bg-[#e2e8f0]" />

              {/* Toggle Laya */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-medium text-[#475569]">Laya</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={layaActivo}
                  onClick={() => setLayaActivo((prev) => !prev)}
                  className={`w-7 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                    layaActivo ? 'bg-[#dc2626]' : 'bg-[#cbd5e1]'
                  }`}
                  title="Asistencia cualitativa"
                >
                  <span
                    className={`w-3 h-3 bg-white rounded-full transition-transform shadow-sm block ${
                      layaActivo ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
            </div>
          )}

          {/* Lado Derecho: Funcionario Autenticado + Cerrar sesión */}
          {(modoVista === 'admin_hub' || pasoActual > 0) && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs font-semibold text-[#0f172a] leading-tight">
                  {usuarioActivo?.nombre || (modoVista === 'admin_hub' ? 'Lic. Sofía Valenzuela' : 'Diego Ramírez')}
                </div>
                <div className="text-[11px] text-[#64748b] leading-tight">
                  {usuarioActivo?.cargo || (modoVista === 'admin_hub' ? 'Administrador Central' : 'Clasificador Aduanal')}
                  {usuarioActivo?.sede ? ` • ${usuarioActivo.sede}` : ''}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onIrAAdminHub && (
                  <button
                    type="button"
                    onClick={onIrAAdminHub}
                    className="text-xs font-semibold text-[#dc2626] bg-[#fef2f2] hover:bg-[#fee2e2] px-2.5 py-1.5 rounded-lg border border-[#fecaca] transition-colors flex items-center gap-1.5 cursor-pointer shadow-none"
                    title="Abrir la Consola de Administración y Control"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Consola Administrador</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onReset ? onReset : () => setPasoActual(0)}
                  className="text-xs font-medium text-[#64748b] hover:text-[#dc2626] px-2.5 py-1.5 rounded-lg border border-[#e2e8f0] hover:border-[#fecaca] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Toggles móviles compactos */}
        {modoVista !== 'admin_hub' && pasoActual > 0 && (
          <div className="lg:hidden border-t border-[#e2e8f0] px-4 py-2 flex gap-3 justify-center bg-[#f8fafc]">
            <button
              type="button"
              onClick={() => setQwenActivo((prev) => !prev)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                qwenActivo ? 'bg-[#dc2626]/10 border-[#dc2626]/30 text-[#dc2626] font-semibold' : 'border-[#e2e8f0] text-[#64748b]'
              }`}
            >
              Qwen 2.5: {qwenActivo ? 'Activo' : 'Inactivo'}
            </button>
            <button
              type="button"
              onClick={() => setLayaActivo((prev) => !prev)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                layaActivo ? 'bg-[#dc2626]/10 border-[#dc2626]/30 text-[#dc2626] font-semibold' : 'border-[#e2e8f0] text-[#64748b]'
              }`}
            >
              Laya: {layaActivo ? 'Activo' : 'Inactivo'}
            </button>
          </div>
        )}
      </header>

      {/* 2. BARRA DE ETAPAS LINEAL LIMPIA */}
      {modoVista !== 'admin_hub' && pasoActual > 0 && (
        <nav
          aria-label="Progreso del flujo arancelario"
          className="bg-white border-b border-[#e2e8f0] sticky top-[57px] z-30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 min-w-max">
              {ETAPAS_FLUJO.map((etapa, idx) => {
                const esActivo = pasoActual === etapa.id;
                const esCompletado = pasoActual > etapa.id;

                return (
                  <React.Fragment key={etapa.id}>
                    <button
                      type="button"
                      onClick={() => setPasoActual(etapa.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${
                        esActivo
                          ? 'bg-[#dc2626] text-white font-medium shadow-xs'
                          : esCompletado
                          ? 'text-[#0f172a] hover:bg-[#f1f5f9] font-medium'
                          : 'text-[#94a3b8] hover:text-[#64748b]'
                      }`}
                    >
                      <span>{etapa.label}</span>
                    </button>

                    {idx < ETAPAS_FLUJO.length - 1 && (
                      <span className="text-[#cbd5e1] text-xs px-1 select-none">›</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* 3. ÁREA PRINCIPAL DINÁMICA CON ESPACIADO CÓMODO */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>

      {/* 4. PIE DE PÁGINA OFICIAL */}
      <footer className="bg-white border-t border-[#e2e8f0] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-[#64748b] font-normal tracking-normal">
            © 2026 FASITLAC • Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
