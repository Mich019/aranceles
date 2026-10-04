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
  onReset?: () => void;
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
  onReset,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-black font-sans antialiased selection:bg-[#2563eb]/[0.12] selection:text-[#2563eb]">
      {/* 1. BARRA SUPERIOR INSTITUCIONAL TANGIBLE */}
      <header className="bg-white border-b border-black/[0.12] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Lado Izquierdo: Branding Oficial */}
          <div className="flex items-center gap-3">
            {/* Emblema institucional físico sobrio */}
            <div className="w-8 h-8 rounded-[10px] bg-black/[0.04] border border-black/[0.12] flex items-center justify-center text-black font-bold text-xs tracking-wider">
              SNA
            </div>
            <div>
              <h1 className="text-sm md:text-base font-semibold text-black leading-tight">
                Sistema Nacional de Aranceles
              </h1>
              <p className="text-xs text-black/[0.4] leading-tight font-normal">
                Plataforma Institucional de Control Arancelario
              </p>
            </div>
          </div>

          {/* Centro: Toggles Físicos Sobrios de Asistentes IA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Toggle Qwen 2.5 */}
            <div className="flex items-center gap-2.5 bg-black/[0.02] border border-black/[0.12] rounded-[10px] px-3 py-1.5">
              <button
                type="button"
                role="switch"
                aria-checked={qwenActivo}
                onClick={() => setQwenActivo((prev) => !prev)}
                className={`w-9 h-5 rounded-full transition-colors relative border flex items-center ${
                  qwenActivo
                    ? 'bg-[#2563eb] border-[#2563eb]'
                    : 'bg-black/[0.12] border-black/[0.2]'
                }`}
                title="Activar o desactivar normalización ortográfica"
              >
                <span
                  className={`w-3.5 h-3.5 bg-white rounded-full transition-transform transform shadow-none block ${
                    qwenActivo ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <div className="text-left">
                <div className="text-xs font-semibold text-black leading-tight">
                  Normalización ortográfica (Qwen 2.5)
                </div>
                <div className="text-[11px] text-black/[0.4] leading-tight">
                  {qwenActivo ? 'Corrige tipografía y términos' : 'Desactivado'}
                </div>
              </div>
            </div>

            {/* Toggle Laya */}
            <div className="flex items-center gap-2.5 bg-black/[0.02] border border-black/[0.12] rounded-[10px] px-3 py-1.5">
              <button
                type="button"
                role="switch"
                aria-checked={layaActivo}
                onClick={() => setLayaActivo((prev) => !prev)}
                className={`w-9 h-5 rounded-full transition-colors relative border flex items-center ${
                  layaActivo
                    ? 'bg-[#2563eb] border-[#2563eb]'
                    : 'bg-black/[0.12] border-black/[0.2]'
                }`}
                title="Activar o desactivar asistencia cualitativa"
              >
                <span
                  className={`w-3.5 h-3.5 bg-white rounded-full transition-transform transform shadow-none block ${
                    layaActivo ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <div className="text-left">
                <div className="text-xs font-semibold text-black leading-tight">
                  Asistencia cualitativa (Laya)
                </div>
                <div className="text-[11px] text-black/[0.4] leading-tight">
                  {layaActivo ? 'Sugiere opciones cerradas' : 'Desactivado'}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Gafete Tangible del Funcionario + Acción */}
          <div className="flex items-center gap-3">
            {/* Gafete institucional de acreditación */}
            <div className="relative">
              {/* Presilla o ranura física superior del gafete */}
              <div className="w-5 h-1.5 bg-black/[0.2] rounded-t-sm mx-auto -mb-[1px] border-t border-x border-black/[0.25]" />
              
              <div className="bg-white border border-black/[0.12] rounded-[10px] px-3 py-1.5 flex items-center gap-2.5">
                {/* Avatar fotográfico sobrio */}
                <div className="w-8 h-8 rounded-full bg-black/[0.06] border border-black/[0.12] flex items-center justify-center font-bold text-xs text-black">
                  DR
                </div>

                <div className="text-left">
                  <div className="text-xs font-semibold text-black leading-tight">
                    Diego Ramírez
                  </div>
                  <div className="text-[11px] text-black/[0.7] leading-tight">
                    Clasificador Aduanal
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                    <span className="text-[10px] text-black/[0.4] leading-tight">
                      Aduana Quito • En línea
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de texto simple para reiniciar o salir */}
            <button
              type="button"
              onClick={onReset ? onReset : () => setPasoActual(0)}
              className="text-xs font-medium text-black/[0.6] hover:text-rose-800 hover:underline px-2 py-1 rounded-[10px] transition-colors"
            >
              {pasoActual === 0 ? 'Iniciar sesión' : 'Cerrar sesión'}
            </button>
          </div>
        </div>

        {/* Toggles móviles (visibles solo en pantallas pequeñas) */}
        <div className="lg:hidden border-t border-black/[0.06] px-4 py-2 flex flex-wrap gap-2 justify-center bg-black/[0.01]">
          <button
            type="button"
            onClick={() => setQwenActivo((prev) => !prev)}
            className={`text-xs px-2.5 py-1 rounded-[10px] border flex items-center gap-1.5 ${
              qwenActivo
                ? 'bg-black/[0.06] border-black/[0.2] text-black font-medium'
                : 'bg-white border-black/[0.12] text-black/[0.4]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${qwenActivo ? 'bg-[#2563eb]' : 'bg-black/[0.2]'}`} />
            Qwen 2.5: {qwenActivo ? 'Activo' : 'Inactivo'}
          </button>
          <button
            type="button"
            onClick={() => setLayaActivo((prev) => !prev)}
            className={`text-xs px-2.5 py-1 rounded-[10px] border flex items-center gap-1.5 ${
              layaActivo
                ? 'bg-black/[0.06] border-black/[0.2] text-black font-medium'
                : 'bg-white border-black/[0.12] text-black/[0.4]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${layaActivo ? 'bg-[#2563eb]' : 'bg-black/[0.2]'}`} />
            Laya: {layaActivo ? 'Activo' : 'Inactivo'}
          </button>
        </div>
      </header>

      {/* 2. BARRA DE ETAPAS LINEAL (SIN NOMBRES DE MÓDULO NI RF-XXX) */}
      {pasoActual > 0 && (
        <nav
          aria-label="Progreso del flujo arancelario"
          className="bg-white border-b border-black/[0.12] sticky top-[57px] z-30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {ETAPAS_FLUJO.map((etapa, idx) => {
                const esActivo = pasoActual === etapa.id;
                const esCompletado = pasoActual > etapa.id;

                return (
                  <React.Fragment key={etapa.id}>
                    <button
                      type="button"
                      onClick={() => setPasoActual(etapa.id)}
                      className={`px-3 py-1.5 rounded-[10px] text-xs transition-all flex items-center gap-2 border ${
                        esActivo
                          ? 'bg-[#2563eb]/[0.08] text-[#2563eb] border-[#2563eb] font-semibold'
                          : esCompletado
                          ? 'text-emerald-800 bg-emerald-50 border-emerald-300 font-medium'
                          : 'text-black/[0.4] bg-black/[0.02] border-black/[0.08] hover:border-black/[0.2]'
                      }`}
                    >
                      {esCompletado && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                      )}
                      <span>{etapa.label}</span>
                    </button>

                    {idx < ETAPAS_FLUJO.length - 1 && (
                      <span className="text-black/[0.2] text-xs select-none">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* 3. ÁREA PRINCIPAL DINÁMICA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>

      {/* 4. PIE DE PÁGINA OFICIAL */}
      <footer className="bg-white border-t border-black/[0.08] py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-black/[0.4] font-normal tracking-normal">
            © 2026 FASITLAC • Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
