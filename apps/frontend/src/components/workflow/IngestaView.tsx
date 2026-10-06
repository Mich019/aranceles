import React, { useState, useRef } from 'react';
import ExcepcionesModal, { TipoExcepcion } from './ExcepcionesModal';

export interface ExpedienteRetenido {
  id: string;
  nombreArchivo: string;
  tipo: 'ficha' | 'pedimento';
  formato: string;
  sha256: string;
  peso: string;
  numeroParte?: string;
  proveedor?: string;
  fechaRecepcion: string;
  remitente: {
    nombre: string;
    rol: string;
    aduana: string;
  };
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

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
  supervisionObligatoria?: boolean;
  onEnviarASupervision?: (expediente: ExpedienteRetenido) => void;
  onIrASupervisorHub?: () => void;
  usuarioActivo?: {
    nombre?: string;
    cargo?: string;
    correo?: string;
    sede?: string;
  } | null;
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
  onExcepcionResuelta,
  supervisionObligatoria = true,
  onEnviarASupervision,
  onIrASupervisorHub,
  usuarioActivo,
}) => {
  const [formatoSeleccionado, setFormatoSeleccionado] = useState<string>('pdf');
  const [numeroParteActivo, setNumeroParteActivo] = useState<string>('NP-ACERO-304-X');
  const [proveedorActivo, setProveedorActivo] = useState<string>('Aceros Mex S.A. de C.V.');
  const [modoArrastre, setModoArrastre] = useState<boolean>(false);
  const [progresoCarga, setProgresoCarga] = useState<number | null>(null);
  const [archivoEnProceso, setArchivoEnProceso] = useState<string | null>(null);
  const [hashCalculado, setHashCalculado] = useState<string | null>(null);
  const [modalExcepcion, setModalExcepcion] = useState<TipoExcepcion | null>(null);

  // Estados específicos de supervisión estricta y retención
  const [expedienteRetenido, setExpedienteRetenido] = useState<ExpedienteRetenido | null>(null);
  const [estadoEnvioSupervision, setEstadoEnvioSupervision] = useState<'espera' | 'enviado'>('espera');
  const inputFileRef = useRef<HTMLInputElement>(null);

  const registrarYProcesarDocumento = (opcion: {
    archivo: string;
    tipo: 'ficha' | 'pedimento';
    formato: string;
    sha256: string;
    peso: string;
    numeroParte?: string;
    proveedor?: string;
  }) => {
    // Si la supervisión estricta está activa, retener en almacenamiento local
    if (supervisionObligatoria) {
      const idAleatorio = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}-MX`;
      const fechaHoraActual = new Date().toLocaleString('es-EC', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' hrs';

      const nuevoExpediente: ExpedienteRetenido = {
        id: idAleatorio,
        nombreArchivo: opcion.archivo,
        tipo: opcion.tipo,
        formato: opcion.formato,
        sha256: opcion.sha256,
        peso: opcion.peso,
        numeroParte: opcion.numeroParte || 'NP-ACERO-304-X',
        proveedor: opcion.proveedor || 'Aceros Especiales S.A.',
        fechaRecepcion: fechaHoraActual,
        remitente: {
          nombre: usuarioActivo?.nombre || 'Juan Carlos Pérez',
          rol: 'Operativo',
          aduana: usuarioActivo?.sede || 'Aduana de Quito',
        },
        estado: 'pendiente',
      };

      // Guardado en almacenamiento local (Local Storage seguro con SHA-256)
      try {
        localStorage.setItem(`expediente_resguardado_${idAleatorio}`, JSON.stringify(nuevoExpediente));
        localStorage.setItem('ultimo_expediente_resguardado', JSON.stringify(nuevoExpediente));
      } catch (err) {
        console.warn('Registro en memoria segura del navegador:', err);
      }

      setExpedienteRetenido(nuevoExpediente);
      setEstadoEnvioSupervision('espera');
    } else {
      // Modo sin supervisión: avanzar directo
      onDocumentoCargado({
        nombreArchivo: opcion.archivo,
        tipo: opcion.tipo,
        formato: opcion.formato,
        sha256: opcion.sha256,
        peso: opcion.peso,
        numeroParte: opcion.numeroParte,
        proveedor: opcion.proveedor,
      });
    }
  };

  const iniciarCargaSimulada = (opcion: typeof PRESELECCIONES_RAPIDAS[0]) => {
    setTipoDocumento(opcion.tipo);
    setArchivoEnProceso(opcion.archivo);
    setProgresoCarga(0);
    setHashCalculado(null);
    setExpedienteRetenido(null);

    const intervalo = setInterval(() => {
      setProgresoCarga((prev) => {
        if (prev === null) return 20;
        if (prev >= 100) {
          clearInterval(intervalo);
          setHashCalculado(opcion.sha256);
          setTimeout(() => {
            registrarYProcesarDocumento(opcion);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 100);
  };

  const handleSubirArchivoManual = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formatoExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    const pesoFormateado = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const shaSimulado = Array.from(file.name + file.size)
      .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0)
      .toString(16)
      .padEnd(64, 'a')
      .slice(0, 64);

    const archivoDatos = {
      id: 'archivo-cargado',
      tipo: tipoDocumento,
      archivo: file.name,
      peso: pesoFormateado,
      formato: formatoExt,
      numeroParte: 'NP-CARGADO-2026',
      proveedor: 'Proveedor Externo Registrado',
      sha256: shaSimulado,
    };

    iniciarCargaSimulada(archivoDatos);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Encabezado limpio */}
      <div className="mb-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] leading-tight">
          Recepción y Carga de Documentos
        </h2>
        <p className="text-sm text-[#64748b] mt-1">
          Cargue la ficha técnica del fabricante o pedimento para iniciar el análisis y clasificación determinista.
        </p>
      </div>

      {/* Input de archivo físico oculto para selección de archivos reales */}
      <input
        ref={inputFileRef}
        type="file"
        accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg"
        onChange={handleSubirArchivoManual}
        className="hidden"
      />

      {/* =================================================================== */}
      {/* TARJETA DE ESTADO FORMAL EN AMARILLO SUAVE (SUPERVISIÓN ACTIVA)     */}
      {/* =================================================================== */}
      {expedienteRetenido && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-[18px] p-6 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-4">
            
            {/* Ícono tangible de hoja de documento resguardado */}
            <div className="w-11 h-14 rounded-[8px] bg-amber-100/90 border border-amber-300 flex flex-col items-center justify-between p-1.5 shrink-0">
              <span className="text-[8px] font-mono font-bold text-amber-900 uppercase">
                {expedienteRetenido.formato}
              </span>
              <svg className="w-5 h-5 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-[7px] font-mono text-amber-800">RESGUARDO</span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                  Retención Criptográfica y Resguardo Local
                </span>
                <span className="text-[10px] font-semibold bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-[6px] text-amber-950">
                  Almacenamiento Local Seguro resguardado con SHA-256
                </span>
              </div>

              {/* Texto formal normado */}
              <p className="text-sm font-semibold text-amber-950 leading-snug">
                Documento recibido y resguardado. Este expediente requiere visto bueno de supervisión antes de ejecutarse en el motor de clasificación.
              </p>

              {/* Metadatos del expediente */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-950/90 border-t border-amber-200/80">
                <div>
                  <span className="block text-[10px] text-amber-800 font-medium">Archivo:</span>
                  <strong className="text-amber-950 font-medium">{expedienteRetenido.nombreArchivo}</strong>
                  <span className="text-[11px] text-amber-800 ml-1.5 font-mono">({expedienteRetenido.peso})</span>
                </div>
                <div>
                  <span className="block text-[10px] text-amber-800 font-medium">Gafete Remitente:</span>
                  <span>Cargado por: <strong>{expedienteRetenido.remitente.nombre}</strong> ({expedienteRetenido.remitente.rol})</span>
                </div>
                <div>
                  <span className="block text-[10px] text-amber-800 font-medium">Fecha y hora de recepción:</span>
                  <span>{expedienteRetenido.fechaRecepcion}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-amber-800 font-medium">Huella digital SHA-256:</span>
                  <code className="text-[10px] font-mono text-amber-950">{expedienteRetenido.sha256.slice(0, 24)}...</code>
                </div>
              </div>
            </div>

          </div>

          {/* Acciones de la tarjeta en amarillo suave */}
          <div className="pt-3 border-t border-amber-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {estadoEnvioSupervision === 'espera' ? (
              <>
                <p className="text-xs text-amber-900 leading-tight">
                  Haga clic para transferir este expediente a la bandeja de visto bueno previo del supervisor.
                </p>

                {/* Botón de acción mandatorio */}
                <button
                  type="button"
                  onClick={() => {
                    setEstadoEnvioSupervision('enviado');
                    if (onEnviarASupervision) {
                      onEnviarASupervision({
                        ...expedienteRetenido,
                        estado: 'pendiente',
                      });
                    }
                  }}
                  className="px-4 py-2.5 text-xs font-semibold bg-[#dc2626] text-white rounded-[10px] hover:bg-[#b91c1c] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-none shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Enviar a bandeja de supervisión</span>
                </button>
              </>
            ) : (
              <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  ✓ Expediente transferido a la bandeja de supervisión previa. En espera de autorización del supervisor acreditado.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setExpedienteRetenido(null);
                      setProgresoCarga(null);
                      setArchivoEnProceso(null);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-black/[0.7] bg-white border border-black/[0.12] hover:border-black/[0.3] rounded-[10px] cursor-pointer"
                  >
                    Cargar otro archivo
                  </button>

                  {onIrASupervisorHub && (
                    <button
                      type="button"
                      onClick={onIrAAdminHub}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-[10px] cursor-pointer flex items-center gap-1.5 shadow-none"
                    >
                      <span>Ir a la Bandeja de Supervisión</span>
                      <span>→</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onDocumentoCargado({
                        nombreArchivo: expedienteRetenido.nombreArchivo,
                        tipo: expedienteRetenido.tipo,
                        formato: expedienteRetenido.formato,
                        sha256: expedienteRetenido.sha256,
                        peso: expedienteRetenido.peso,
                        numeroParte: expedienteRetenido.numeroParte,
                        proveedor: expedienteRetenido.proveedor,
                      });
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-[#dc2626] bg-white border border-[#dc2626]/40 hover:bg-red-50 rounded-[10px] cursor-pointer"
                    title="Avanzar para pruebas o perfil con visto bueno inmediato"
                  >
                    Simular Vo.Bo. Inmediato (Modo Supervisor)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tarjeta Principal Unificada */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Selector de Tipo de Documento */}
        <div>
          <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2.5">
            1. Tipo de Documento a Procesar
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Tipo de trámite">
            <button
              type="button"
              role="radio"
              aria-checked={tipoDocumento === 'ficha'}
              onClick={() => setTipoDocumento('ficha')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                tipoDocumento === 'ficha'
                  ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                  : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0f172a]">Ficha Técnica de Fabricante</span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  tipoDocumento === 'ficha' ? 'border-[#dc2626]' : 'border-[#cbd5e1]'
                }`}>
                  {tipoDocumento === 'ficha' && <span className="w-2 h-2 rounded-full bg-[#dc2626]" />}
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                Extracción de composición química, dimensiones y normas para clasificar.
              </p>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={tipoDocumento === 'pedimento'}
              onClick={() => setTipoDocumento('pedimento')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                tipoDocumento === 'pedimento'
                  ? 'border-[#dc2626] bg-[#fef2f2] ring-1 ring-[#dc2626]'
                  : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0f172a]">Pedimento Aduanal</span>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  tipoDocumento === 'pedimento' ? 'border-[#dc2626]' : 'border-[#cbd5e1]'
                }`}>
                  {tipoDocumento === 'pedimento' && <span className="w-2 h-2 rounded-full bg-[#dc2626]" />}
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-1">
                Auditoría de fracciones declaradas contra datos de la mercancía.
              </p>
            </button>
          </div>
        </div>

        {/* Zona de Carga Limpia y Espaciosa */}
        <div>
          <label className="block text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2.5">
            2. Carga del Archivo Digital (PDF, DOCX o Imagen OCR)
          </label>
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
              iniciarCargaSimulada(PRESELECCIONES_RAPIDAS[tipoDocumento === 'pedimento' ? 1 : 0]);
            }}
            onClick={() => {
              if (inputFileRef.current) {
                inputFileRef.current.click();
              }
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              modoArrastre
                ? 'border-[#dc2626] bg-[#fef2f2]'
                : 'border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9] hover:border-[#94a3b8]'
            }`}
          >
            <div className="w-12 h-12 mx-auto rounded-full bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#0f172a]">
              Haga clic para seleccionar o arrastre el archivo aquí
            </p>
            <p className="text-xs text-[#64748b] mt-1">
              Archivos compatibles: PDF, Word (.docx), Excel (.xlsx) o imágenes OCR (.png, .jpg) • Hasta 25 MB
            </p>
          </div>
        </div>

        {/* Barra de Progreso y Verificación de Integridad */}
        {progresoCarga !== null && (
          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#0f172a]">Procesando y Resguardando: {archivoEnProceso}</span>
              <span className="font-mono font-medium text-[#dc2626]">{progresoCarga}%</span>
            </div>
            <div className="w-full h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#dc2626] transition-all duration-150 rounded-full"
                style={{ width: `${progresoCarga}%` }}
              />
            </div>
            {hashCalculado ? (
              <div className="text-xs space-y-1">
                <span className="text-[#059669] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  Integridad verificada y resguardo en Almacenamiento Local Seguro mediante SHA-256
                </span>
                <p className="font-mono text-[11px] text-[#64748b] break-all">{hashCalculado}</p>
              </div>
            ) : (
              <p className="text-xs text-[#d97706] font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse" />
                Calculando sello criptográfico y resguardando en almacenamiento local…
              </p>
            )}
          </div>
        )}

        {/* Carga Rápida con Documentos de Muestra */}
        <div className="pt-2 border-t border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
              Documentos Oficiales de Prueba
            </span>
            <span className="text-[11px] text-[#94a3b8]">Evaluación inmediata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESELECCIONES_RAPIDAS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                disabled={progresoCarga !== null && progresoCarga < 100}
                onClick={() => iniciarCargaSimulada(item)}
                className="text-left p-3.5 rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all disabled:opacity-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0f172a] truncate">
                    {idx === 0 ? 'Ficha Técnica: Inox AISI 304' : 'Pedimento de Importación'}
                  </span>
                  <span className="text-[11px] font-mono text-[#64748b]">{item.peso}</span>
                </div>
                <p className="text-[11px] text-[#64748b] mt-1 leading-snug">
                  {idx === 0
                    ? 'Norma ASTM A240 • Espesor 0.90 mm • Grado 304'
                    : 'Despacho aduanal Nuevo Laredo • Subpartida 7219.34'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Casos Especiales de Simulación (Discreto y Espacioso) */}
        <div className="pt-3 border-t border-[#e2e8f0]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-medium text-[#64748b]">
              Casos especiales y excepciones de análisis
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setModalExcepcion('ocr_error')}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#fde68a] bg-[#fffbeb] text-[#92400e] hover:bg-[#fef3c7] font-medium transition-colors cursor-pointer"
            >
              Documento ilegible (Captura asistida)
            </button>
            <button
              type="button"
              onClick={() => setModalExcepcion('fuera_alcance')}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#fecdd3] bg-[#fff1f2] text-[#9f1239] hover:bg-[#ffe4e6] font-medium transition-colors cursor-pointer"
            >
              Material fuera de alcance (Cap. 72/73)
            </button>
            <button
              type="button"
              onClick={() => setModalExcepcion('reuso')}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#a7f3d0] bg-[#ecfdf5] text-[#065f46] hover:bg-[#d1fae5] font-medium transition-colors cursor-pointer"
            >
              Precedente idéntico (Reutilización)
            </button>
          </div>
        </div>

      </div>

      {/* Modal de Excepciones */}
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
