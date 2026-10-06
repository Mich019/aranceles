import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { FiltroRangoFechas, RangoFechas } from '../common/FiltroRangoFechas';

export interface ExpedientePendiente {
  id: string;
  nombreArchivo: string;
  formato: string;
  sha256: string;
  peso: string;
  remitente: {
    nombre: string;
    rol: string;
    aduana: string;
  };
  fechaRecepcion: string;
  tipoDocumento: 'ficha' | 'pedimento';
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  motivoRechazo?: string;
  supervisorVoBo?: {
    nombre: string;
    cargo: string;
    fechaHora: string;
  };
  numeroParte?: string;
  proveedor?: string;
}

export interface BandejaSupervisorViewProps {
  expedientesIniciales?: ExpedientePendiente[];
  onAprobarExpediente: (expediente: ExpedientePendiente) => void;
  onRechazarExpediente?: (idExpediente: string, motivo: string) => void;
  onVolver?: () => void;
  supervisorActual?: string;
}

const EXPEDIENTES_DEMO: ExpedientePendiente[] = [
  {
    id: 'EXP-2026-0422-MX',
    nombreArchivo: 'Ficha_Tecnica_Bobina_Inox_304.pdf',
    formato: 'pdf',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    peso: '3.4 MB',
    remitente: {
      nombre: 'Juan Carlos Pérez',
      rol: 'Operativo',
      aduana: 'Aduana de Quito',
    },
    fechaRecepcion: '04 de octubre de 2026 • 17:01 hrs',
    tipoDocumento: 'ficha',
    estado: 'pendiente',
    numeroParte: 'NP-ACERO-304-X',
    proveedor: 'Aceros Especiales S.A.',
  },
  {
    id: 'EXP-2026-0421-MX',
    nombreArchivo: 'Pedimento_Aduanal_Planchas_7219.pdf',
    formato: 'pdf',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    peso: '1.8 MB',
    remitente: {
      nombre: 'Carlos Andrés Benítez',
      rol: 'Operativo',
      aduana: 'Aduana de Tulcán',
    },
    fechaRecepcion: '04 de octubre de 2026 • 15:45 hrs',
    tipoDocumento: 'pedimento',
    estado: 'pendiente',
    numeroParte: 'PED-2026-ECU-00918',
    proveedor: 'Consignatario Industrial Quito',
  },
];

const MOTIVOS_RECHAZO_PREDEFINIDOS = [
  'Documento ilegible o incompleto',
  'Falta firma de colada / certificado de molino',
  'Discrepancia en peso o número de parte declarado',
  'Mercancía excede la jurisdicción siderúrgica (Cap. 72/73)',
];

// Interpretar fechas textuales como "04 de octubre de 2026 • 17:01 hrs"
const parsearFechaTexto = (texto: string): Date | null => {
  const meses: Record<string, number> = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
  };
  const match = texto.match(/(\d{1,2})\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚ]+)\s+de\s+(\d{4})/i);
  if (match) {
    const dia = parseInt(match[1], 10);
    const mes = meses[match[2].toLowerCase()];
    const año = parseInt(match[3], 10);
    if (mes !== undefined) {
      return new Date(año, mes, dia, 12, 0, 0);
    }
  }
  return null;
};

