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
      <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. SEMÁFORO DE CONFIANZA EXPLÍCITO Y VEREDICTO DETERMINISTA */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563eb]">
              Dictamen y Ranking del Motor Determinista
            </span>

            {/* Badge de semáforo verde estricto (>0.99) */}
            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-[10px] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-700" />
              <span>{(confianza * 100).toFixed(1)}% de Coincidencia Determinista • Nivel de Certeza Óptimo</span>
            </div>
          </div>

          {/* Tarjeta de Fracción Sugerida */}
          <div className="p-5 bg-black/[0.02] border border-black/[0.12] rounded-[10px] space-y-2">
            <span className="text-xs text-black/[0.5] block font-mono">
              Fracción Arancelaria Determinada:
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-black tracking-tight">
              {fraccion}
            </div>
            <p className="text-xs sm:text-sm text-black/[0.8] leading-relaxed pt-1 border-t border-black/[0.08]">
              <strong>Descripción oficial LIGIE:</strong> «Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío, de espesor superior a 0.5 mm pero inferior a 1 mm».
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. JUSTIFICACIÓN AUDITABLE Y DESGLOSADA */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Fundamentación Técnica y Trazabilidad Legal
            </h3>
            <span className="text-[11px] text-black/[0.4]">Auditoría Nivel 1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* A. Variables Coincidentes */}
            <div className="p-4 bg-white border border-black/[0.12] rounded-[10px] space-y-2">
              <span className="text-xs font-bold text-black block">
                Variables Coincidentes Verificadas:
              </span>
              <ul className="text-xs text-black/[0.7] space-y-1.5 list-disc pl-4 leading-normal">
                <li>
                  <strong className="text-black">Espesor:</strong> 0.90 mm se encuentra dentro del rango legal [0.5 mm, 1.0 mm].
                </li>
                <li>
                  <strong className="text-black">Proceso:</strong> Laminado en frío verificado mediante ensayo de tracción y acabado 2B.
                </li>
                <li>
                  <strong className="text-black">Química:</strong> Cr 18.20% y Ni 8.10% cumplen taxativamente definición de acero inoxidable.
                </li>
              </ul>
            </div>

            {/* B. Citas del Documento de Origen */}
            <div className="p-4 bg-white border border-black/[0.12] rounded-[10px] space-y-2">
              <span className="text-xs font-bold text-black block">
                Citas Textuales Extraídas de la Ficha:
              </span>
              <ul className="text-xs text-black/[0.7] space-y-1.5 list-disc pl-4 font-mono leading-normal">
                <li>«ACERO INOXIDABLE AUSTENÍTICO (AISI 304 / UNS S30400)»</li>
                <li>«Composición: Cr 18.20% • Ni 8.10% • C 0.07%»</li>
                <li>«Espesor calibrado: 0.90 mm • Ancho: 1,219 mm»</li>
                <li>«Forma: Producto plano enrollado (bobina / coil)»</li>
              </ul>
            </div>

            {/* C. Notas Legales Aplicadas */}
            <div className="p-4 bg-white border border-black/[0.12] rounded-[10px] space-y-2">
              <span className="text-xs font-bold text-black block">
                Notas Legales de la Nomenclatura:
              </span>
              <ul className="text-xs text-black/[0.7] space-y-1.5 list-disc pl-4 leading-normal">
                <li>
                  <strong className="text-black">Nota 1(d) del Cap. 72:</strong> Clasificación como acero inoxidable por contenido de cromo superior al 10.5% en peso.
                </li>
                <li>
                  <strong className="text-black">Nota 1(k) del Cap. 72:</strong> Definición de productos laminados planos enrollados en espiras superpuestas.
                </li>
                <li>
                  <strong className="text-black">Reglas Generales 1 y 6:</strong> Determinación formal por texto de partida y subpartida de 6 dígitos.
                </li>
              </ul>
            </div>

            {/* D. Regulaciones y Gravámenes Aplicables */}
            <div className="p-4 bg-white border border-black/[0.12] rounded-[10px] space-y-2">
              <span className="text-xs font-bold text-black block">
                Régimen Arancelario y Regulaciones:
              </span>
              <div className="space-y-1.5 text-xs text-black/[0.8]">
                <div className="flex justify-between py-1 border-b border-black/[0.06]">
                  <span className="text-black/[0.6]">Arancel General (IGI):</span>
                  <span className="font-mono font-bold text-black">25.0%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-black/[0.06]">
                  <span className="text-black/[0.6]">Unidad de Medida de Tarifa (UMT):</span>
                  <span className="font-mono font-semibold text-black">Kilogramo (Kg)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-black/[0.6]">Regulación No Arancelaria:</span>
                  <span className="text-emerald-800 font-medium">Aviso Automático Siderúrgico</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. RANKING DE ALTERNATIVAS EVALUADAS (TOP 2 Y 3 DESCARTADAS) */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-black/[0.08]">
            <h3 className="text-xs font-bold text-black uppercase tracking-wider">
              Alternativas Evaluadas y Motivo de Descarte
            </h3>
            <span className="text-[11px] text-black/[0.4]">Opciones subordinadas</span>
          </div>

          <div className="space-y-2.5">
            {ALTERNATIVAS_DESCARTADAS.map((alt) => (
              <div
                key={alt.fraccion}
                className="p-3 bg-black/[0.01] border border-black/[0.12] rounded-[10px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-black/[0.5] border border-black/[0.15] bg-white px-2 py-0.5 rounded-[4px]">
                    {alt.posicion}
                  </span>
                  <div>
                    <span className="text-xs font-mono font-bold text-black block">
                      {alt.fraccion}
                    </span>
                    <span className="text-[11px] text-black/[0.6] mt-0.5 block leading-tight">
                      <strong className="text-rose-800 font-semibold">Motivo de descarte: </strong>
                      {alt.motivoDescarte}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 self-end sm:self-center">
                  <span className="text-[10px] font-mono text-black/[0.5] block">Confianza</span>
                  <span className="text-xs font-mono font-semibold text-black">
                    {(alt.confianza * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MODALIDAD DE CORRECCIÓN MANUAL (DESPLEGABLE) */}
        {/* ========================================================================= */}
        {modoCorreccion && (
          <form
            onSubmit={handleConfirmarCorreccion}
            className="p-5 bg-amber-50/[0.5] border border-amber-300 rounded-[10px] space-y-4 animate-in fade-in duration-150"
          >
            <div>
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wide block">
                Discrepancia de Clasificación Manual
              </span>
              <p className="text-xs text-amber-900 mt-0.5">
                Para apartarse de la recomendación algorítmica, es mandatorio fundamentar el motivo técnico en el registro de auditoría.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-black mb-1" htmlFor="fraccion-corregida">
                  Fracción arancelaria que desea asignar:
                </label>
                <input
                  type="text"
                  id="fraccion-corregida"
                  value={fraccionManual}
                  onChange={(e) => setFraccionManual(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-black/[0.15] rounded-[10px] font-mono text-xs font-bold text-black focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-black mb-1" htmlFor="norma-fundamento">
                  Precedente o regla de apoyo:
                </label>
                <input
                  type="text"
                  id="norma-fundamento"
                  defaultValue="Criterio Vinculante Clasificatorio 2025-08"
                  className="w-full px-3 py-2 bg-white border border-black/[0.15] rounded-[10px] text-xs text-black focus:outline-none focus:border-[#2563eb]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black mb-1" htmlFor="motivo-tecnico">
                Motivo u observación técnica requerida:
              </label>
              <textarea
                id="motivo-tecnico"
                rows={2}
                value={motivoManual}
                onChange={(e) => setMotivoManual(e.target.value)}
                placeholder="Explique detalladamente la razón técnica o legal que desestima la fracción sugerida..."
                className="w-full px-3 py-2 bg-white border border-black/[0.15] rounded-[10px] text-xs text-black placeholder:text-black/[0.4] focus:outline-none focus:border-[#2563eb]"
              />
              {errorValidacion && (
                <span className="text-[11px] text-rose-800 font-medium block mt-1">
                  {errorValidacion}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setModoCorreccion(false)}
                className="px-4 py-2 border border-black/[0.15] text-xs text-black rounded-[8px] hover:bg-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-[8px] transition-colors"
              >
                Confirmar Asignación Manual
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* 5. ACCIONES DEL CLASIFICADOR */}
        {/* ========================================================================= */}
        <div className="pt-4 border-t border-black/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onVolver}
            className="w-full sm:w-auto px-4 py-3 border border-black/[0.12] hover:border-black/[0.3] text-black text-xs font-medium rounded-[10px] transition-colors"
          >
            ← Volver a Desambiguación
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {!modoCorreccion && (
              <button
                type="button"
                onClick={() => setModoCorreccion(true)}
                className="w-full sm:w-auto px-4 py-3 border border-black/[0.15] hover:border-black/[0.3] text-black text-xs font-semibold rounded-[10px] bg-white transition-colors"
              >
                Elegir otra fracción o corregir manualmente
              </button>
            )}

            <button
              type="button"
              onClick={handleAprobarSugerida}
              className="w-full sm:w-auto px-6 py-3 bg-[#2563eb] text-white font-semibold text-xs sm:text-sm rounded-[10px] hover:opacity-90 transition-opacity"
            >
              Aprobar Fracción Sugerida y Generar Dictamen →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RankingView;
