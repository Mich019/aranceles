import React, { useState } from 'react';

export interface RankingViewProps {
  fraccion?: string;
  confianza?: number;
  onAprobar: (datosAprobacion: {
    fraccion: string;
    confianza: number;
    fundamento: string;
    observacion?: string;
  }) => void;
  onCorregirManual?: (motivo: string, fraccionCorregida: string) => void;
  onVolver: () => void;
}

interface AlternativaDescartada {
  posicion: string;
  fraccion: string;
  confianza: number;
  motivoDescarte: string;
}

const ALTERNATIVAS_DESCARTADAS: AlternativaDescartada[] = [
  {
    posicion: '2da',
    fraccion: '7219.33.01 — NICO 00',
    confianza: 0.842,
    motivoDescarte: 'El espesor calibrado de 0.90 mm supera el rango máximo establecido para esta subpartida (de espesor superior a 1 mm pero inferior a 3 mm).',
  },
  {
    posicion: '3ra',
    fraccion: '7219.35.01 — NICO 00',
    confianza: 0.120,
    motivoDescarte: 'Fracción reservada exclusivamente para espesores estrictamente inferiores a 0.5 mm.',
  },
];

export const RankingView: React.FC<RankingViewProps> = ({
  fraccion = '7219.34.01 — NICO 01',
  confianza = 0.996,
  onAprobar,
  onCorregirManual,
  onVolver,
}) => {
  const [modoCorreccion, setModoCorreccion] = useState<boolean>(false);
  const [fraccionManual, setFraccionManual] = useState<string>('7219.33.01');
  const [motivoManual, setMotivoManual] = useState<string>('');
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);

  const handleAprobarSugerida = () => {
    onAprobar({
      fraccion,
      confianza,
      fundamento: 'Reglas Generales 1 y 6 de la LIGIE. Notas 1(d) y 1(k) del Capítulo 72.',
    });
  };

  const handleConfirmarCorreccion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivoManual.trim()) {
      setErrorValidacion('Escriba el motivo u observación técnica obligatoria para justificar la corrección.');
      return;
    }
    setErrorValidacion(null);
    if (onCorregirManual) {
      onCorregirManual(motivoManual, fraccionManual);
    } else {
      onAprobar({
        fraccion: fraccionManual,
        confianza: 1.0,
        fundamento: 'Corrección manual autorizada por el clasificador.',
        observacion: motivoManual,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-2">
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Encabezado y certeza determinista */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#dc2626]">
                Resolución del Motor Determinista
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#0f172a] mt-0.5">
                Clasificación Arancelaria Resultante
              </h2>
            </div>

            <div className="flex items-center gap-2 text-[#065f46] bg-[#ecfdf5] border border-[#a7f3d0] px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
              <span>{(confianza * 100).toFixed(1)}% Coincidencia Determinista • Nivel Óptimo</span>
            </div>
          </div>

          {/* Tarjeta de Fracción Determinada */}
          <div className="p-5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-2">
            <span className="text-xs text-[#64748b] block font-mono">
              Fracción Arancelaria Determinada:
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-[#0f172a] tracking-tight">
              {fraccion}
            </div>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pt-2 border-t border-[#e2e8f0]">
              <strong>Descripción oficial LIGIE:</strong> «Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío, de espesor superior a 0.5 mm pero inferior a 1 mm».
            </p>
          </div>
        </div>

        {/* Fundamentación Técnica y Trazabilidad */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
            <h3 className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Fundamentación Técnica y Trazabilidad Legal
            </h3>
            <span className="text-[11px] text-[#94a3b8]">Auditoría Nivel 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Variables Coincidentes */}
            <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl space-y-2">
              <span className="text-xs font-semibold text-[#0f172a] block">
                Variables Coincidentes Verificadas:
              </span>
              <ul className="text-xs text-[#64748b] space-y-1.5 list-disc pl-4 leading-normal">
                <li>
                  <strong className="text-[#0f172a]">Espesor:</strong> 0.90 mm se encuentra dentro del rango legal [0.5 mm, 1.0 mm].
                </li>
                <li>
                  <strong className="text-[#0f172a]">Proceso:</strong> Laminado en frío verificado mediante acabado 2B.
                </li>
                <li>
                  <strong className="text-[#0f172a]">Química:</strong> Cr 18.20% y Ni 8.10% cumplen definición de acero inoxidable.
                </li>
              </ul>
            </div>

            {/* Notas Legales */}
            <div className="p-4 bg-white border border-[#e2e8f0] rounded-xl space-y-2">
              <span className="text-xs font-semibold text-[#0f172a] block">
                Notas Legales de Nomenclatura:
              </span>
              <ul className="text-xs text-[#64748b] space-y-1.5 list-disc pl-4 leading-normal">
                <li>
                  <strong className="text-[#0f172a]">Nota 1(d) Cap. 72:</strong> Definición de acero inoxidable por contenido de cromo.
                </li>
                <li>
                  <strong className="text-[#0f172a]">Nota 1(k) Cap. 72:</strong> Definición de productos laminados planos enrollados.
                </li>
                <li>
                  <strong className="text-[#0f172a]">Reglas Generales 1 y 6:</strong> Determinación formal por texto de partida y subpartida.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alternativas Descartadas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
            <h3 className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Alternativas Evaluadas y Motivo de Descarte
            </h3>
            <span className="text-[11px] text-[#94a3b8]">Opciones secundarias</span>
          </div>

          <div className="space-y-2">
            {ALTERNATIVAS_DESCARTADAS.map((alt) => (
              <div
                key={alt.fraccion}
                className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-[#64748b] border border-[#cbd5e1] bg-white px-2 py-0.5 rounded">
                    {alt.posicion}
                  </span>
                  <div>
                    <span className="text-xs font-mono font-semibold text-[#0f172a] block">
                      {alt.fraccion}
                    </span>
                    <span className="text-[11px] text-[#64748b] mt-0.5 block leading-tight">
                      <strong className="text-[#e11d48] font-medium">Motivo: </strong>
                      {alt.motivoDescarte}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 self-end sm:self-center">
                  <span className="text-xs font-mono text-[#64748b]">
                    {(alt.confianza * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modalidad de Corrección Manual */}
        {modoCorreccion && (
          <form
            onSubmit={handleConfirmarCorreccion}
            className="p-5 bg-[#fffbeb] border border-[#fde68a] rounded-xl space-y-4"
          >
            <div>
              <span className="text-xs font-bold text-[#92400e] uppercase tracking-wide block">
                Discrepancia de Clasificación Manual
              </span>
              <p className="text-xs text-[#78350f] mt-0.5">
                Para apartarse de la recomendación algorítmica, fundamente el motivo técnico en el expediente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1" htmlFor="fraccion-corregida">
                  Fracción arancelaria asignada:
                </label>
                <input
                  type="text"
                  id="fraccion-corregida"
                  value={fraccionManual}
                  onChange={(e) => setFraccionManual(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg font-mono text-xs font-bold text-[#0f172a] focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1" htmlFor="norma-fundamento">
                  Precedente o regla de apoyo:
                </label>
                <input
                  type="text"
                  id="norma-fundamento"
                  defaultValue="Criterio Vinculante Clasificatorio 2025-08"
                  className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#0f172a] focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1" htmlFor="motivo-tecnico">
                Motivo u observación técnica requerida:
              </label>
              <textarea
                id="motivo-tecnico"
                rows={2}
                value={motivoManual}
                onChange={(e) => setMotivoManual(e.target.value)}
                placeholder="Explique la razón técnica o legal..."
                className="w-full px-3 py-2 bg-white border border-[#cbd5e1] rounded-lg text-xs text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:border-[#dc2626]"
              />
              {errorValidacion && (
                <span className="text-[11px] text-[#e11d48] font-medium block mt-1">
                  {errorValidacion}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setModoCorreccion(false)}
                className="px-3.5 py-1.5 border border-[#cbd5e1] text-xs text-[#475569] rounded-lg hover:bg-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#b45309] hover:bg-[#92400e] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Confirmar Asignación Manual
              </button>
            </div>
          </form>
        )}

        {/* Acciones */}
        <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onVolver}
            className="w-full sm:w-auto px-4 py-2.5 border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#64748b] text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            ← Volver a Desambiguación
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {!modoCorreccion && (
              <button
                type="button"
                onClick={() => setModoCorreccion(true)}
                className="w-full sm:w-auto px-4 py-2.5 border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#475569] text-xs font-medium rounded-lg bg-white transition-colors cursor-pointer"
              >
                Corregir manualmente
              </button>
            )}

            <button
              type="button"
              onClick={handleAprobarSugerida}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#dc2626] text-white font-medium text-xs sm:text-sm rounded-lg hover:bg-[#b91c1c] transition-colors cursor-pointer shadow-sm"
            >
              Aprobar Fracción y Continuar a Auditoría →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RankingView;
