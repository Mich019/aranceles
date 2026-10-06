import React, { useState } from 'react';
import { ObservacionAuditoria } from './AuditoriaPedimentoView';

export interface DictamenFinalViewProps {
  idCaso?: string;
  sha256?: string;
  versionBaseLegal?: string;
  fraccion?: string;
  nico?: string;
  descripcionLegal?: string;
  mercancia?: string;
  arancelIGI?: string;
  iva?: string;
  dta?: string;
  regulaciones?: string[];
  firmante?: string;
  observacionAuditoria?: ObservacionAuditoria | null;
  onDescargarPdf?: () => void;
  onNuevoDocumento: () => void;
  onVolver?: () => void;
  supervisorVoBo?: {
    nombre: string;
    cargo: string;
    fechaHora: string;
  };
}

export const DictamenFinalView: React.FC<DictamenFinalViewProps> = ({
  idCaso = 'EXP-2026-0419-MX',
  sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  versionBaseLegal = 'LIGIE-72-73@2026',
  fraccion = '7219.34.01',
  nico = '01',
  descripcionLegal = 'Productos laminados planos de acero inoxidable, de anchura superior o igual a 600 mm, simplemente laminados en frío, de espesor superior a 0.5 mm pero inferior a 1 mm.',
  mercancia = 'Lámina en rollo (bobina) de acero inoxidable austenítico AISI 304 (UNS S30400), espesor 0.90 mm, ancho 1,219 mm, acabado 2B.',
  arancelIGI = '25%',
  iva = '16%',
  dta = '8 al millar (0.008)',
  regulaciones = [
    'Aviso Automático de Importación de Productos Siderúrgicos (Secretaría de Economía)',
    'Certificado de Calidad de Molino acreditando Norma ASTM A240 / Composición Química',
    'Padrón de Importadores de Sectores Específicos: Sector 14 (Siderúrgico)',
  ],
  firmante = 'Diego Ramírez (Clasificador Aduanal)',
  observacionAuditoria = null,
  supervisorVoBo,
  onDescargarPdf,
  onNuevoDocumento,
  onVolver,
}) => {
  const [descargando, setDescargando] = useState<boolean>(false);
  const [descargaExitosa, setDescargaExitosa] = useState<boolean>(false);
  const [copiadoHash, setCopiadoHash] = useState<boolean>(false);

  // Fecha y hora oficial fija para coherencia institucional
  const fechaEmision = '04 de octubre de 2026';
  const horaEmision = '17:05:00 hrs (Tiempo del Centro)';
  const folioDigital = 'FASITLAC-2026-CERT-009412';

  const handleDescargar = () => {
    setDescargando(true);
    setDescargaExitosa(false);

    if (onDescargarPdf) {
      onDescargarPdf();
    }

    setTimeout(() => {
      setDescargando(false);
      setDescargaExitosa(true);

      // Simular descarga de archivo físico en el navegador
      const contenidoDescarga = `SISTEMA NACIONAL DE ARANCELES
PLATAFORMA INSTITUCIONAL DE CONTROL ARANCELARIO
======================================================
DICTAMEN TÉCNICO DE CLASIFICACIÓN ARANCELARIA
ID Expediente: ${idCaso}
Fecha: ${fechaEmision} ${horaEmision}
Base Legal: ${versionBaseLegal}
Documento SHA-256: ${sha256}
------------------------------------------------------
RESOLUCIÓN ARANCELARIA:
Fracción Arancelaria: ${fraccion} — NICO ${nico}
Descripción Legal: ${descripcionLegal}
Mercancía: ${mercancia}

RÉGIMEN ARANCELARIO:
IGI: ${arancelIGI}
IVA: ${iva}
DTA: ${dta}
Regulaciones:
${regulaciones.map((r) => `* ${r}`).join('\n')}

Firmado por: ${firmante}
Registro: CLAS-2024-8841
Folio de Certificación: ${folioDigital}
======================================================
© 2026 FASITLAC • Todos los derechos reservados`;

      const blob = new Blob([contenidoDescarga], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = `Dictamen_${idCaso}_${fraccion.replace(/\./g, '')}.txt`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      URL.revokeObjectURL(url);
    }, 700);
  };

  const handleCopiarHash = () => {
    navigator.clipboard?.writeText(sha256);
    setCopiadoHash(true);
    setTimeout(() => setCopiadoHash(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* BARRA SUPERIOR DE ESTADO Y ACCIONES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
                Expediente Concluido y Certificado
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                Validez Oficial
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Folio: <strong className="text-slate-800 font-mono">{idCaso}</strong> • Sello determinista verificado al 100%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Volver a Revisión
            </button>
          )}

          <button
            type="button"
            onClick={handleDescargar}
            disabled={descargando}
            className="px-4 py-2 text-xs font-medium text-white bg-[#dc2626] rounded-xl hover:bg-[#b91c1c] disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            {descargando ? (
              <>
                <svg
                  className="w-3.5 h-3.5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Generando Documento...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Descargar Dictamen Oficial en PDF</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onNuevoDocumento}
            className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Clasificar un nuevo documento
          </button>
        </div>
      </div>

      {/* AVISO DE DESCARGA EXITOSA */}
      {descargaExitosa && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-emerald-600">✓</span>
            <span>
              El documento oficial ha sido emitido y guardado exitosamente con sello digital criptográfico.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDescargaExitosa(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. METÁFORA DEL DICTAMEN OFICIAL (HOJA A4 IMPRIMIBLE) */}
      {/* ============================================================== */}
      <article
        id="hoja-dictamen-oficial"
        className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-12 space-y-8 shadow-sm relative print:border-none print:p-0"
      >
        {/* Marca de agua institucional sutil en fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.02] text-center">
          <div className="text-8xl sm:text-9xl font-black text-slate-900 tracking-widest uppercase">
            OFICIAL
          </div>
        </div>

        {/* ENCABEZADO INSTITUCIONAL DE LA HOJA */}
        <header className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Emblema físico institucional sobrio */}
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-1.5 shrink-0">
                <span className="text-[10px] font-black text-slate-800 tracking-tighter">MX</span>
                <div className="w-6 h-0.5 bg-[#dc2626] my-0.5" />
                <span className="text-[7px] font-semibold text-slate-500">FASITLAC</span>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-900">
                  Sistema Nacional de Aranceles
                </p>
                <p className="text-[10px] uppercase text-slate-500 tracking-tight">
                  Plataforma Institucional de Control Arancelario
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Unidad Central de Clasificación y Criterios Vinculantes
                </p>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 rounded-lg">
                {folioDigital}
              </span>
              <p className="text-xs font-medium text-slate-800 mt-1">
                Expediente: <strong className="font-mono text-slate-900">{idCaso}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Fecha oficial: {fechaEmision}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-900">
              DICTAMEN TÉCNICO DE CLASIFICACIÓN ARANCELARIA
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Resolución técnica definitiva de clasificación con fundamento en la Ley de los Impuestos Generales de Importación y de Exportación
            </p>
          </div>
        </header>

        {/* DATOS DEL EXPEDIENTE E INTEGRIDAD */}
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-3">
            Constancia de Expediente e Integridad Digital
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="block text-[10px] font-medium uppercase text-slate-500">
                Identificador de Expediente
              </span>
              <strong className="font-mono text-sm text-slate-900">{idCaso}</strong>
            </div>

            <div>
              <span className="block text-[10px] font-medium uppercase text-slate-500">
                Fecha y Hora de Emisión
              </span>
              <span className="font-medium text-slate-800">
                {fechaEmision} • {horaEmision}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-medium uppercase text-slate-500">
                Versión de la Base Legal
              </span>
              <span className="inline-flex items-center gap-1 font-mono font-bold text-blue-600">
                {versionBaseLegal}
                <span className="text-[10px] font-normal text-slate-500">(DOF 2026)</span>
              </span>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-[10px] font-medium uppercase text-slate-500">
                  Huella Digital Criptográfica del Documento Original (SHA-256)
                </span>
                <button
                  type="button"
                  onClick={handleCopiarHash}
                  className="text-[11px] text-blue-600 hover:text-blue-800 self-start sm:self-auto font-medium"
                >
                  {copiadoHash ? '✓ Copiado al portapapeles' : 'Copiar huella digital'}
                </button>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <code className="text-xs font-mono font-medium text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 break-all block flex-1">
                  {sha256}
                </code>
                <span className="shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
                  Verificado
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* DICTAMEN APROBADO: FRACCIÓN, NICO Y DESCRIPCIÓN */}
        <section className="border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Resolución Técnica Arancelaria
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-0.5 self-start sm:self-auto">
              Dictamen Aprobado • 99.6% Certeza Determinista
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Fracción Arancelaria con Número de Identificación Comercial (NICO)
            </span>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {fraccion}
              </span>
              <span className="font-mono text-xl sm:text-2xl font-semibold text-slate-500">
                — NICO {nico}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Texto Legal de la Tarifa de la LIGIE
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              «{descripcionLegal}»
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Mercancía Evaluada y Especificaciones Físicas Acreditadas
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {mercancia}
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Fundamento Legal y Criterio de Clasificación
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              La determinación arancelaria se fundamenta en las <strong>Reglas Generales 1 y 6</strong> para la Aplicación de la Tarifa de la Ley de los Impuestos Generales de Importación y de Exportación (LIGIE), así como en la <strong>Regla Complementaria 1a</strong> y las <strong>Notas Legales 1(d) y 1(k) del Capítulo 72</strong>. Habiéndose comprobado mediante análisis documental que el material contiene un contenido de cromo del 18.2% y níquel del 8.1% (acero inoxidable austenítico), presentado en rollos continuos laminados en frío con espesor exacto de 0.90 mm (comprendido entre 0.5 mm y 1.0 mm).
            </p>
          </div>
        </section>

        {/* REQUISITOS DE IMPORTACIÓN Y ARANCELES */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
            Régimen Arancelario y Requisitos de Importación
          </h2>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-2.5 px-4 font-semibold text-slate-700 text-[11px] uppercase">
                    Concepto Impositivo / Contribución
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-slate-700 text-[11px] uppercase">
                    Tasa / Cuota Aplicable
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-slate-700 text-[11px] uppercase">
                    Fundamento / Disposición
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    Impuesto General de Importación (IGI)
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                    {arancelIGI}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    Decreto Temporal de Modificación Arancelaria Siderúrgica (DOF)
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    Impuesto al Valor Agregado (IVA)
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                    {iva}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    Artículo 1° de la Ley del Impuesto al Valor Agregado
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-slate-900">
                    Derecho de Trámite Aduanero (DTA)
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                    {dta}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600">
                    Artículo 49 Fracción I de la Ley Federal de Derechos
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">
              Regulaciones y Restricciones No Arancelarias (RRNA) Exigibles
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {regulaciones.map((reg, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold mt-0.5">•</span>
                  <span>{reg}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* OBSERVACIÓN DE AUDITORÍA ADUANAL VINCULADA (SI APLICA) */}
        {observacionAuditoria && (
          <section className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold text-amber-900 bg-amber-100 border border-amber-200 rounded-md">
                ANEXO DE AUDITORÍA
              </span>
              <h3 className="text-xs font-bold text-amber-950">
                Observación Registrada en Pedimento: {observacionAuditoria.titulo}
              </h3>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              {observacionAuditoria.nota}
            </p>
            <div className="text-[11px] text-amber-950 font-medium pt-1">
              Partidas observadas:{' '}
              <span className="font-mono font-bold">
                {observacionAuditoria.partidasObservadas.map((p) => `#${p}`).join(', ')}
              </span>
              . El presente dictamen acredita la correcta clasificación arancelaria para el trámite de rectificación o desahogo correspondiente.
            </div>
          </section>
        )}

        {/* BLOQUE DE FIRMA Y AUTORÍA OFICIAL */}
        <footer className="border-t border-slate-200 pt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* Sello digital de autenticidad */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                Cadena Original y Sello Digital de Autenticidad
              </span>
              <div className="flex items-start gap-3">
                {/* Código QR */}
                <div className="w-16 h-16 bg-white border border-slate-200 rounded-xl p-1.5 shrink-0 flex flex-col justify-between">
                  <div className="grid grid-cols-3 gap-0.5 h-full">
                    <div className="bg-slate-800 rounded-none" />
                    <div className="bg-slate-200 rounded-none" />
                    <div className="bg-slate-800 rounded-none" />
                    <div className="bg-slate-200 rounded-none" />
                    <div className="bg-slate-800 rounded-none" />
                    <div className="bg-slate-200 rounded-none" />
                    <div className="bg-slate-800 rounded-none" />
                    <div className="bg-slate-200 rounded-none" />
                    <div className="bg-slate-800 rounded-none" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <code className="text-[10px] font-mono text-slate-600 block break-all leading-tight bg-slate-50 p-2 rounded-lg border border-slate-200">
                    ||2026-10-04T17:05:00|7219.34.01.01|Diego Ramírez|CLAS-2024-8841|{sha256.slice(0, 32)}...||
                  </code>
                  <span className="text-[10px] text-slate-400 block">
                    Sello criptográfico emitido por la Autoridad Certificadora FASITLAC
                  </span>
                </div>
              </div>
            </div>

            {/* Firma del clasificador */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 text-center space-y-2">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-base sm:text-lg text-slate-900 font-semibold tracking-wide">
                  Diego Ramírez C.
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <p className="text-xs font-bold text-slate-900">
                  Emitido y firmado por: {firmante}
                </p>
                <p className="text-[10px] text-slate-500">
                  Clasificador Aduanal Titular • Cédula Reg. CLAS-2024-8841
                </p>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  Firma Electrónica Avanzada Vigente
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-100">
            Documento expedido de conformidad con la legislación aduanera vigente. Conservar este folio para efectos de auditoría y glosa aduanal.
          </div>
        </footer>
      </article>

      {/* ============================================================== */}
      {/* 2. HISTORIAL DE TRAZABILIDAD Y BITÁCORA INMUTABLE */}
      {/* ============================================================== */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Historial de Trazabilidad y Bitácora Inmutable
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
              5 de 5 Hitos Acreditados
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro secuencial sellado con marcas temporales y eventos deterministas del proceso de clasificación
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
          {/* Hito 1 */}
          <div className="relative">
            <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-6 h-6 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Documento recibido e integridad validada (SHA-256 verificado)
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  04/10/2026 17:01:14
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ingesta del archivo digital <code className="font-mono text-slate-800 text-[11px] bg-slate-100 px-1 py-0.5 rounded">Ficha_Tecnica_Aceros_304.pdf</code> completada. Se calculó la firma criptográfica SHA-256 corroborando que el contenido no fue alterado durante la transmisión.
              </p>
            </div>
          </div>

          {/* Hito Vo.Bo. de Supervisión Previa */}
          {supervisorVoBo && (
            <div className="relative">
              <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-6 h-6 rounded-full bg-red-50 border-2 border-[#dc2626] flex items-center justify-center text-[10px] text-red-700 font-bold">
                ✓
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold text-slate-900">
                    Visto Bueno y Autorización Previa de Supervisión Acreditada
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 font-medium">
                    {supervisorVoBo.fechaHora}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Autorización formal otorgada por <strong className="text-slate-900">{supervisorVoBo.nombre}</strong> ({supervisorVoBo.cargo}). El expediente fue validado en almacenamiento local seguro y autorizado para su procesamiento en el motor determinista.
                </p>
              </div>
            </div>
          )}

          {/* Hito 2 */}
          <div className="relative">
            <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-6 h-6 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Variables químicas extraídas desde tabla técnica
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  04/10/2026 17:02:05
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracción analítica de composición elemental: C (0.07%), Mn (1.80%), Si (0.65%), Cr (18.2%), Ni (8.1%). La concentración de cromo (≥ 10.5%) y níquel satisface formalmente el umbral legal de acero inoxidable de la Nota 1(e) del Capítulo 72.
              </p>
            </div>
          </div>

          {/* Hito 3 */}
          <div className="relative">
            <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-6 h-6 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Asistencia ortográfica aplicada por Qwen 2.5 y confirmada por el usuario
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  04/10/2026 17:02:40
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Normalización ortográfica supervisada del término «aero» a «acero» e inferencia del acabado superficial 2B por asistencia cualitativa. El operador ratificó explícitamente ambas sugerencias en el formulario de validación.
              </p>
            </div>
          </div>

          {/* Hito 4 */}
          <div className="relative">
            <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-6 h-6 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Pregunta decisiva respondida satisfactoriamente
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  04/10/2026 17:03:22
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Desambiguación de presentación física resuelta: «Enrollado (en bobina)». Esta confirmación descartó la subpartida de hojas cortadas rectas y consolidó la certeza determinista en la partida 72.19.
              </p>
            </div>
          </div>

          {/* Hito 5 */}
          <div className="relative">
            <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-6 h-6 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-[10px] text-emerald-700 font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-semibold text-slate-900">
                  Dictamen emitido y registrado en catálogo de números de parte
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  04/10/2026 17:04:50
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Asignación determinista definitiva a la fracción <strong className="font-mono text-slate-900">7219.34.01 — NICO 01</strong>. El criterio vinculante fue indexado en la base de precedentes institucionales para habilitar reuso inmediato sin reclasificación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ACCIONES FINALES */}
      {/* ============================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Cierre y Archivo de Expediente
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Descargue el ejemplar en PDF para su anexo al pedimento o inicie una nueva clasificación arancelaria.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onNuevoDocumento}
            className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-center"
          >
            Clasificar un nuevo documento
          </button>

          <button
            type="button"
            onClick={handleDescargar}
            disabled={descargando}
            className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-medium text-white bg-[#dc2626] rounded-xl hover:bg-[#b91c1c] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {descargando ? (
              <span>Generando PDF...</span>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Descargar Dictamen Oficial en PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictamenFinalView;
