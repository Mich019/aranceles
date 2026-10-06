import React, { useState } from 'react';
import {
  Search,
  Filter,
  FileText,
  Hash,
  ArrowUpRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { FiltroRangoFechas, RangoFechas } from '../common/FiltroRangoFechas';

export interface ExpedienteHistorial {
  id: string;
  nombreArchivo: string;
  tipo: 'ficha' | 'pedimento';
  numeroParte: string;
  proveedor: string;
  fechaProcesamiento: string;
  clasificador: string;
  fraccionDeterminada: string;
  nicoDeterminado: string;
  confianza: number;
  estadoSupervision: 'aprobado' | 'pendiente_vobo' | 'rectificacion';
  supervisorVoBo?: string;
  sha256: string;
}

const HISTORIAL_DEMO: ExpedienteHistorial[] = [
  {
    id: 'EXP-2026-9182-MX',
    nombreArchivo: 'Ficha_Tecnica_Rollo_Acero_Inox_304.pdf',
    tipo: 'ficha',
    numeroParte: 'NP-ACERO-304-X',
    proveedor: 'Aceros Mex S.A. de C.V.',
    fechaProcesamiento: '04 de octubre de 2026 • 18:22 hrs',
    clasificador: 'Diego Ramírez',
    fraccionDeterminada: '7219.34.01',
    nicoDeterminado: '01',
    confianza: 0.996,
    estadoSupervision: 'aprobado',
    supervisorVoBo: 'Lic. Sofía Valenzuela',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
  {
    id: 'EXP-2026-0421-MX',
    nombreArchivo: 'Pedimento_Aduanal_Planchas_7219.pdf',
    tipo: 'pedimento',
    numeroParte: 'PED-2026-ECU-00918',
    proveedor: 'Consignatario Industrial Quito',
    fechaProcesamiento: '04 de octubre de 2026 • 15:45 hrs',
    clasificador: 'Carlos Andrés Benítez',
    fraccionDeterminada: '7219.34.01',
    nicoDeterminado: '01',
    confianza: 0.942,
    estadoSupervision: 'pendiente_vobo',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  },
  {
    id: 'EXP-2026-8812-MX',
    nombreArchivo: 'Bobina_Acero_Galvanizado_G90.pdf',
    tipo: 'ficha',
    numeroParte: 'NP-GALV-G90-08',
    proveedor: 'Ternium México S.A. de C.V.',
    fechaProcesamiento: '02 de octubre de 2026 • 11:15 hrs',
    clasificador: 'Diego Ramírez',
    fraccionDeterminada: '7210.49.99',
    nicoDeterminado: '02',
    confianza: 0.988,
    estadoSupervision: 'aprobado',
    supervisorVoBo: 'Lic. Sofía Valenzuela',
    sha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f1118230198aa',
  },
  {
    id: 'EXP-2026-7643-MX',
    nombreArchivo: 'Pedimento_Importacion_Varilla_Corrugada.pdf',
    tipo: 'pedimento',
    numeroParte: 'PED-2026-NLD-3312',
    proveedor: 'Aceros Corey de México',
    fechaProcesamiento: '29 de septiembre de 2026 • 09:30 hrs',
    clasificador: 'Juan Carlos Pérez',
    fraccionDeterminada: '7214.20.01',
    nicoDeterminado: '01',
    confianza: 0.915,
    estadoSupervision: 'rectificacion',
    supervisorVoBo: 'Lic. Sofía Valenzuela',
    sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
  {
    id: 'EXP-2026-6520-MX',
    nombreArchivo: 'Certificado_Molino_Alambron_1008.pdf',
    tipo: 'ficha',
    numeroParte: 'ALAMB-SAE-1008',
    proveedor: 'Deacero S.A.P.I. de C.V.',
    fechaProcesamiento: '25 de septiembre de 2026 • 16:40 hrs',
    clasificador: 'Diego Ramírez',
    fraccionDeterminada: '7213.91.01',
    nicoDeterminado: '99',
    confianza: 0.992,
    estadoSupervision: 'aprobado',
    supervisorVoBo: 'Lic. Sofía Valenzuela',
    sha256: '8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b',
  },
];

export interface HistorialExpedientesViewProps {
  onVerDetalleExpediente?: (exp: ExpedienteHistorial) => void;
  rolUsuario?: 'admin' | 'operativo';
}

// Función para interpretar fechas textuales como "04 de octubre de 2026 • 18:22 hrs"
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

export const HistorialExpedientesView: React.FC<HistorialExpedientesViewProps> = ({
  onVerDetalleExpediente,
  rolUsuario = 'operativo',
}) => {
  const [expedientes] = useState<ExpedienteHistorial[]>(HISTORIAL_DEMO);
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'ficha' | 'pedimento'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'aprobado' | 'pendiente_vobo' | 'rectificacion'>('todos');
  const [rangoFechas, setRangoFechas] = useState<RangoFechas>({
    desde: null,
    hasta: null,
    preset: 'all_time',
  });
  const [expedienteModal, setExpedienteModal] = useState<ExpedienteHistorial | null>(null);

  const filtrados = expedientes.filter((item) => {
    const texto =
      item.nombreArchivo.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.numeroParte.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.fraccionDeterminada.includes(busqueda) ||
      item.id.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipo = filtroTipo === 'todos' ? true : item.tipo === filtroTipo;
    const coincideEstado = filtroEstado === 'todos' ? true : item.estadoSupervision === filtroEstado;

    let coincideFecha = true;
    if (rangoFechas.desde || rangoFechas.hasta) {
      const f = parsearFechaTexto(item.fechaProcesamiento);
      if (f) {
        if (rangoFechas.desde && f < rangoFechas.desde) coincideFecha = false;
        if (rangoFechas.hasta && f > rangoFechas.hasta) coincideFecha = false;
      }
    }

    return texto && coincideTipo && coincideEstado && coincideFecha;
  });

  return (
    <div className="space-y-6">
      {/* 1. BARRA SUPERIOR DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por expediente, archivo, proveedor o fracción..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#dc2626] focus:ring-1 focus:ring-[#dc2626] transition-all shadow-xs"
          />
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtro Rango de Fechas (Idéntico a la imagen) */}
          <FiltroRangoFechas
            rango={rangoFechas}
            onChange={setRangoFechas}
            placeholder="Filtrar por fecha"
          />

          {/* Tipo de Documento */}
          <div className="relative">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 pr-7 transition-colors shadow-xs cursor-pointer focus:outline-none focus:border-[#dc2626]"
            >
              <option value="todos">Todos los tipos</option>
              <option value="ficha">Fichas Técnicas</option>
              <option value="pedimento">Pedimentos Aduanales</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Estado de Supervisión */}
          <div className="relative">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value as any)}
              className="appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 pr-7 transition-colors shadow-xs cursor-pointer focus:outline-none focus:border-[#dc2626]"
            >
              <option value="todos">Todos los estados</option>
              <option value="aprobado">Aprobado / Conforme</option>
              <option value="pendiente_vobo">En Espera de Vo.Bo.</option>
              <option value="rectificacion">Con Observación</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          <button
            type="button"
            className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* 2. LISTADO EN TARJETAS DE EXPEDIENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtrados.map((item) => {
          const esAprobado = item.estadoSupervision === 'aprobado';
          const esPendiente = item.estadoSupervision === 'pendiente_vobo';

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <FileText className="w-4 h-4 text-[#dc2626]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        {item.id}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate max-w-[180px]" title={item.nombreArchivo}>
                        {item.nombreArchivo}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      esAprobado
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : esPendiente
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        esAprobado
                          ? 'bg-emerald-500'
                          : esPendiente
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-rose-500'
                      }`}
                    />
                    {esAprobado ? 'Aprobado' : esPendiente ? 'Pendiente Vo.Bo.' : 'Observado'}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Fracción LIGIE:</span>
                    <strong className="font-mono text-slate-900 text-xs">
                      {item.fraccionDeterminada} — NICO {item.nicoDeterminado}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Proveedor:</span>
                    <span className="text-slate-800 truncate max-w-[140px]">{item.proveedor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Fecha de dictamen:</span>
                    <span className="text-slate-500 text-[11px]">{item.fechaProcesamiento}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Hash className="w-3 h-3 text-slate-400" />
                  <span>{item.sha256.slice(0, 12)}...</span>
                </div>

                <button
                  type="button"
                  onClick={() => setExpedienteModal(item)}
                  className="text-xs font-semibold text-slate-700 hover:text-[#dc2626] inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Ver detalle</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No se encontraron expedientes</p>
          <p className="text-xs text-slate-400 mt-1">Intente con otros términos de búsqueda o filtros.</p>
        </div>
      )}

      {/* 3. MODAL DE DETALLE DEL EXPEDIENTE */}
      {expedienteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#dc2626]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Certificación de Expediente Resguardado
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {expedienteModal.id}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpedienteModal(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Documento:</span>
                  <strong>{expedienteModal.nombreArchivo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Número de parte:</span>
                  <span className="font-mono">{expedienteModal.numeroParte}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Proveedor / Consignatario:</span>
                  <span>{expedienteModal.proveedor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Clasificador:</span>
                  <span>{expedienteModal.clasificador}</span>
                </div>
              </div>

              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#dc2626] block">
                  Determinación Arancelaria Emitida
                </span>
                <div className="text-base font-mono font-bold text-slate-900">
                  {expedienteModal.fraccionDeterminada} — NICO {expedienteModal.nicoDeterminado}
                </div>
                <span className="text-[11px] text-slate-500">
                  Confianza determinista: {(expedienteModal.confianza * 100).toFixed(1)}%
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-1">
                  Huella Criptográfica SHA-256 (Inmutable):
                </span>
                <code className="text-[10px] font-mono block bg-slate-100 p-2 rounded-lg text-slate-800 break-all border border-slate-200">
                  {expedienteModal.sha256}
                </code>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setExpedienteModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialExpedientesView;
