import React, { useState } from 'react';

export interface PreguntaDecisivaProps {
  onRespuestaRegistrada: (respuesta: {
    id: string;
    titulo: string;
    consecuencia: string;
    subpartidaEfecto: string;
    nuevaConfianza: number;
  }) => void;
  onVolver: () => void;
  confianzaActual?: number;
}

interface OpcionDesambiguacion {
  id: string;
  titulo: string;
  consecuencia: string;
  subpartidaEfecto: string;
  nuevaConfianza: number;
  icono: 'bobina' | 'hoja' | 'duda';
}

const OPCIONES: OpcionDesambiguacion[] = [
  {
    id: 'enrollado',
    titulo: 'Enrollado (en bobina / coil)',
    consecuencia: 'Cumple condición estricta para productos planos enrollados de la partida 72.19.',
    subpartidaEfecto: '7219.34.01',
    nuevaConfianza: 0.994,
    icono: 'bobina',
  },
  {
    id: 'hojas_cortadas',
    titulo: 'En hojas cortadas sin enrollar',
    consecuencia: 'Deriva a subpartidas de chapas o tiras cortadas en formato plano rectangular.',
    subpartidaEfecto: '7219.90.00.00',
    nuevaConfianza: 0.985,
    icono: 'hoja',
  },
  {
    id: 'no_disponible',
    titulo: 'Dato no disponible en la ficha',
    consecuencia: 'El motor evaluará por residuales («Los demás») con menor certeza arancelaria.',
    subpartidaEfecto: '7219.34.01 (Inferencia residual)',
    nuevaConfianza: 0.880,
    icono: 'duda',
  },
];

export const PreguntaDecisiva: React.FC<PreguntaDecisivaProps> = ({
  onRespuestaRegistrada,
  onVolver,
  confianzaActual = 0.865,
}) => {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string>('enrollado');
  const [recalculando, setRecalculando] = useState<boolean>(false);

  const opcionActiva = OPCIONES.find((op) => op.id === opcionSeleccionada) || OPCIONES[0];

  const handleConfirmar = () => {
    setRecalculando(true);

    setTimeout(() => {
      setRecalculando(false);
      onRespuestaRegistrada({
        id: opcionActiva.id,
        titulo: opcionActiva.titulo,
        consecuencia: opcionActiva.consecuencia,
        subpartidaEfecto: opcionActiva.subpartidaEfecto,
        nuevaConfianza: opcionActiva.nuevaConfianza,
      });
    }, 450);
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Cabecera institucional limpia */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e2e8f0]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#dc2626]">
              Criterio de Nomenclatura
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0f172a] mt-0.5">
              Desambiguación de Presentación Física
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-[#fffbeb] border border-[#fde68a] px-3 py-1 rounded-full text-xs text-[#92400e]">
            <span className="w-2 h-2 rounded-full bg-[#d97706]" />
            <span className="font-medium">Confianza Parcial: {(confianzaActual * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Comparativa clara de subpartidas */}
        <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-2">
          <div className="text-xs font-semibold text-[#475569]">
            Subpartidas en evaluación comparativa:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-white border border-[#e2e8f0] rounded-lg">
              <span className="font-mono font-bold text-[#dc2626]">7219.34.01</span>
              <p className="text-[11px] text-[#64748b] mt-0.5">
                Productos enrollados en frío, espesor 0.5 a 1.0 mm (Confianza 86.5%)
              </p>
            </div>
            <div className="p-3 bg-white border border-[#e2e8f0] rounded-lg">
              <span className="font-mono font-bold text-[#475569]">7219.90.00</span>
              <p className="text-[11px] text-[#64748b] mt-0.5">
                Los demás productos planos de acero inoxidable (Confianza 82.0%)
              </p>
            </div>
          </div>
        </div>

        {/* Pregunta directa */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0f172a] leading-snug">
            ¿El producto se encuentra enrollado o en hojas cortadas rectas?
          </h3>
          <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
            La estructura de la LIGIE para la partida 72.19 distingue formalmente entre mercancía suministrada en bobinas enrolladas y aquella cortada en láminas individuales planas.
          </p>
        </div>

        {/* Opciones directas sin saturación */}
        <div className="space-y-3" role="radiogroup" aria-label="Opciones de desambiguación">
          {OPCIONES.map((opcion) => {
            const seleccionada = opcionSeleccionada === opcion.id;
            return (
              <button
                key={opcion.id}
                type="button"
                role="radio"
                aria-checked={seleccionada}
                onClick={() => setOpcionSeleccionada(opcion.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  seleccionada
                    ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                    : 'border-[#e2e8f0] bg-white hover:bg-[#f8fafc] hover:border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                    seleccionada ? 'border-[#dc2626]' : 'border-[#cbd5e1]'
                  }`}>
                    {seleccionada && <span className="w-2 h-2 rounded-full bg-[#dc2626]" />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {opcion.titulo}
                      </span>
                      {seleccionada && (
                        <span className="text-[10px] text-[#065f46] font-medium bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
                          Seleccionada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b] mt-1 leading-normal">
                      {opcion.consecuencia}
                    </p>
                    <div className="text-[11px] font-mono text-[#dc2626] font-semibold mt-1">
                      Destino: {opcion.subpartidaEfecto}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Acciones */}
        <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onVolver}
            className="w-full sm:w-auto px-4 py-2.5 border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#64748b] text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            ← Volver a Validación
          </button>

          <button
            type="button"
            disabled={recalculando}
            onClick={handleConfirmar}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#dc2626] text-white font-medium text-xs sm:text-sm rounded-lg hover:bg-[#b91c1c] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            {recalculando ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Calculando reglas arancelarias…</span>
              </>
            ) : (
              <span>Confirmar y Evaluar Dictamen →</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PreguntaDecisiva;
