import React, { useState } from 'react';

export type TipoExcepcion = 'ocr_error' | 'fuera_alcance' | 'reuso';

export interface ExcepcionesModalProps {
  isOpen: boolean;
  tipo: TipoExcepcion | null;
  onClose: () => void;
  onResolver: (accion: 'captura_manual' | 'reorientar_capitulo' | 'confirmar_reuso', datos?: any) => void;
}

export const ExcepcionesModal: React.FC<ExcepcionesModalProps> = ({
  isOpen,
  tipo,
  onClose,
  onResolver,
}) => {
  // Estado para captura manual guiada (en caso de error OCR)
  const [materialManual, setMaterialManual] = useState<string>('Acero inoxidable austenítico (AISI 304)');
  const [espesorManual, setEspesorManual] = useState<string>('1.5 mm');
  const [presentacionManual, setPresentacionManual] = useState<string>('Rollo laminado en frío');

  if (!isOpen || !tipo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/[0.4] backdrop-blur-xs"
    >
      <div className="w-full max-w-lg bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* ========================================================================= */}
        {/* 1. CASO ILEGIBLE / ERROR OCR (SEMÁFORO AMARILLO) */}
        {/* ========================================================================= */}
        {tipo === 'ocr_error' && (
          <div className="space-y-5">
            {/* Cabecera con semáforo amarillo institucional */}
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-[10px] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Excepción de Lectura Automática
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                El texto no contiene suficiente densidad legible
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed">
                El archivo presenta baja resolución, rotación o degradación física que impide una extracción con confianza superior al 95%.
              </p>
            </div>

            {/* Alternativa: Formulario de captura manual guiada (Elegir, no teclear) */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-black/[0.7] mb-1.5">
                  1. Seleccione el material declarado en la factura:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Acero inoxidable austenítico (AISI 304)',
                    'Acero al carbono común (ASTM A36)',
                    'Acero aleado al boro',
                    'Fundición de hierro gris',
                  ].map((opcion) => (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => setMaterialManual(opcion)}
                      className={`p-2.5 text-xs text-left rounded-[10px] border transition-colors ${
                        materialManual === opcion
                          ? 'border-[#2563eb] bg-[#2563eb]/[0.05] font-semibold text-black'
                          : 'border-black/[0.12] bg-white text-black/[0.7] hover:border-black/[0.25]'
                      }`}
                    >
                      {opcion}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/[0.7] mb-1.5">
                  2. Espesor nominal verificado:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['< 1.0 mm', '1.5 mm', '> 3.0 mm'].map((esp) => (
                    <button
                      key={esp}
                      type="button"
                      onClick={() => setEspesorManual(esp)}
                      className={`p-2 text-xs text-center rounded-[10px] border font-mono transition-colors ${
                        espesorManual === esp
                          ? 'border-[#2563eb] bg-[#2563eb]/[0.05] font-bold text-[#2563eb]'
                          : 'border-black/[0.12] bg-white text-black/[0.7] hover:border-black/[0.25]'
                      }`}
                    >
                      {esp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/[0.7] mb-1.5">
                  3. Presentación física de la mercancía:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Rollo laminado en frío', 'Barra maciza en caliente'].map((pres) => (
                    <button
                      key={pres}
                      type="button"
                      onClick={() => setPresentacionManual(pres)}
                      className={`p-2 text-xs text-center rounded-[10px] border transition-colors ${
                        presentacionManual === pres
                          ? 'border-[#2563eb] bg-[#2563eb]/[0.05] font-semibold text-black'
                          : 'border-black/[0.12] bg-white text-black/[0.7] hover:border-black/[0.25]'
                      }`}
                    >
                      {pres}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onResolver('captura_manual', {
                    material: materialManual,
                    espesor: espesorManual,
                    presentacion: presentacionManual,
                  })
                }
                className="w-full sm:flex-1 py-3 px-4 bg-[#2563eb] text-white font-semibold text-xs rounded-[10px] hover:opacity-90 transition-opacity"
              >
                Cambiar a captura manual guiada y continuar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-4 border border-black/[0.12] hover:border-black/[0.3] text-black font-medium text-xs rounded-[10px] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. CASO FUERA DE ALCANCE (SEMÁFORO ROJO SOBRIO) */}
        {/* ========================================================================= */}
        {tipo === 'fuera_alcance' && (
          <div className="space-y-5">
            {/* Cabecera con semáforo rojo institucional */}
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-[10px] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-700" />
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wide">
                  Mercancía Fuera de Jurisdicción Siderúrgica
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-rose-950">
                El material detectado no corresponde a los Capítulos 72 o 73 (Hierro o Acero)
              </h3>
              <p className="text-xs text-rose-800 leading-relaxed">
                El producto analizado corresponde a una maquinaria industrial ensamblada que excede el ámbito de productos siderúrgicos básicos.
              </p>
            </div>

            {/* Fundamento legal y partida sugerida */}
            <div className="p-4 bg-black/[0.02] border border-black/[0.12] rounded-[10px] space-y-3">
              <div className="text-xs">
                <span className="font-semibold text-black block mb-0.5">Nota Legal Aplicada:</span>
                <span className="text-black/[0.7] leading-relaxed block">
                  Nota 1 del Capítulo 72 en concordancia con la Nota 1 (f) de la Sección XV. Los artículos constituidos por máquinas o aparatos no se clasifican en los Capítulos de metales comunes.
                </span>
              </div>

              <div className="pt-2 border-t border-black/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-black/[0.4] block">Partida de Destino Sugerida:</span>
                  <span className="font-mono font-bold text-xs text-[#2563eb]">
                    Capítulo 84 • 8479.89.90.00
                  </span>
                </div>
                <span className="text-[11px] text-black/[0.6]">
                  Máquinas con función propia
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onResolver('reorientar_capitulo', {
                    capituloDestino: 84,
                    fraccionDestino: '8479.89.90.00',
                  })
                }
                className="w-full sm:flex-1 py-3 px-4 bg-[#2563eb] text-white font-semibold text-xs rounded-[10px] hover:opacity-90 transition-opacity"
              >
                Reorientar a Ventanilla de Maquinaria (Cap. 84)
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-4 border border-black/[0.12] hover:border-black/[0.3] text-black font-medium text-xs rounded-[10px] transition-colors"
              >
                Cerrar expediente
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. CASO REUSO INMEDIATO (SEMÁFORO VERDE) */}
        {/* ========================================================================= */}
        {tipo === 'reuso' && (
          <div className="space-y-5">
            {/* Cabecera con semáforo verde institucional */}
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-[10px] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Precedente Arancelario Idéntico Encontrado
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                Documento o número de parte idéntico a expediente aprobado previo (Dictamen 2026-0142)
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                La huella digital y especificaciones técnicas coinciden en un 100% con un dictamen vigente emitido por esta aduana.
              </p>
            </div>

            {/* Ficha física del expediente previo */}
            <div className="p-4 bg-white border border-black/[0.12] rounded-[10px] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                <span className="text-xs text-black/[0.6]">Número de Parte:</span>
                <span className="font-mono text-xs font-bold text-black">NP-ACERO-304-X</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                <span className="text-xs text-black/[0.6]">Fracción Previamente Asignada:</span>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-300">
                  7219.34.00.00
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-black/[0.6]">Fecha de Homologación:</span>
                <span className="text-xs font-medium text-black">15 de Enero de 2026 • Vigente</span>
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onResolver('confirmar_reuso', {
                    dictamenId: '2026-0142',
                    fraccion: '7219.34.00.00',
                  })
                }
                className="w-full sm:flex-1 py-3 px-4 bg-emerald-700 text-white font-semibold text-xs rounded-[10px] hover:bg-emerald-800 transition-colors"
              >
                Confirmar reuso sin reclasificar y expedir dictamen
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3 px-4 border border-black/[0.12] hover:border-black/[0.3] text-black font-medium text-xs rounded-[10px] transition-colors"
              >
                Reevaluar desde cero
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExcepcionesModal;
