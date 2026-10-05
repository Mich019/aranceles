import React, { useState } from 'react';
import ExcepcionesModal, { TipoExcepcion } from './ExcepcionesModal';

export interface IngestaViewProps {
  tipoDocumento: 'ficha' | 'pedimento';
  setTipoDocumento: (tipo: 'ficha' | 'pedimento') => void;
  onDocumentoCargado: (detalles: {
    nombreArchivo: string;
    tipo: 'ficha' | 'pedimento';
    formato: string;
    sha256: string;
    peso: string;
    numeroParte?: string;
    proveedor?: string;
  }) => void;
  onExcepcionResuelta?: (tipo: TipoExcepcion, datos?: any) => void;
}

const FORMATOS_DISPONIBLES = [
  { id: 'pdf', label: 'PDF Técnico', ext: '.pdf', desc: 'Fichas, catálogos y especificaciones de norma' },
  { id: 'excel', label: 'Hoja Excel', ext: '.xlsx, .csv', desc: 'Listas de empaque y tablas de composición' },
  { id: 'word', label: 'Documento Word', ext: '.docx', desc: 'Certificados de origen y dictámenes previos' },
  { id: 'ocr', label: 'Imagen / Escaneo OCR', ext: '.png, .jpg', desc: 'Fotografías de placa o escaneo físico' },
];

