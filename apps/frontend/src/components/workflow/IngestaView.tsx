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
      
      {/* 1. METÁFORA TANGIBLE: LA CARPETA / HOJA RECEPTORA */}
      <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8">
        
        {/* Encabezado instructivo */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
              <span className="text-[11px] font-semibold text-[#2563eb] uppercase tracking-wide">
                Mesa de Entrada Digital
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-black tracking-tight">
              Seleccione o deposite el documento a clasificar
            </h2>
            <p className="text-xs text-black/[0.4] mt-1">
              El archivo ingresará a extracción analítica y normalización ortográfica.
            </p>
          </div>

          {/* Indicador de integridad criptográfica */}
          <div className="bg-black/[0.02] border border-black/[0.12] rounded-[10px] px-3 py-1.5 text-right">
            <span className="text-[10px] text-black/[0.4] block">Protocolo de Ingesta</span>
            <span className="text-xs font-mono font-medium text-black">SHA-256 Validado</span>
          </div>
        </div>

        {/* 2. SELECTOR DE TRÁMITE: INTERRUPTOR DOBLE */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-black/[0.7] mb-2">
            Tipo de trámite aduanero:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipoDocumento('ficha')}
              className={`p-3.5 rounded-[10px] border text-left transition-all ${
                tipoDocumento === 'ficha'
                  ? 'border-[#2563eb] bg-[#2563eb]/[0.05] ring-1 ring-[#2563eb]'
                  : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Hoja física tangible */}
                <div className="w-8 h-10 bg-white border border-black/[0.12] rounded-[4px] flex flex-col p-1 justify-between flex-shrink-0">
                  <div className="w-4 h-1 bg-[#2563eb] rounded-xs" />
                  <div className="space-y-0.5">
                    <div className="w-full h-0.5 bg-black/[0.2]" />
                    <div className="w-full h-0.5 bg-black/[0.2]" />
                    <div className="w-2/3 h-0.5 bg-black/[0.2]" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-black">
                    Ficha Técnica de Fabricante
                  </div>
                  <div className="text-[11px] text-black/[0.6] mt-0.5">
                    Extracción de composición, tolerancias y normas siderúrgicas.
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTipoDocumento('pedimento')}
              className={`p-3.5 rounded-[10px] border text-left transition-all ${
                tipoDocumento === 'pedimento'
                  ? 'border-[#2563eb] bg-[#2563eb]/[0.05] ring-1 ring-[#2563eb]'
                  : 'border-black/[0.12] bg-black/[0.01] hover:border-black/[0.25]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Pedimento físico tangible */}
                <div className="w-8 h-10 bg-white border border-black/[0.12] rounded-[4px] flex flex-col p-1 justify-between flex-shrink-0">
                  <div className="w-full h-1 bg-black/[0.3] rounded-xs" />
                  <div className="space-y-0.5">
                    <div className="w-full h-0.5 bg-black/[0.2]" />
                    <div className="w-full h-0.5 bg-black/[0.2]" />
                    <div className="w-1/2 h-0.5 bg-emerald-700" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-black">
                    Auditoría de Pedimento Aduanal
                  </div>
                  <div className="text-[11px] text-black/[0.6] mt-0.5">
                    Contraste directo entre declaración formal y mercancía física.
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 3. PARÁMETROS PREVIOS DE IDENTIFICACIÓN (OPCIONALES) */}
        <div className="mb-6 p-4 bg-black/[0.02] border border-black/[0.12] rounded-[10px]">
          <div className="text-xs font-semibold text-black/[0.7] mb-2 flex items-center justify-between">
            <span>Parámetros de asociación con catálogo previo:</span>
            <span className="text-[11px] font-normal text-black/[0.4]">Opcional</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setNumeroParteActivo('NP-ACERO-304-X');
                setProveedorActivo('Aceros Mex S.A. de C.V.');
              }}
              className={`p-2.5 rounded-[10px] border text-left text-xs transition-colors ${
                numeroParteActivo === 'NP-ACERO-304-X'
                  ? 'border-[#2563eb] bg-white font-medium text-black'
                  : 'border-black/[0.12] bg-black/[0.01] text-black/[0.7]'
              }`}
            >
              <div className="font-mono text-[11px] text-[#2563eb] font-semibold">NP-ACERO-304-X</div>
              <div className="text-[11px] text-black/[0.6] mt-0.5">Proveedor: Aceros Mex S.A. de C.V.</div>
            </button>

            <button
              type="button"
              onClick={() => {
                setNumeroParteActivo('NP-BARRAS-7228-B');
                setProveedorActivo('Siderúrgica del Sur C.A.');
              }}
              className={`p-2.5 rounded-[10px] border text-left text-xs transition-colors ${
                numeroParteActivo === 'NP-BARRAS-7228-B'
                  ? 'border-[#2563eb] bg-white font-medium text-black'
                  : 'border-black/[0.12] bg-black/[0.01] text-black/[0.7]'
              }`}
            >
              <div className="font-mono text-[11px] text-[#2563eb] font-semibold">NP-BARRAS-7228-B</div>
              <div className="text-[11px] text-black/[0.6] mt-0.5">Proveedor: Siderúrgica del Sur C.A.</div>
            </button>
          </div>
        </div>

        {/* 4. SELECCIÓN DIRECTA DE FORMATO (SIN SELECTS) */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-black/[0.7] mb-2">
            Formato de origen del archivo:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {FORMATOS_DISPONIBLES.map((formato) => {
              const activo = formatoSeleccionado === formato.id;
              return (
                <button
                  key={formato.id}
                  type="button"
                  onClick={() => setFormatoSeleccionado(formato.id)}
                  className={`p-3 rounded-[10px] border text-center transition-all ${
                    activo
                      ? 'border-[#2563eb] bg-[#2563eb]/[0.05] ring-1 ring-[#2563eb]'
                      : 'border-black/[0.12] bg-white hover:border-black/[0.25]'
                  }`}
                >
                  <div className="text-xs font-bold text-black">{formato.label}</div>
                  <div className="text-[10px] font-mono text-black/[0.4] mt-0.5">{formato.ext}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. ZONA DE ARRASTRE (DRAG & DROP) TANGIBLE */}
        <div
          role="region"
          aria-label="Zona para depositar documento físico"
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
          className={`border-2 border-dashed rounded-[14px] p-8 text-center transition-colors ${
            modoArrastre
              ? 'border-[#2563eb] bg-[#2563eb]/[0.05]'
              : 'border-black/[0.2] bg-black/[0.01] hover:border-black/[0.4]'
          }`}
        >
          {/* Objeto físico central: Hoja receptora */}
          <div className="w-14 h-18 mx-auto bg-white border border-black/[0.15] rounded-[6px] flex flex-col p-2 justify-between mb-3">
            <div className="w-6 h-1 bg-[#2563eb] rounded-xs" />
            <div className="space-y-1">
              <div className="w-full h-0.5 bg-black/[0.2]" />
              <div className="w-full h-0.5 bg-black/[0.2]" />
              <div className="w-4/5 h-0.5 bg-black/[0.2]" />
            </div>
            <div className="text-[9px] font-mono text-center text-black/[0.4]">DOC</div>
          </div>

          <p className="text-sm font-semibold text-black">
            Deposite el documento físico aquí o elija un archivo del equipo
          </p>
          <p className="text-xs text-black/[0.4] mt-1">
            Formatos admitidos: PDF, XLSX, DOCX, PNG y TIFF • Hasta 25 MB
          </p>
        </div>

        {/* 6. BOTONES DE CARGA RÁPIDA (DEMOSTRACIÓN PARA JURADO) */}
        <div className="mt-6 pt-6 border-t border-black/[0.08]">
          <div className="text-xs font-semibold text-black/[0.7] mb-3">
            Carga rápida de prueba (Demostración de flujo):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              disabled={progresoCarga !== null && progresoCarga < 100}
              onClick={() => iniciarCargaSimulada(PRESELECCIONES_RAPIDAS[0])}
              className="p-3 bg-white border border-black/[0.12] hover:border-[#2563eb] hover:bg-[#2563eb]/[0.02] text-left rounded-[10px] transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">
                  Cargar Ficha Técnica: Rollo Acero Inox 304 (PDF)
                </span>
                <span className="text-[10px] font-mono text-black/[0.4]">3.4 MB</span>
              </div>
              <div className="text-[11px] text-black/[0.6] mt-1">
                ASTM A240 • Espesor 1.5 mm • Acabado 2B
              </div>
            </button>

            <button
              type="button"
              disabled={progresoCarga !== null && progresoCarga < 100}
              onClick={() => iniciarCargaSimulada(PRESELECCIONES_RAPIDAS[1])}
              className="p-3 bg-white border border-black/[0.12] hover:border-[#2563eb] hover:bg-[#2563eb]/[0.02] text-left rounded-[10px] transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">
                  Cargar Pedimento Aduanal de Importación (PDF)
                </span>
                <span className="text-[10px] font-mono text-black/[0.4]">1.8 MB</span>
              </div>
              <div className="text-[11px] text-black/[0.6] mt-1">
                Declaración de despacho aduanal con subpartida 7219.34
              </div>
            </button>
          </div>
        </div>

        {/* 7. ESTADO DE PROGRESO Y CÁLCULO DE HASH SHA-256 */}
        {progresoCarga !== null && (
          <div className="mt-6 p-4 bg-black/[0.02] border border-black/[0.12] rounded-[10px] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-black">
                Procesando: {archivoEnProceso}
              </span>
              <span className="font-mono text-black/[0.6]">
                {progresoCarga}%
              </span>
            </div>

            {/* Barra física de progreso sin gradientes */}
            <div className="w-full h-2 bg-black/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563eb] transition-all duration-150"
                style={{ width: `${progresoCarga}%` }}
              />
            </div>

            {hashCalculado ? (
              <div className="pt-2 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div className="text-emerald-800 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
                  <span>Integridad verificada (SHA-256):</span>
                </div>
                <div className="font-mono text-[10px] text-black/[0.6] truncate max-w-sm">
                  {hashCalculado}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-black/[0.4] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                <span>Calculando huella digital criptográfica y enviando a OCR...</span>
              </div>
            )}
          </div>
        )}

        {/* 8. SIMULACIÓN DE NODOS DE EXCEPCIÓN DEL ALGORITMO */}
        <div className="mt-6 pt-6 border-t border-black/[0.08]">
          <div className="text-xs font-semibold text-black/[0.7] mb-2 flex items-center justify-between">
            <span>Demostración de Casos de Excepción del Flujo:</span>
            <span className="text-[11px] font-normal text-black/[0.4]">Simulación guiada</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setModalExcepcion('ocr_error')}
              className="p-2.5 rounded-[10px] border border-amber-300 bg-amber-50/[0.6] hover:bg-amber-50 text-left transition-colors"
            >
              <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <span>Error OCR / Ilegible</span>
              </div>
              <div className="text-[11px] text-amber-900/[0.8] mt-0.5">
                Texto degradado → Captura manual guiada
              </div>
            </button>

            <button
              type="button"
              onClick={() => setModalExcepcion('fuera_alcance')}
              className="p-2.5 rounded-[10px] border border-rose-300 bg-rose-50/[0.6] hover:bg-rose-50 text-left transition-colors"
            >
              <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-700" />
                <span>Fuera de Alcance</span>
              </div>
              <div className="text-[11px] text-rose-900/[0.8] mt-0.5">
                No es Cap. 72/73 → Nota 1 y desvío a Cap. 84
              </div>
            </button>

            <button
              type="button"
              onClick={() => setModalExcepcion('reuso')}
              className="p-2.5 rounded-[10px] border border-emerald-300 bg-emerald-50/[0.6] hover:bg-emerald-50 text-left transition-colors"
            >
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <span>Reuso Inmediato</span>
              </div>
              <div className="text-[11px] text-emerald-900/[0.8] mt-0.5">
                Precedente aprobado → Dictamen 2026-0142
              </div>
            </button>
          </div>
        </div>

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
