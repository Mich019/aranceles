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
    <form onSubmit={handleSubmit} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-7 space-y-6 shadow-xs">
      
      {/* Encabezado del panel */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
        <div>
          <h3 className="text-base font-bold text-[#0f172a] leading-tight">
            Validación de Atributos Extraídos
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Verifique la procedencia de cada variable y confirme los valores detectados.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-[#94a3b8] block uppercase">Partida Determinada</span>
          <span className="text-xs font-mono font-bold text-[#dc2626]">Capítulo 72 • 72.19</span>
        </div>
      </div>

      <div className="space-y-5">
        
        {/* 1. CAPÍTULO Y MATERIAL */}
        <div
          onMouseEnter={() => handleMouseEnter('tipo_acero')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-xl border transition-all ${
            highlightedField === 'tipo_acero'
              ? 'border-[#dc2626] bg-[#fef2f2]/30 ring-1 ring-[#dc2626]'
              : 'border-[#e2e8f0] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-[#0f172a]">
              1. Clasificación del Material
            </label>
            <span className="text-[11px] font-mono text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
              Cr 18.2% / Ni 8.1% • ASTM A240
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setMaterial('inoxidable')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                material === 'inoxidable'
                  ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                  : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0f172a]">Acero Inoxidable</span>
                <span className="text-[10px] text-[#065f46] font-medium bg-[#ecfdf5] px-1.5 py-0.5 rounded border border-[#a7f3d0]">
                  Detectado
                </span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1 leading-tight">
                Cumple Nota 1(e) Cap. 72 (C ≤ 1.2% y Cr ≥ 10.5%). Aleación austenítica.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMaterial('sin_alear')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                material === 'sin_alear'
                  ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                  : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0f172a]">Hierro o Acero sin alear</span>
                <span className="text-[10px] text-[#94a3b8]">Partidas 72.08 – 72.17</span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1 leading-tight">
                Sin contenido suficiente de aleantes (Cr &lt; 10.5%).
              </p>
            </button>
          </div>

          {/* Sugerencia Qwen compacta y limpia */}
          {qwenActivo && !qwenAceptado && (
            <div className="mt-2.5 p-2.5 bg-[#fffbeb] border border-[#fde68a] rounded-lg text-xs text-[#92400e] flex items-center justify-between gap-3">
              <span className="text-xs">
                <strong>Qwen 2.5:</strong> Corrección tipográfica aplicada («aero inoxable» → «acero inoxidable»).
              </span>
              <button
                type="button"
                onClick={() => setQwenAceptado(true)}
                className="px-2.5 py-1 bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-[11px] font-semibold rounded border border-[#fcd34d] transition-colors shrink-0 cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          )}

          {qwenAceptado && (
            <div className="mt-2 text-[11px] text-[#059669] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span>Normalización ortográfica confirmada.</span>
            </div>
          )}
        </div>

        {/* 2. FORMA Y PRESENTACIÓN */}
        <div
          onMouseEnter={() => handleMouseEnter('forma')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-xl border transition-all ${
            highlightedField === 'forma'
              ? 'border-[#dc2626] bg-[#fef2f2]/30 ring-1 ring-[#dc2626]'
              : 'border-[#e2e8f0] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-[#0f172a]">
              2. Forma y Presentación Física
            </label>
            <span className="text-[11px] font-mono text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
              Extracción documental
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    seleccionado
                      ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                      : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#0f172a]">{op.label}</span>
                    {op.badge && (
                      <span className="text-[9px] text-[#065f46] bg-[#ecfdf5] px-1 rounded border border-[#a7f3d0] font-medium">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#64748b] mt-0.5 block leading-tight">
                    {op.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. ESPESOR CALIBRADO */}
        <div
          onMouseEnter={() => handleMouseEnter('espesor')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-xl border transition-all ${
            highlightedField === 'espesor'
              ? 'border-[#dc2626] bg-[#fef2f2]/30 ring-1 ring-[#dc2626]'
              : 'border-[#e2e8f0] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <label className="text-xs font-semibold text-[#0f172a] block">
                3. Espesor Nominal Calibrado
              </label>
              <span className="text-[11px] text-[#64748b]">
                Criterio determinante para subpartida de la partida 72.19
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
              ASTM A240 • 0.90 mm
            </span>
          </div>

          <div className="flex items-center gap-3 bg-[#f8fafc] p-2.5 rounded-xl border border-[#e2e8f0]">
            <button
              type="button"
              onClick={handleDecrementEspesor}
              className="w-10 h-10 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-lg flex items-center justify-center text-lg font-bold text-[#0f172a] transition-colors cursor-pointer"
              title="Disminuir espesor"
            >
              −
            </button>

            <div className="flex-1 text-center py-1">
              <span className="text-xl font-mono font-bold text-[#0f172a]">
                {espesor.toFixed(2)}
              </span>
              <span className="text-xs font-medium text-[#64748b] ml-1.5">
                mm
              </span>
              <span className="text-[11px] text-[#059669] font-medium ml-3">
                {espesor >= 0.5 && espesor <= 1.0 ? '• Rango Subpartida 7219.34 (0.5 a 1.0 mm)' : '• Rango exterior'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleIncrementEspesor}
              className="w-10 h-10 bg-white border border-[#cbd5e1] hover:border-[#94a3b8] rounded-lg flex items-center justify-center text-lg font-bold text-[#0f172a] transition-colors cursor-pointer"
              title="Aumentar espesor"
            >
              +
            </button>
          </div>
        </div>

        {/* 4. PROCESO TECNOLÓGICO */}
        <div
          onMouseEnter={() => handleMouseEnter('proceso')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-xl border transition-all ${
            highlightedField === 'proceso'
              ? 'border-[#dc2626] bg-[#fef2f2]/30 ring-1 ring-[#dc2626]'
              : 'border-[#e2e8f0] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-[#0f172a]">
              4. Proceso de Conformado
            </label>
            <span className="text-[11px] font-mono text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
              Laminación
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setProceso('frio')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                proceso === 'frio'
                  ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                  : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0f172a]">Laminado en frío (Cold Rolled)</span>
                <span className="text-[10px] text-[#065f46] font-medium bg-[#ecfdf5] px-1.5 py-0.5 rounded border border-[#a7f3d0]">
                  Detectado
                </span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1 leading-tight">
                Subpartidas 7219.31 a 7219.35 (simplemente laminados en frío).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setProceso('caliente')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                proceso === 'caliente'
                  ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                  : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0f172a]">Laminado en caliente (Hot Rolled)</span>
                <span className="text-[10px] text-[#94a3b8]">Subpartidas 7219.11 a 7219.24</span>
              </div>
              <p className="text-[11px] text-[#64748b] mt-1 leading-tight">
                Simplemente laminados en caliente sin desbaste posterior en frío.
              </p>
            </button>
          </div>
        </div>

        {/* 5. RECUBRIMIENTO / ACABADO */}
        <div
          onMouseEnter={() => handleMouseEnter('acabado')}
          onMouseLeave={handleMouseLeave}
          className={`p-4 rounded-xl border transition-all ${
            highlightedField === 'acabado'
              ? 'border-[#dc2626] bg-[#fef2f2]/30 ring-1 ring-[#dc2626]'
              : 'border-[#e2e8f0] bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs font-semibold text-[#0f172a]">
              5. Acabado y Recubrimiento
            </label>
            <span className="text-[11px] font-mono text-[#64748b] bg-[#f1f5f9] px-2 py-0.5 rounded">
              Acabado 2B
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
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    activo
                      ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                      : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
                  }`}
                >
                  <span className="text-xs font-semibold text-[#0f172a] block">{rec.label}</span>
                  <span className="text-[10px] text-[#64748b] block mt-0.5 leading-tight">{rec.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Sugerencia Laya compacta */}
          {layaActivo && !layaAceptado && (
            <div className="mt-2.5 p-2.5 bg-[#fffbeb] border border-[#fde68a] rounded-lg text-xs text-[#92400e] flex items-center justify-between gap-3">
              <span className="text-xs">
                <strong>Laya:</strong> Inferencia cualitativa («Sin recubrimiento» a partir de «Acabado 2B recocido y decapado»).
              </span>
              <button
                type="button"
                onClick={() => setLayaAceptado(true)}
                className="px-2.5 py-1 bg-[#fef3c7] hover:bg-[#fde68a] text-[#78350f] text-[11px] font-semibold rounded border border-[#fcd34d] transition-colors shrink-0 cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          )}

          {layaAceptado && (
            <div className="mt-2 text-[11px] text-[#059669] flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              <span>Inferencia cualitativa confirmada.</span>
            </div>
          )}
        </div>

      </div>

      {/* Botones de acción inferior */}
      <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onVolver}
          className="px-4 py-2.5 border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#64748b] text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          ← Volver a Ingesta
        </button>

        <button
          type="submit"
          className="py-2.5 px-5 bg-[#dc2626] text-white font-medium text-xs sm:text-sm rounded-lg hover:bg-[#b91c1c] transition-colors cursor-pointer shadow-sm"
        >
          Confirmar Atributos y Evaluar Reglas →
        </button>
      </div>

    </form>
  );
};

export default FormularioAtributos;