const PRESELECCIONES_RAPIDAS = [
  {
    id: 'acero-304',
    tipo: 'ficha' as const,
    archivo: 'Ficha_Tecnica_Rollo_Acero_Inox_304.pdf',
    peso: '3.4 MB',
    formato: 'pdf',
    numeroParte: 'NP-ACERO-304-X',
    proveedor: 'Aceros Mex S.A. de C.V.',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'pedimento-aduana',
    tipo: 'pedimento' as const,
    archivo: 'Pedimento_Aduanal_Importacion_2026.pdf',
    peso: '1.8 MB',
    formato: 'pdf',
    numeroParte: 'PED-2026-ECU-00918',
    proveedor: 'Consignatario Industrial Quito',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
];

export const IngestaView: React.FC<IngestaViewProps> = ({
  tipoDocumento,
  setTipoDocumento,
  onDocumentoCargado,
}) => {
  const [formatoSeleccionado, setFormatoSeleccionado] = useState<string>('pdf');
  const [numeroParteActivo, setNumeroParteActivo] = useState<string>('NP-ACERO-304-X');
  const [proveedorActivo, setProveedorActivo] = useState<string>('Aceros Mex S.A. de C.V.');
  const [modoArrastre, setModoArrastre] = useState<boolean>(false);
  const [progresoCarga, setProgresoCarga] = useState<number | null>(null);
  const [archivoEnProceso, setArchivoEnProceso] = useState<string | null>(null);
  const [hashCalculado, setHashCalculado] = useState<string | null>(null);
  const [modalExcepcion, setModalExcepcion] = useState<TipoExcepcion | null>(null);

  const iniciarCargaSimulada = (opcion: typeof PRESELECCIONES_RAPIDAS[0]) => {
    setTipoDocumento(opcion.tipo);
    setArchivoEnProceso(opcion.archivo);
    setProgresoCarga(0);
    setHashCalculado(null);

    const intervalo = setInterval(() => {
      setProgresoCarga((prev) => {
        if (prev === null) return 20;
        if (prev >= 100) {
          clearInterval(intervalo);
          setHashCalculado(opcion.sha256);
          setTimeout(() => {
            onDocumentoCargado({
              nombreArchivo: opcion.archivo,
              tipo: opcion.tipo,
              formato: opcion.formato,
              sha256: opcion.sha256,
              peso: opcion.peso,
              numeroParte: opcion.numeroParte,
              proveedor: opcion.proveedor,
            });
          }, 450);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. RECEPCIÓN DEL DOCUMENTO (sin tarjetas: secciones separadas por línea) */}
      <div>

        {/* Encabezado instructivo */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">
            Seleccione o deposite el documento a clasificar
          </h2>
          <p className="text-sm text-black/[0.7] mt-1">
            El archivo se revisa y se verifica su integridad antes de continuar.
          </p>
        </div>

        {/* 2. TIPO DE TRÁMITE */}
        <section className="border-t border-black/[0.12] py-5">
          <h3 className="text-sm font-semibold text-black mb-2">¿Qué documento va a revisar?</h3>
          <ul role="radiogroup" aria-label="Tipo de trámite">
            {[
              { id: 'ficha' as const, titulo: 'Ficha técnica de fabricante', linea: 'Se extraen composición, tolerancias y normas.' },
              { id: 'pedimento' as const, titulo: 'Pedimento aduanal', linea: 'Se compara lo declarado contra la mercancía.' },
            ].map((op) => {
              const activo = tipoDocumento === op.id;
              return (
                <li key={op.id}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => setTipoDocumento(op.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-[10px] transition-colors ${
                      activo ? 'bg-[#2563eb]/[0.08]' : 'hover:bg-black/[0.04]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${activo ? 'border-[#2563eb]' : 'border-black/[0.4]'}`}>
                      {activo && <span className="w-2 h-2 rounded-full bg-[#2563eb]" />}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-black">{op.titulo}</span>
                      <span className="block text-xs text-black/[0.7]">{op.linea}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 3. NÚMERO DE PARTE (OPCIONAL) */}
        <section className="border-t border-black/[0.12] py-5">
          <h3 className="text-sm font-semibold text-black mb-2">
            ¿El producto ya tiene número de parte? <span className="font-normal text-black/[0.4]">(opcional)</span>
          </h3>
          <ul role="radiogroup" aria-label="Número de parte">
            {[
              { np: 'NP-ACERO-304-X', prov: 'Aceros Mex S.A. de C.V.' },
              { np: 'NP-BARRAS-7228-B', prov: 'Siderúrgica del Sur C.A.' },
            ].map((op) => {
              const activo = numeroParteActivo === op.np;
              return (
                <li key={op.np}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => {
                      setNumeroParteActivo(op.np);
                      setProveedorActivo(op.prov);
                    }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-[10px] transition-colors ${
                      activo ? 'bg-[#2563eb]/[0.08]' : 'hover:bg-black/[0.04]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${activo ? 'border-[#2563eb]' : 'border-black/[0.4]'}`}>
                      {activo && <span className="w-2 h-2 rounded-full bg-[#2563eb]" />}
                    </span>
                    <span className="text-sm text-black">
                      <span className="font-mono font-semibold">{op.np}</span>
                      <span className="text-black/[0.7]"> — Proveedor: {op.prov}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 4. FORMATO DEL ARCHIVO */}
        <section className="border-t border-black/[0.12] py-5">
          <h3 className="text-sm font-semibold text-black mb-2">¿En qué formato está el archivo?</h3>
          <ul role="radiogroup" aria-label="Formato del archivo" className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            {FORMATOS_DISPONIBLES.map((formato) => {
              const activo = formatoSeleccionado === formato.id;
              return (
                <li key={formato.id}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => setFormatoSeleccionado(formato.id)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-3 min-h-[48px] rounded-[10px] transition-colors ${
                      activo ? 'bg-[#2563eb]/[0.08]' : 'hover:bg-black/[0.04]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${activo ? 'border-[#2563eb]' : 'border-black/[0.4]'}`}>
                      {activo && <span className="w-2 h-2 rounded-full bg-[#2563eb]" />}
                    </span>
                    <span className="text-sm text-black">
                      <span className="font-semibold">{formato.label}</span>
                      <span className="text-black/[0.4] font-mono text-xs"> {formato.ext}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 5. ZONA DE ARRASTRE */}
        <section className="border-t border-black/[0.12] py-5">
          <div
            role="region"
            aria-label="Zona para depositar documento"
            onDragOver={(e) => {
              e.preventDefault();
              setModoArrastre(true);
            }}
            onDragLeave={() => setModoArrastre(false)}
            onDrop={(e) => {
              e.preventDefault();
              setModoArrastre(false);
              iniciarCargaSimulada(PRESELECCIONES_RAPIDAS[0]);
            }}
            className={`border-2 border-dashed rounded-[10px] p-10 text-center transition-colors ${
              modoArrastre ? 'border-[#2563eb] bg-[#2563eb]/[0.08]' : 'border-black/[0.2] hover:border-black/[0.4]'
            }`}
          >
            <div className="w-12 h-16 mx-auto bg-white border border-black/[0.12] rounded-[6px] flex flex-col p-2 justify-between mb-3">
              <div className="w-5 h-1 bg-[#2563eb]" />
              <div className="space-y-1">
                <div className="w-full h-0.5 bg-black/[0.12]" />
                <div className="w-full h-0.5 bg-black/[0.12]" />
                <div className="w-3/4 h-0.5 bg-black/[0.12]" />
              </div>
            </div>
            <p className="text-base font-semibold text-black">Deposite el documento aquí o elija un archivo del equipo</p>
            <p className="text-sm text-black/[0.7] mt-1">PDF, Excel, Word o imagen • Hasta 25 MB</p>
          </div>
        </section>

        {/* 6. DOCUMENTOS DE EJEMPLO */}
        <section className="border-t border-black/[0.12] py-5">
          <h3 className="text-sm font-semibold text-black mb-2">¿Prefiere usar un documento de ejemplo?</h3>
          <ul>
            {[
              { idx: 0, titulo: 'Ficha técnica: rollo de acero inoxidable 304 (PDF)', peso: '3.4 MB', linea: 'ASTM A240 • Espesor 1.5 mm • Acabado 2B' },
              { idx: 1, titulo: 'Pedimento aduanal de importación (PDF)', peso: '1.8 MB', linea: 'Declaración de despacho con subpartida 7219.34' },
            ].map((d) => (
              <li key={d.idx} className="border-b border-black/[0.06] last:border-b-0">
                <button
                  type="button"
                  disabled={progresoCarga !== null && progresoCarga < 100}
                  onClick={() => iniciarCargaSimulada(PRESELECCIONES_RAPIDAS[d.idx])}
                  className="w-full text-left px-3 py-3 min-h-[48px] rounded-[10px] hover:bg-black/[0.04] transition-colors disabled:opacity-50"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-semibold text-black">{d.titulo}</span>
                    <span className="text-xs font-mono text-black/[0.4]">{d.peso}</span>
                  </span>
                  <span className="block text-xs text-black/[0.7] mt-0.5">{d.linea}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* 7. PROGRESO E INTEGRIDAD */}
        {progresoCarga !== null && (
          <section className="border-t border-black/[0.12] py-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-black">Procesando: {archivoEnProceso}</span>
              <span className="font-mono text-black/[0.7]">{progresoCarga}%</span>
            </div>
            <div className="w-full h-2 bg-black/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-[#2563eb] transition-all duration-150" style={{ width: `${progresoCarga}%` }} />
            </div>
            {hashCalculado ? (
              <div className="text-sm">
                <p className="text-emerald-800 font-semibold">Integridad del documento verificada.</p>
                <p className="font-mono text-xs text-black/[0.7] break-all mt-0.5">{hashCalculado}</p>
              </div>
            ) : (
              <p className="text-sm text-amber-900">Verificando integridad del documento…</p>
            )}
          </section>
        )}

        {/* 8. CASOS ESPECIALES */}
        <section className="border-t border-black/[0.12] py-5">
          <h3 className="text-sm font-semibold text-black mb-2">¿Quiere ver qué pasa en un caso especial?</h3>
          <ul>
            <li>
              <button type="button" onClick={() => setModalExcepcion('ocr_error')} className="w-full text-left px-3 py-3 min-h-[48px] rounded-[10px] hover:bg-black/[0.04] transition-colors">
                <span className="block text-sm font-semibold text-amber-900">Documento ilegible</span>
                <span className="block text-xs text-black/[0.7]">El texto no se alcanza a leer: se pasa a captura manual guiada.</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setModalExcepcion('fuera_alcance')} className="w-full text-left px-3 py-3 min-h-[48px] rounded-[10px] hover:bg-black/[0.04] transition-colors">
                <span className="block text-sm font-semibold text-rose-800">Material fuera de alcance</span>
                <span className="block text-xs text-black/[0.7]">No es hierro ni acero (Capítulos 72 y 73): se indica el capítulo correcto.</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setModalExcepcion('reuso')} className="w-full text-left px-3 py-3 min-h-[48px] rounded-[10px] hover:bg-black/[0.04] transition-colors">
                <span className="block text-sm font-semibold text-emerald-800">Documento ya clasificado</span>
                <span className="block text-xs text-black/[0.7]">Coincide con un expediente aprobado: se reutiliza el dictamen 2026-0142.</span>
              </button>
            </li>
          </ul>
        </section>

      </div>

      {/* Modal de Excepciones Tangible */}
      <ExcepcionesModal
        isOpen={modalExcepcion !== null}
        tipo={modalExcepcion}
        onClose={() => setModalExcepcion(null)}
        onResolver={(accion, datos) => {
          setModalExcepcion(null);
          if (onExcepcionResuelta) {
            onExcepcionResuelta(modalExcepcion!, datos);
          } else {
            if (accion === 'captura_manual') {
              onDocumentoCargado({
                nombreArchivo: 'Captura_Manual_Guiada.pdf',
                tipo: 'ficha',
                formato: 'pdf',
                sha256: 'manual-input-hash-2026',
                peso: 'N/A',
                numeroParte: 'MANUAL-INPUT-01',
                proveedor: 'Declaración Directa',
              });
            } else if (accion === 'confirmar_reuso') {
              onDocumentoCargado({
                nombreArchivo: 'Expediente_Precedente_2026_0142.pdf',
                tipo: 'ficha',
                formato: 'pdf',
                sha256: 'precedente-homologado-2026-0142',
                peso: '1.2 MB',
                numeroParte: 'NP-ACERO-304-X',
                proveedor: 'Aceros Mex S.A. de C.V.',
              });
            }
          }
        }}
      />
    </div>
  );
};

export default IngestaView;
