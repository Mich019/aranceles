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
    <div className="max-w-3xl mx-auto py-4">
      <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8 space-y-6">
        
        {/* Cabecera de ciclo y estado de confianza amarillo */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span className="text-xs font-semibold text-black/[0.7] tracking-wide">
              Pregunta de Desambiguación 1 de máximo 3
            </span>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-1 rounded-[10px] text-amber-900">
            <span className="text-[11px] font-bold">Confianza Parcial:</span>
            <span className="font-mono text-xs font-bold">
              {(confianzaActual * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] text-amber-900/[0.7]">(Margen de empate activo)</span>
          </div>
        </div>

        {/* Bloque explicativo del empate entre fracciones */}
        <div className="bg-black/[0.02] border border-black/[0.12] rounded-[10px] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-black">Subpartidas candidatas en controversia:</span>
            <span className="text-[11px] font-mono text-black/[0.6]">Capítulo 72 • Acero Inoxidable</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-white border border-black/[0.12] rounded-[8px]">
              <span className="font-mono font-bold text-[#2563eb] block">7219.34.01</span>
              <span className="text-[11px] text-black/[0.7] mt-0.5 block">
                Enrollados en frío, espesor 0.5 a 1.0 mm (Confianza 86.5%)
              </span>
            </div>

            <div className="p-2.5 bg-white border border-black/[0.12] rounded-[8px]">
              <span className="font-mono font-bold text-black/[0.7] block">7219.90.00.00</span>
              <span className="text-[11px] text-black/[0.7] mt-0.5 block">
                Los demás productos planos de acero inoxidable (Confianza 82.0%)
              </span>
            </div>
          </div>
        </div>

        {/* Título en forma de pregunta real de trabajo */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
            Criterio Determinante de Nomenclatura
          </span>
          <h2 className="text-base sm:text-lg font-bold text-black mt-1 leading-snug">
            ¿El producto se encuentra enrollado o en hojas cortadas rectas?
          </h2>
          <p className="text-xs text-black/[0.6] mt-1 leading-relaxed">
            La estructura del Capítulo 72 separa taxativamente los productos planos presentados en bobinas enrolladas de aquellos cortados en hojas individuales o placas rectangulares.
          </p>
        </div>

        {/* Opciones visibles a la vista (Elegir, no teclear) */}
        <div className="space-y-3">
          {OPCIONES.map((opcion) => {
            const seleccionada = opcionSeleccionada === opcion.id;
            return (
              <button
                key={opcion.id}
                type="button"
                onClick={() => setOpcionSeleccionada(opcion.id)}
                className={`w-full p-4 rounded-[10px] border text-left transition-all ${
                  seleccionada
                    ? 'border-[#2563eb] bg-[#2563eb]/[0.05] ring-1 ring-[#2563eb]'
                    : 'border-black/[0.12] bg-white hover:border-black/[0.3]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Ilustración tangible física */}
                  <div className="w-10 h-10 rounded-[8px] bg-white border border-black/[0.12] flex-shrink-0 flex items-center justify-center p-1.5">
                    {opcion.icono === 'bobina' && (
                      <div className="w-6 h-6 rounded-full border-2 border-black/[0.8] flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full border border-black/[0.6]" />
                      </div>
                    )}
                    {opcion.icono === 'hoja' && (
                      <div className="w-5 h-6 bg-white border border-black/[0.8] rounded-[2px] flex flex-col p-0.5 justify-around">
                        <div className="w-full h-0.5 bg-black/[0.3]" />
                        <div className="w-full h-0.5 bg-black/[0.3]" />
                        <div className="w-full h-0.5 bg-black/[0.3]" />
                      </div>
                    )}
                    {opcion.icono === 'duda' && (
                      <span className="font-mono text-sm font-bold text-black/[0.6]">?</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-black">
                        {opcion.titulo}
                      </span>
                      {seleccionada && (
                        <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-300">
                          Seleccionada
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-black/[0.7] mt-1 leading-normal">
                      <span className="font-medium text-black/[0.8]">Consecuencia: </span>
                      {opcion.consecuencia}
                    </div>
                    <div className="text-[11px] font-mono text-[#2563eb] font-semibold mt-1">
                      Destino arancelario: {opcion.subpartidaEfecto}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Acciones de recálculo y navegación */}
        <div className="pt-4 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onVolver}
            className="w-full sm:w-auto px-4 py-3 border border-black/[0.12] hover:border-black/[0.3] text-black text-xs font-medium rounded-[10px] transition-colors"
          >
            ← Volver a Validación
          </button>

          <button
            type="button"
            disabled={recalculando}
            onClick={handleConfirmar}
            className="w-full sm:w-auto px-6 py-3 bg-[#2563eb] text-white font-semibold text-xs sm:text-sm rounded-[10px] hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            {recalculando ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Recalculando reglas de nomenclatura...</span>
              </>
            ) : (
              <span>Registrar Respuesta y Recalcular Confianza →</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PreguntaDecisiva;