export const BandejaSupervisorView: React.FC<BandejaSupervisorViewProps> = ({
  expedientesIniciales = EXPEDIENTES_DEMO,
  onAprobarExpediente,
  onRechazarExpediente,
  onVolver,
  supervisorActual = 'Lic. Sofía Valenzuela (Supervisor Titular)',
}) => {
  const [listaExpedientes, setListaExpedientes] = useState<ExpedientePendiente[]>(expedientesIniciales);
  const [busqueda, setBusqueda] = useState<string>('');
  const [rangoFechas, setRangoFechas] = useState<RangoFechas>({
    desde: null,
    hasta: null,
    preset: 'all_time',
  });
  const [expedienteVistaPrevia, setExpedienteVistaPrevia] = useState<ExpedientePendiente | null>(null);
  const [expedienteARechazar, setExpedienteARechazar] = useState<ExpedientePendiente | null>(null);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState<string>(MOTIVOS_RECHAZO_PREDEFINIDOS[0]);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  // Dar visto bueno y clasificar
  const handleAprobar = (exp: ExpedientePendiente) => {
    const fechaActual = new Date().toLocaleString('es-EC', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const expedienteAprobado: ExpedientePendiente = {
      ...exp,
      estado: 'aprobado',
      supervisorVoBo: {
        nombre: supervisorActual,
        cargo: 'Supervisor Arancelario Acreditado',
        fechaHora: fechaActual,
      },
    };

    setListaExpedientes((prev) =>
      prev.map((item) => (item.id === exp.id ? expedienteAprobado : item))
    );

    setMensajeExito(`Visto bueno otorgado a ${exp.nombreArchivo}. Transfiriendo al motor de clasificación...`);
    
    setTimeout(() => {
      onAprobarExpediente(expedienteAprobado);
    }, 600);
  };

  // Confirmar rechazo
  const handleConfirmarRechazo = () => {
    if (!expedienteARechazar) return;

    setListaExpedientes((prev) =>
      prev.map((item) =>
        item.id === expedienteARechazar.id
          ? { ...item, estado: 'rechazado', motivoRechazo: motivoSeleccionado }
          : item
      )
    );

    if (onRechazarExpediente) {
      onRechazarExpediente(expedienteARechazar.id, motivoSeleccionado);
    }

    setMensajeExito(`Expediente ${expedienteARechazar.nombreArchivo} rechazado: "${motivoSeleccionado}".`);
    setExpedienteARechazar(null);
    setTimeout(() => setMensajeExito(null), 3500);
  };

  const expedientesFiltrados = listaExpedientes.filter((exp) => {
    const coincideTexto =
      exp.nombreArchivo.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      exp.remitente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (exp.proveedor && exp.proveedor.toLowerCase().includes(busqueda.toLowerCase()));

    let coincideFecha = true;
    if (rangoFechas.desde || rangoFechas.hasta) {
      const f = parsearFechaTexto(exp.fechaRecepcion);
      if (f) {
        if (rangoFechas.desde && f < rangoFechas.desde) coincideFecha = false;
        if (rangoFechas.hasta && f > rangoFechas.hasta) coincideFecha = false;
      }
    }

    return coincideTexto && coincideFecha;
  });

  const pendientes = listaExpedientes.filter((e) => e.estado === 'pendiente');

  return (
    <div className="space-y-6 select-none text-black">
      
      {/* Cabecera y botón de retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="text-xs font-semibold text-[#dc2626] hover:underline mb-1.5 inline-flex items-center gap-1 cursor-pointer"
            >
              ← Volver a la Consola
            </button>
          )}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
            Expedientes pendientes de autorización previa
          </h1>
          <p className="text-xs sm:text-sm text-black/[0.6]">
            Bandeja de visto bueno obligatorio: supervise y autorice la entrada de expedientes al motor determinista.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1 rounded-[10px]">
            {pendientes.length} expedientes en espera
          </span>
        </div>
      </div>

      {/* AVISO DE NOTIFICACIÓN TEMPORAL */}
      {mensajeExito && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-[10px] text-xs font-medium flex items-center justify-between">
          <span>✓ {mensajeExito}</span>
          <button
            type="button"
            onClick={() => setMensajeExito(null)}
            className="text-emerald-800 hover:text-emerald-950 font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* CONTENEDOR PRINCIPAL: BANDEJA DE EXPEDIENTES */}
      <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-8 space-y-5 shadow-none">
        
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
          <span className="text-xs font-bold uppercase tracking-wider text-black">
            Bandeja de Visto Bueno Operativo
          </span>
          <span className="text-[11px] text-black/[0.5]">
            Supervisor en turno: <strong className="text-black font-medium">{supervisorActual}</strong>
          </span>
        </div>

        {/* Barra de Filtros y Rango de Fechas (Idéntico a la imagen) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-black/[0.06]">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por expediente, archivo o remitente..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#dc2626]"
            />
          </div>

          <FiltroRangoFechas
            rango={rangoFechas}
            onChange={setRangoFechas}
            placeholder="Filtrar por fecha"
          />
        </div>

        {/* Lista de expedientes */}
        <div className="space-y-4">
          {expedientesFiltrados.length > 0 ? (
            expedientesFiltrados.map((exp) => (
            <div
              key={exp.id}
              className={`p-5 rounded-[10px] border transition-all ${
                exp.estado === 'pendiente'
                  ? 'border-black/[0.12] bg-white hover:border-black/[0.3]'
                  : exp.estado === 'aprobado'
                  ? 'border-emerald-300 bg-emerald-50/[0.3]'
                  : 'border-rose-300 bg-rose-50/[0.3]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                
                {/* Lado izquierdo: Ícono de hoja, nombre, remitente y fecha */}
                <div className="flex items-start gap-4">
                  
                  {/* Ícono tangible de hoja de documento */}
                  <div className="w-12 h-14 rounded-[8px] bg-black/[0.03] border border-black/[0.12] flex flex-col items-center justify-between p-1.5 shrink-0">
                    <span className="text-[8px] font-mono font-bold text-black/[0.6] uppercase">
                      {exp.formato}
                    </span>
                    <svg className="w-5 h-5 text-black/[0.7]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[7px] font-mono text-black/[0.4]">SHA-256</span>
                  </div>

                  {/* Metadatos y Gafete simplificado del remitente */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-black leading-tight">
                        {exp.nombreArchivo}
                      </h3>
                      <span className="font-mono text-[10px] text-black/[0.5] bg-black/[0.04] px-1.5 py-0.5 rounded border border-black/[0.08]">
                        {exp.id}
                      </span>
                    </div>

                    {/* Gafete simplificado del remitente */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 bg-black/[0.03] border border-black/[0.1] px-2.5 py-0.5 rounded-[6px] text-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span className="font-medium">
                          Cargado por: <strong>{exp.remitente.nombre}</strong> ({exp.remitente.rol})
                        </span>
                      </span>
                      <span className="text-black/[0.5]">•</span>
                      <span className="text-black/[0.6]">{exp.remitente.aduana}</span>
                    </div>

                    {/* Fecha y hora de recepción + Huella digital */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-black/[0.5]">
                      <span>Recepción: {exp.fechaRecepcion}</span>
                      <span>•</span>
                      <span>Tamaño: {exp.peso}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-black/[0.4]">
                        SHA-256: {exp.sha256.slice(0, 16)}...
                      </span>
                    </div>

                    {/* Estado del expediente si ya fue resuelto */}
                    {exp.estado === 'aprobado' && exp.supervisorVoBo && (
                      <div className="pt-1 text-xs text-emerald-900 font-medium">
                        ✓ Visto Bueno otorgado por <strong>{exp.supervisorVoBo.nombre}</strong> el {exp.supervisorVoBo.fechaHora}
                      </div>
                    )}

                    {exp.estado === 'rechazado' && (
                      <div className="pt-1 text-xs text-rose-900 font-medium">
                        ✕ Rechazado por supervisor. Motivo: «{exp.motivoRechazo}»
                      </div>
                    )}
                  </div>

                </div>

                {/* Lado derecho: Acciones a la vista (Elegir, no teclear) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-black/[0.08]">
                  
                  {/* Botón de vista previa rápida */}
                  <button
                    type="button"
                    onClick={() => setExpedienteVistaPrevia(exp)}
                    className="px-3.5 py-2 text-xs font-medium text-black/[0.7] hover:text-black border border-black/[0.12] hover:border-black/[0.3] hover:bg-black/[0.02] rounded-[10px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-black/[0.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Ver documento</span>
                  </button>

                  {exp.estado === 'pendiente' && (
                    <>
                      {/* Botón secundario: Rechazar documento */}
                      <button
                        type="button"
                        onClick={() => setExpedienteARechazar(exp)}
                        className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-black/[0.12] hover:border-rose-300 rounded-[10px] transition-colors cursor-pointer text-center"
                      >
                        Rechazar documento
                      </button>

                      {/* Botón principal: Dar Visto Bueno y clasificar en el motor */}
                      <button
                        type="button"
                        onClick={() => handleAprobar(exp)}
                        className="px-4 py-2 text-xs font-semibold bg-[#dc2626] text-white rounded-[10px] hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Dar Visto Bueno y clasificar en el motor</span>
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-black/[0.5] border border-black/[0.12] rounded-[10px]">
            No se encontraron expedientes que coincidan con la búsqueda o el rango de fechas seleccionado.
          </div>
        )}
        </div>

      </div>

      {/* =================================================================== */}
      {/* MODAL: VISTA PREVIA RÁPIDA DEL DOCUMENTO                            */}
      {/* =================================================================== */}
      {expedienteVistaPrevia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/[0.4] backdrop-blur-xs"
        >
          <div className="w-full max-w-2xl bg-white border border-black/[0.12] rounded-[18px] p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.12]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/[0.5]">
                  Vista Previa del Archivo Resguardado en Almacenamiento Local
                </span>
                <h3 className="text-sm font-bold text-black">
                  {expedienteVistaPrevia.nombreArchivo}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setExpedienteVistaPrevia(null)}
                className="w-8 h-8 rounded-[8px] border border-black/[0.12] hover:bg-black/[0.04] flex items-center justify-center text-black font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Hoja física simulada */}
            <div className="p-5 bg-white border border-black/[0.15] rounded-[10px] space-y-3 font-sans">
              <div className="border-b border-black/[0.2] pb-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-black uppercase block">ACEROS ESPECIALES S.A.</span>
                  <span className="text-[10px] text-black/[0.6]">Certificado de Calidad de Molino • Norma ASTM A240</span>
                </div>
                <span className="text-[10px] font-mono border border-black/[0.2] px-2 py-0.5 rounded-[4px] bg-black/[0.02]">
                  FOLIO: 2026-FT-884
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-black/[0.5] block text-[10px]">Producto Declarado:</span>
                  <strong className="text-black font-medium">Lámina en rollo de acero inoxidable AISI 304</strong>
                </div>
                <div>
                  <span className="text-black/[0.5] block text-[10px]">Espesor Verificado:</span>
                  <strong className="text-black font-mono font-bold">0.90 mm (Calibrado en frío)</strong>
                </div>
                <div>
                  <span className="text-black/[0.5] block text-[10px]">Ancho Nominal:</span>
                  <strong className="text-black font-medium">1,219 mm (Mayor a 600 mm)</strong>
                </div>
                <div>
                  <span className="text-black/[0.5] block text-[10px]">Composición Cr / Ni:</span>
                  <strong className="text-black font-mono">18.2% Cr • 8.1% Ni (Inox Austenítico)</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-black/[0.08] text-[10px] text-black/[0.5] flex items-center justify-between font-mono">
                <span>Constancia Criptográfica: {expedienteVistaPrevia.sha256}</span>
                <span className="text-emerald-800 font-semibold">Integridad Verificada</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.08]">
              <button
                type="button"
                onClick={() => setExpedienteVistaPrevia(null)}
                className="py-2 px-4 border border-black/[0.12] hover:bg-black/[0.02] text-black text-xs font-medium rounded-[10px] transition-colors cursor-pointer"
              >
                Cerrar vista previa
              </button>

              {expedienteVistaPrevia.estado === 'pendiente' && (
                <button
                  type="button"
                  onClick={() => {
                    const exp = expedienteVistaPrevia;
                    setExpedienteVistaPrevia(null);
                    handleAprobar(exp);
                  }}
                  className="py-2 px-4 bg-[#dc2626] text-white text-xs font-semibold rounded-[10px] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Dar Visto Bueno Inmediato
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: MOTIVO DE RECHAZO DE DOCUMENTO                               */}
      {/* =================================================================== */}
      {expedienteARechazar && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/[0.4] backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-white border border-black/[0.12] rounded-[18px] p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                Rechazo de Expediente
              </span>
              <h3 className="text-base font-bold text-black mt-0.5">
                Seleccione el motivo de rechazo
              </h3>
              <p className="text-xs text-black/[0.6] mt-0.5">
                El empleado operativo <strong>{expedienteARechazar.remitente.nombre}</strong> será notificado formalmente con esta resolución.
              </p>
            </div>

            {/* Opciones a la vista (Elegir, no teclear) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-black/[0.7]">
                Motivo obligatorio:
              </label>

              {MOTIVOS_RECHAZO_PREDEFINIDOS.map((motivo) => {
                const seleccionado = motivoSeleccionado === motivo;
                return (
                  <button
                    key={motivo}
                    type="button"
                    onClick={() => setMotivoSeleccionado(motivo)}
                    className={`w-full p-3 rounded-[10px] border text-left text-xs font-medium transition-all cursor-pointer ${
                      seleccionado
                        ? 'border-rose-600 bg-rose-50 text-rose-950 font-semibold'
                        : 'border-black/[0.12] bg-white text-black hover:border-black/[0.3]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{motivo}</span>
                      {seleccionado && <span className="text-rose-700 font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.08]">
              <button
                type="button"
                onClick={() => setExpedienteARechazar(null)}
                className="py-2 px-4 border border-black/[0.12] hover:bg-black/[0.02] text-black text-xs font-medium rounded-[10px] transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmarRechazo}
                className="py-2 px-4 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-[10px] transition-colors cursor-pointer"
              >
                Confirmar Rechazo Oficial
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BandejaSupervisorView;
