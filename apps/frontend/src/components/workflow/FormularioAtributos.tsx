import React, { useState } from 'react';

export interface AtributosValidados {
  material: string;
  forma: string;
  espesor: number;
  proceso: string;
  recubrimiento: string;
  ancho: number;
  norma: string;
  trazabilidad: Record<string, string>;
}

export interface FormularioAtributosProps {
  highlightedField?: string | null;
  onHoverField?: (campo: string | null) => void;
  onConfirmar: (atributos: AtributosValidados) => void;
  onVolver: () => void;
  qwenActivo?: boolean;
  layaActivo?: boolean;
}

export const FormularioAtributos: React.FC<FormularioAtributosProps> = ({
  highlightedField = null,
  onHoverField,
  onConfirmar,
  onVolver,
  qwenActivo = true,
  layaActivo = true,
}) => {
  // 1. Estado de los atributos normalizados
  const [material, setMaterial] = useState<string>('inoxidable');
  const [forma, setForma] = useState<string>('plano_enrollado');
  const [espesor, setEspesor] = useState<number>(0.90);
  const [proceso, setProceso] = useState<string>('frio');
  const [recubrimiento, setRecubrimiento] = useState<string>('sin_recubrimiento');

  // 2. Estados de confirmación de asistencia IA (Qwen 2.5 y Laya)
  const [qwenAceptado, setQwenAceptado] = useState<boolean>(false);
  const [layaAceptado, setLayaAceptado] = useState<boolean>(false);

  const handleMouseEnter = (campo: string) => {
    if (onHoverField) onHoverField(campo);
  };

  const handleMouseLeave = () => {
    if (onHoverField) onHoverField(null);
  };

  const handleIncrementEspesor = () => {
    setEspesor((prev) => parseFloat((prev + 0.05).toFixed(2)));
  };

  const handleDecrementEspesor = () => {
    setEspesor((prev) => Math.max(0.10, parseFloat((prev - 0.05).toFixed(2))));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmar({
      material: material === 'inoxidable' ? 'Acero inoxidable austenítico (AISI 304)' : 'Hierro o acero sin alear',
      forma: forma === 'plano_enrollado' ? 'Producto plano enrollado (bobina / coil)' : forma,
      espesor,
      proceso: proceso === 'frio' ? 'Laminado en frío (Cold Rolled)' : 'Laminado en caliente',
      recubrimiento: recubrimiento === 'sin_recubrimiento' ? 'Sin recubrir ni chapar' : recubrimiento,
      ancho: 1219,
      norma: 'ASTM A240',
      trazabilidad: {
        material: 'Tabla química (Cr 18.2%, Ni 8.1%) - Confianza 100%',
        forma: 'Regex / Sinónimo documental - Confianza 95%',
        espesor: 'Tabla de dimensiones mecánicas - Confianza 100%',
        norma: 'Norma ASTM A240',
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-black/[0.12] rounded-[18px] p-6 space-y-6">
      
      {/* Encabezado del panel con indicador de trazabilidad */}
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
        <div>
          <h3 className="text-base font-bold text-black leading-tight">
            Confirmación y Corrección de Atributos
          </h3>
          <p className="text-xs text-black/[0.4] mt-0.5">
            Compruebe la procedencia de cada variable y confirme los valores detectados.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-black/[0.4] block">Partida Arancelaria Base</span>
          <span className="text-xs font-mono font-bold text-[#2563eb]">Capítulo 72 • 72.19</span>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* ========================================================================= */}
        {/* 1. CAPÍTULO Y MATERIAL (CON ASISTENCIA QWEN 2.5 SI APLICA) */}
        {/* ========================================================================= */}
        <div
          onMouseEnter={() => handleMouseEnter('tipo_acero')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-[10px] border transition-all ${
            highlightedField === 'tipo_acero'
              ? 'border-[#2563eb] bg-[#2563eb]/[0.02] ring-1 ring-[#2563eb]'
              : 'border-black/[0.12] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-black">
              1. Capítulo y Clasificación del Material:
            </label>
            {/* Traza de origen obligatoria */}
            <span className="text-[10px] font-mono text-black/[0.6] bg-black/[0.04] px-2 py-0.5 rounded-[4px] border border-black/[0.08]">
              Origen: Tabla (Confianza 100%) • Cr 18.2% / Ni 8.1%
            </span>
          </div>

          {/* Opciones directas (Elegir, no teclear) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setMaterial('inoxidable')}
              className={`p-3 rounded-[10px] border text-left transition-all ${
                material === 'inoxidable'
                  ? 'border-[#2563eb] bg-[#2563eb]/[0.06] ring-1 ring-[#2563eb]'
                  : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">Acero Inoxidable</span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                  Detectado
                </span>
              </div>
              <p className="text-[11px] text-black/[0.6] mt-1 leading-tight">
                Cumple Nota 1(e) Cap. 72 (C ≤ 1.2% y Cr ≥ 10.5%). Aleación Cr-Ni.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMaterial('sin_alear')}
              className={`p-3 rounded-[10px] border text-left transition-all ${
                material === 'sin_alear'
                  ? 'border-[#2563eb] bg-[#2563eb]/[0.06] ring-1 ring-[#2563eb]'
                  : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">Hierro o Acero sin alear</span>
                <span className="text-[10px] text-black/[0.4]">Partidas 72.08 – 72.17</span>
              </div>
              <p className="text-[11px] text-black/[0.6] mt-1 leading-tight">
                Sin contenido suficiente de aleantes (Cr &lt; 10.5%).
              </p>
            </button>
          </div>

          {/* Advertencia obligatoria para normalización Qwen 2.5 */}
          {qwenActivo && !qwenAceptado && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-[10px] text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 mt-1 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">Corrección ortográfica Qwen 2.5:</span> Se corrigió la errata OCR «aero inoxable» a «acero inoxidable».
                  <div className="text-[11px] text-amber-900/[0.8] mt-0.5">
                    Atributo sugerido por asistencia. Requiere su confirmación formal.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQwenAceptado(true)}
                className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-semibold rounded-[8px] border border-amber-400 self-end sm:self-center transition-colors flex-shrink-0"
              >
                Aceptar sugerencia
              </button>
            </div>
          )}

          {qwenAceptado && (
            <div className="mt-2 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
              <span>Sugerencia ortográfica de Qwen 2.5 confirmada por el usuario.</span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. FORMA Y PRESENTACIÓN FÍSICA (4 OPCIONES EN TARJETAS) */}
        {/* ========================================================================= */}
        <div
          onMouseEnter={() => handleMouseEnter('forma')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-[10px] border transition-all ${
            highlightedField === 'forma'
              ? 'border-[#2563eb] bg-[#2563eb]/[0.02] ring-1 ring-[#2563eb]'
              : 'border-black/[0.12] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-black">
              2. Forma y Presentación Física del Producto:
            </label>
            <span className="text-[10px] font-mono text-black/[0.6] bg-black/[0.04] px-2 py-0.5 rounded-[4px] border border-black/[0.08]">
              Origen: Regex / Sinónimo (Confianza 95%)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'plano_enrollado', label: 'Plano enrollado', sub: 'Bobina / Coil (≥ 600 mm)', badge: 'Detectado' },
              { id: 'barra', label: 'Barra maciza', sub: 'Sección circular o cuadrada' },
              { id: 'perfil', label: 'Perfil estructural', sub: 'Vigas en U, I, H, T' },
              { id: 'alambre', label: 'Alambre trefilado', sub: 'Sección enrollada &lt; 14 mm' },
            ].map((op) => {
              const seleccionado = forma === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setForma(op.id)}
                  className={`p-3 rounded-[10px] border text-left transition-all ${
                    seleccionado
                      ? 'border-[#2563eb] bg-[#2563eb]/[0.06] ring-1 ring-[#2563eb]'
                      : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-black">{op.label}</span>
                    {op.badge && (
                      <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1 rounded border border-emerald-300 font-semibold">
                        {op.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-black/[0.5] mt-1 block leading-tight">
                    {op.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. ESPESOR CALIBRADO (CONTROL NUMÉRICO − / + GRANDE) */}
        {/* ========================================================================= */}
        <div
          onMouseEnter={() => handleMouseEnter('espesor')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-[10px] border transition-all ${
            highlightedField === 'espesor'
              ? 'border-[#2563eb] bg-[#2563eb]/[0.02] ring-1 ring-[#2563eb]'
              : 'border-black/[0.12] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-xs font-bold text-black block">
                3. Espesor Nominal Calibrado:
              </label>
              <span className="text-[11px] text-black/[0.5]">
                Criterio determinante de subpartida en la partida 72.19 (&lt; 0.5 mm, 0.5–1 mm, 1–3 mm, &gt; 3 mm).
              </span>
            </div>
            <span className="text-[10px] font-mono text-black/[0.6] bg-black/[0.04] px-2 py-0.5 rounded-[4px] border border-black/[0.08]">
              Origen: Norma ASTM A240 • Confianza 100%
            </span>
          </div>

          <div className="flex items-center gap-4 bg-black/[0.02] p-3 rounded-[10px] border border-black/[0.12]">
            {/* Botón Decremento Grande */}
            <button
              type="button"
              onClick={handleDecrementEspesor}
              className="w-12 h-12 bg-white border border-black/[0.2] hover:border-black/[0.4] rounded-[10px] flex items-center justify-center text-xl font-bold text-black transition-colors"
              title="Disminuir espesor"
            >
              −
            </button>

            {/* Display Numérico Grande */}
            <div className="flex-1 text-center bg-white border border-black/[0.15] py-2 px-4 rounded-[10px]">
              <span className="text-2xl font-mono font-bold text-black tracking-tight">
                {espesor.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-black/[0.6] ml-2">
                milímetros (mm)
              </span>
              <div className="text-[10px] text-emerald-800 font-medium mt-0.5">
                {espesor >= 0.5 && espesor <= 1.0 ? 'Subpartida 7219.34 (0.5 mm a 1.0 mm)' : 'Espesor fuera del rango 7219.34'}
              </div>
            </div>

            {/* Botón Incremento Grande */}
            <button
              type="button"
              onClick={handleIncrementEspesor}
              className="w-12 h-12 bg-white border border-black/[0.2] hover:border-black/[0.4] rounded-[10px] flex items-center justify-center text-xl font-bold text-black transition-colors"
              title="Aumentar espesor"
            >
              +
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. PROCESO DE FABRICACIÓN (LAMINADO EN FRÍO VS CALIENTE) */}
        {/* ========================================================================= */}
        <div
          onMouseEnter={() => handleMouseEnter('proceso')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-[10px] border transition-all ${
            highlightedField === 'proceso'
              ? 'border-[#2563eb] bg-[#2563eb]/[0.02] ring-1 ring-[#2563eb]'
              : 'border-black/[0.12] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-black">
              4. Proceso Tecnológico de Conformado:
            </label>
            <span className="text-[10px] font-mono text-black/[0.6] bg-black/[0.04] px-2 py-0.5 rounded-[4px] border border-black/[0.08]">
              Origen: Tabla (Confianza 100%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setProceso('frio')}
              className={`p-3 rounded-[10px] border text-left transition-all ${
                proceso === 'frio'
                  ? 'border-[#2563eb] bg-[#2563eb]/[0.06] ring-1 ring-[#2563eb]'
                  : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">Laminado en frío (Cold Rolled)</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300 font-semibold">
                  Detectado
                </span>
              </div>
              <p className="text-[11px] text-black/[0.6] mt-1 leading-tight">
                Subpartidas 7219.31 a 7219.35 (simplemente laminados en frío).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setProceso('caliente')}
              className={`p-3 rounded-[10px] border text-left transition-all ${
                proceso === 'caliente'
                  ? 'border-[#2563eb] bg-[#2563eb]/[0.06] ring-1 ring-[#2563eb]'
                  : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">Laminado en caliente (Hot Rolled)</span>
                <span className="text-[10px] text-black/[0.4]">Subpartidas 7219.11 a 7219.24</span>
              </div>
              <p className="text-[11px] text-black/[0.6] mt-1 leading-tight">
                Simplemente laminados en caliente sin desbaste posterior en frío.
              </p>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. RECUBRIMIENTO / ACABADO (CON ASISTENCIA LAYA SI APLICA) */}
        {/* ========================================================================= */}
        <div
          onMouseEnter={() => handleMouseEnter('acabado')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-[10px] border transition-all ${
            highlightedField === 'acabado'
              ? 'border-[#2563eb] bg-[#2563eb]/[0.02] ring-1 ring-[#2563eb]'
              : 'border-black/[0.12] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-black">
              5. Estado de Recubrimiento y Acabado Superficial:
            </label>
            <span className="text-[10px] font-mono text-black/[0.6] bg-black/[0.04] px-2 py-0.5 rounded-[4px] border border-black/[0.08]">
              Origen: Deducción Laya • Acabado 2B
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'sin_recubrimiento', label: 'Sin recubrimiento', sub: 'Acabado 2B natural' },
              { id: 'galvanizado', label: 'Galvanizado', sub: 'Cincado por inmersión' },
              { id: 'pintado', label: 'Pintado / Barnizado', sub: 'Recubrimiento orgánico' },
              { id: 'al_zn', label: 'Aleación Al-Zn', sub: 'Galvalume / Aluzinc' },
            ].map((rec) => {
              const activo = recubrimiento === rec.id;
              return (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setRecubrimiento(rec.id)}
                  className={`p-2.5 rounded-[10px] border text-left transition-all ${
                    activo
                      ? 'border-[#2563eb] bg-[#2563eb]/[0.06] ring-1 ring-[#2563eb]'
                      : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
                  }`}
                >
                  <span className="text-xs font-bold text-black block">{rec.label}</span>
                  <span className="text-[10px] text-black/[0.5] block mt-0.5 leading-tight">{rec.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Advertencia obligatoria para inferencia de Laya */}
          {layaActivo && !layaAceptado && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-[10px] text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600 mt-1 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">Inferencia cualitativa Laya:</span> Se dedujo «Sin recubrimiento» a partir del término técnico «Acabado 2B (recocido y decapado)».
                  <div className="text-[11px] text-amber-900/[0.8] mt-0.5">
                    Atributo sugerido por asistencia. Requiere su confirmación formal.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLayaAceptado(true)}
                className="px-3 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-semibold rounded-[8px] border border-amber-400 self-end sm:self-center transition-colors flex-shrink-0"
              >
                Aceptar sugerencia
              </button>
            </div>
          )}

          {layaAceptado && (
            <div className="mt-2 text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
              <span>Inferencia cualitativa de Laya confirmada por el usuario.</span>
            </div>
          )}
        </div>

      </div>

      {/* Botones de acción inferior */}
      <div className="pt-4 border-t border-black/[0.08] flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onVolver}
          className="px-4 py-3 border border-black/[0.12] hover:border-black/[0.3] text-black text-xs font-medium rounded-[10px] transition-colors"
        >
          ← Volver a Ingesta
        </button>

        <button
          type="submit"
          className="py-3 px-6 bg-[#2563eb] text-white font-semibold text-xs sm:text-sm rounded-[10px] hover:opacity-90 transition-opacity"
        >
          Confirmar Atributos y Evaluar Reglas Arancelarias →
        </button>
      </div>

    </form>
  );
};

export default FormularioAtributos;
