import React, { useState } from 'react';

export interface VisorDocumentoProps {
  nombreArchivo?: string;
  highlightedField?: string | null;
  onHoverEvidence?: (campo: string | null) => void;
}

export const VisorDocumento: React.FC<VisorDocumentoProps> = ({
  nombreArchivo = 'Ficha_Tecnica_Aceros_304.pdf',
  highlightedField = null,
  onHoverEvidence,
}) => {
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const totalPaginas = 2;
  const [zoomNivel, setZoomNivel] = useState<number>(100);

  const toggleZoom = () => {
    setZoomNivel((prev) => (prev === 100 ? 125 : prev === 125 ? 150 : 100));
  };

  const handleMouseEnter = (campo: string) => {
    if (onHoverEvidence) onHoverEvidence(campo);
  };

  const handleMouseLeave = () => {
    if (onHoverEvidence) onHoverEvidence(null);
  };

  const isHighlighted = (campo: string) => highlightedField === campo;

  // Clase para los fragmentos de evidencia textual
  const getHighlightClass = (campo: string) => {
    const activo = isHighlighted(campo);
    return `inline-block px-1 py-0.5 rounded-[4px] cursor-pointer transition-all ${
      activo
        ? 'bg-amber-200 text-black border-b-2 border-amber-600 ring-2 ring-amber-400/[0.4] font-semibold'
        : 'bg-amber-100 text-black border-b border-amber-400 hover:bg-amber-200'
    }`;
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-xs">
      
      {/* 1. BARRA SUPERIOR DE CONTROL DEL DOCUMENTO */}
      <div className="bg-white border-b border-[#e2e8f0] px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Nombre y tipo físico del archivo */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-6 bg-[#fef2f2] border border-[#dc2626]/30 rounded-[3px] flex flex-col p-0.5 justify-between shrink-0">
            <div className="w-2.5 h-0.5 bg-[#dc2626] rounded-xs" />
            <div className="space-y-0.5">
              <div className="w-full h-0.5 bg-[#fca5a5]" />
              <div className="w-full h-0.5 bg-[#fca5a5]" />
            </div>
          </div>
          <span className="text-xs font-semibold text-[#0f172a] truncate" title={nombreArchivo}>
            {nombreArchivo}
          </span>
          <span className="text-[10px] text-[#64748b] font-mono shrink-0">
            (3.4 MB)
          </span>
        </div>

        {/* Controles de paginación (− / +) y Lupa */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Paginador */}
          <div className="flex items-center border border-[#e2e8f0] rounded-lg bg-[#f8fafc] p-0.5">
            <button
              type="button"
              disabled={paginaActual <= 1}
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#0f172a] disabled:opacity-30 hover:bg-white rounded transition-colors cursor-pointer"
              title="Página anterior"
            >
              −
            </button>
            <span className="text-[11px] font-medium text-[#475569] px-2 select-none">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              type="button"
              disabled={paginaActual >= totalPaginas}
              onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              className="w-6 h-6 flex items-center justify-center text-xs font-bold text-[#0f172a] disabled:opacity-30 hover:bg-white rounded transition-colors cursor-pointer"
              title="Página siguiente"
            >
              +
            </button>
          </div>

          {/* Botón de zoom */}
          <button
            type="button"
            onClick={toggleZoom}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#475569] bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] rounded-lg transition-colors cursor-pointer"
            title="Ajustar ampliación visual"
          >
            <svg
              className="w-3.5 h-3.5 text-[#64748b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M21 21l-4.35-4.35" />
            </svg>
            <span className="font-mono text-[11px]">{zoomNivel}%</span>
          </button>
        </div>
      </div>

      {/* 2. ÁREA DE VISUALIZACIÓN DE LA HOJA FÍSICA (SCROLLABLE) */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center">
        
        {/* LA HOJA FÍSICA DE PAPEL BLANCO CON MÁRGENES DE 24px */}
        <div
          style={{ width: `${zoomNivel}%`, maxWidth: zoomNivel === 100 ? '680px' : `${(680 * zoomNivel) / 100}px` }}
          className="bg-white border border-[#e2e8f0] rounded-lg p-6 text-[#0f172a] transition-all select-text duration-150 leading-relaxed font-sans text-xs shadow-xs"
        >
          {/* PÁGINA 1: FICHA TÉCNICA PRINCIPAL */}
          {paginaActual === 1 && (
            <div className="space-y-5">
              
              {/* Membrete de la empresa fabricante */}
              <div className="border-b border-slate-300 pb-3 flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-bold tracking-tight text-slate-900">
                    ACEROS ESPECIALES S.A.
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                    División Siderúrgica Industrial • Planta Laminación Frío
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Certificación ISO 9001:2015 • Trazabilidad de Colada
                  </div>
                </div>

                <div className="text-right">
                  <span className="border border-slate-300 bg-slate-50 text-[10px] font-mono px-2 py-0.5 rounded text-slate-700 font-semibold">
                    FT-INOX-2026-03
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Fecha: 14-ENE-2026
                  </div>
                </div>
              </div>

              {/* Título formal de la ficha */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">
                  Ficha Técnica de Homologación de Material
                </span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                  <span
                    className={getHighlightClass('tipo_acero')}
                    onMouseEnter={() => handleMouseEnter('tipo_acero')}
                    onMouseLeave={handleMouseLeave}
                  >
                    ACERO INOXIDABLE AUSTENÍTICO (AISI 304 / UNS S30400)
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Norma de referencia:{' '}
                  <span
                    className={getHighlightClass('norma')}
                    onMouseEnter={() => handleMouseEnter('norma')}
                    onMouseLeave={handleMouseLeave}
                  >
                    ASTM A240 / EN 10088-2
                  </span>
                </span>
              </div>

              {/* Tabla de composición química (% masa) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    1. Composición Química (% en masa según análisis de colada)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Colada N° C-88421</span>
                </div>

                <div className="border border-slate-300 rounded-xl overflow-hidden">
                  <table className="w-full text-center text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-300 font-semibold text-slate-700">
                        <th className="py-1 px-1.5 border-r border-slate-200">Elemento</th>
                        <th className="py-1 px-1.5 border-r border-slate-200">C (Carbono)</th>
                        <th className="py-1 px-1.5 border-r border-slate-200">Mn (Manganeso)</th>
                        <th className="py-1 px-1.5 border-r border-slate-200">Si (Silicio)</th>
                        <th className="py-1 px-1.5 border-r border-slate-200">Cr (Cromo)</th>
                        <th className="py-1 px-1.5">Ni (Níquel)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 font-mono text-slate-600">
                        <td className="py-1.5 px-1.5 border-r border-slate-200 bg-slate-50 font-sans font-semibold">
                          Especificación
                        </td>
                        <td className="py-1.5 px-1.5 border-r border-slate-200">≤ 0.08%</td>
                        <td className="py-1.5 px-1.5 border-r border-slate-200">≤ 2.00%</td>
                        <td className="py-1.5 px-1.5 border-r border-slate-200">≤ 0.75%</td>
                        <td className="py-1.5 px-1.5 border-r border-slate-200">17.5 – 19.5%</td>
                        <td className="py-1.5 px-1.5">8.0 – 10.5%</td>
                      </tr>
                      <tr className="font-mono bg-white font-bold text-slate-900">
                        <td className="py-1.5 px-1.5 border-r border-slate-200 bg-slate-50 font-sans text-left pl-2">
                          Muestra Ensayada
                        </td>
                        <td className="py-1.5 px-1.5 border-r border-slate-200">
                          <span
                            className={getHighlightClass('composicion_c')}
                            onMouseEnter={() => handleMouseEnter('composicion_c')}
                            onMouseLeave={handleMouseLeave}
                          >
                            0.07%
                          </span>
                        </td>
                        <td className="py-1.5 px-1.5 border-r border-slate-200">
                          <span
                            className={getHighlightClass('composicion_mn')}
                            onMouseEnter={() => handleMouseEnter('composicion_mn')}
                            onMouseLeave={handleMouseLeave}
                          >
                            1.80%
                          </span>
                        </td>
                        <td className="py-1.5 px-1.5 border-r border-slate-200">
                          <span
                            className={getHighlightClass('composicion_si')}
                            onMouseEnter={() => handleMouseEnter('composicion_si')}
                            onMouseLeave={handleMouseLeave}
                          >
                            0.65%
                          </span>
                        </td>
                        <td className="py-1.5 px-1.5 border-r border-slate-200">
                          <span
                            className={getHighlightClass('composicion_cr')}
                            onMouseEnter={() => handleMouseEnter('composicion_cr')}
                            onMouseLeave={handleMouseLeave}
                          >
                            18.20%
                          </span>
                        </td>
                        <td className="py-1.5 px-1.5">
                          <span
                            className={getHighlightClass('composicion_ni')}
                            onMouseEnter={() => handleMouseEnter('composicion_ni')}
                            onMouseLeave={handleMouseLeave}
                          >
                            8.10%
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 italic">
                  * Contenido de Cromo ≥ 10.5% y Níquel ≥ 8%: Cumple definición legal de acero inoxidable según Nota 1 (e) del Capítulo 72.
                </p>
              </div>

              {/* Especificaciones mecánicas */}
              <div>
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-1.5">
                  2. Propiedades Mecánicas (Ensayos de Tracción a 20°C)
                </span>
                <div className="grid grid-cols-2 gap-3 border border-slate-200 p-3 rounded-xl bg-slate-50/50">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Límite Elástico Convencional (Rp 0.2%):</span>
                    <span
                      className={`text-xs font-mono font-bold ${getHighlightClass('limite_elastico')}`}
                      onMouseEnter={() => handleMouseEnter('limite_elastico')}
                      onMouseLeave={handleMouseLeave}
                    >
                      290 MPa
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Mínimo exigido: 205 MPa</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Resistencia a la Tracción (Rm):</span>
                    <span
                      className={`text-xs font-mono font-bold ${getHighlightClass('resistencia_traccion')}`}
                      onMouseEnter={() => handleMouseEnter('resistencia_traccion')}
                      onMouseLeave={handleMouseLeave}
                    >
                      620 MPa
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Rango estándar: 515 – 700 MPa</span>
                  </div>
                </div>
              </div>

              {/* Presentación física y dimensiones */}
              <div>
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-1.5">
                  3. Presentación Física y Dimensiones del Embarque
                </span>
                <div className="border border-slate-200 p-3 rounded-xl space-y-2 bg-white">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Forma del producto:</span>
                    <span
                      className={getHighlightClass('forma')}
                      onMouseEnter={() => handleMouseEnter('forma')}
                      onMouseLeave={handleMouseLeave}
                    >
                      Producto plano enrollado (bobina / coil)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Proceso de laminación:</span>
                    <span
                      className={getHighlightClass('proceso')}
                      onMouseEnter={() => handleMouseEnter('proceso')}
                      onMouseLeave={handleMouseLeave}
                    >
                      Laminado en frío (Cold Rolled)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Anchura nominal:</span>
                    <span
                      className={getHighlightClass('ancho')}
                      onMouseEnter={() => handleMouseEnter('ancho')}
                      onMouseLeave={handleMouseLeave}
                    >
                      1,219 mm (≥ 600 mm)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Espesor calibrado:</span>
                    <span
                      className={getHighlightClass('espesor')}
                      onMouseEnter={() => handleMouseEnter('espesor')}
                      onMouseLeave={handleMouseLeave}
                    >
                      0.90 mm (inferior a 1 mm)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Acabado y recubrimiento:</span>
                    <span
                      className={getHighlightClass('acabado')}
                      onMouseEnter={() => handleMouseEnter('acabado')}
                      onMouseLeave={handleMouseLeave}
                    >
                      Acabado 2B sin recubrir ni chapar
                    </span>
                  </div>
                </div>
              </div>

              {/* Pie del documento físico */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Firma del Inspector de Calidad: Ing. M. Morales</span>
                <span className="font-mono">Página 1 de 2</span>
              </div>
            </div>
          )}

          {/* PÁGINA 2: TRAZABILIDAD Y CERTIFICADO DE COLADA */}
          {paginaActual === 2 && (
            <div className="space-y-5">
              <div className="border-b border-slate-300 pb-3 flex items-start justify-between">
                <div>
                  <div className="text-base font-bold text-slate-900">
                    ACEROS ESPECIALES S.A.
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Certificado de Ensayos Mecánicos y Metalográficos
                  </div>
                </div>
                <span className="text-[10px] font-mono border border-slate-300 px-2 py-0.5 rounded text-slate-700 bg-slate-50">
                  ANEXO B - ENSAYOS
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3 border border-slate-200 rounded-xl space-y-1.5 bg-slate-50/50">
                  <span className="font-bold text-slate-900 block">Ensayo de Dureza Rockwell B (HRB)</span>
                  <p className="text-[11px] text-slate-600">
                    Promedio registrado: <strong>82 HRB</strong> (Requisito estándar ≤ 92 HRB). Material suministrado en estado recocido brillante.
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl space-y-1.5 bg-slate-50/50">
                  <span className="font-bold text-slate-900 block">Microestructura Metalográfica</span>
                  <p className="text-[11px] text-slate-600">
                    Matriz 100% austenítica homogénea con tamaño de grano ASTM 7.5. Libre de precipitaciones carbídicas intergranulares.
                  </p>
                </div>

                <div className="p-3 border border-slate-200 rounded-xl space-y-1.5 bg-slate-50/50">
                  <span className="font-bold text-slate-900 block">Trazabilidad de Empaque</span>
                  <p className="text-[11px] text-slate-600">
                    Bobina envuelta en papel VCI anti-corrosión sobre tarima de madera con tratamiento térmico fitosanitario NIMF 15.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Sello y Acreditación de Laboratorio Metalúrgico</span>
                <span className="font-mono">Página 2 de 2</span>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default VisorDocumento;
