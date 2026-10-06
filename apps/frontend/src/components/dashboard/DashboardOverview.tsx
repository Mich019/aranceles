import React, { useState, useMemo } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Users,
  Network,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  FileCheck,
  Activity,
  UserCheck,
} from 'lucide-react';
import { PerfilAutenticado } from '../auth/LoginView';
import { ExpedientePendiente } from '../admin/BandejaSupervisorView';
import { Empleado } from '../admin/GestionEmpleadosView';
import { FiltroRangoFechas, RangoFechas } from '../common/FiltroRangoFechas';

export interface RegistroBitacora {
  id: string;
  fechaHora: string;
  timestamp?: number;
  accion: 'ingesta_documento' | 'vobo_aprobado' | 'vobo_rechazado' | 'reasignacion_jerarquia' | 'ascenso_encargado' | 'emision_dictamen';
  tituloAccion: string;
  descripcion: string;
  empleadoNombre: string;
  empleadoId: string;
  encargadoId?: string | null;
  aduana: string;
  referenciaExpediente?: string;
  tipoBadge: 'exito' | 'pendiente' | 'alerta' | 'info';
}

export interface ExpedienteDelDia {
  id: string;
  archivo: string;
  hora: string;
  clasificador: string;
  empleadoId: string;
  aduana: string;
  fraccion?: string;
  estado: 'aprobado' | 'pendiente_supervision' | 'en_proceso';
  tipo: 'ficha' | 'pedimento';
}

const REGISTROS_BITACORA_INICIALES: RegistroBitacora[] = [
  {
    id: 'REG-2026-0914',
    fechaHora: 'Hoy • 02:10 hrs',
    timestamp: new Date(2026, 9, 6, 2, 10).getTime(),
    accion: 'vobo_aprobado',
    tituloAccion: 'Visto Bueno de Supervisión',
    descripcion: 'Aprobación técnica de expediente EXP-2026-0422-MX para bobinas de acero inox 304.',
    empleadoNombre: 'Juan Carlos Pérez Gómez',
    empleadoId: 'EMP-050',
    encargadoId: null,
    aduana: 'Aduana de Quito',
    referenciaExpediente: 'EXP-2026-0422-MX',
    tipoBadge: 'exito',
  },
  {
    id: 'REG-2026-0913',
    fechaHora: 'Hoy • 01:45 hrs',
    timestamp: new Date(2026, 9, 6, 1, 45).getTime(),
    accion: 'ingesta_documento',
    tituloAccion: 'Ingesta de Pedimento Aduanal',
    descripcion: 'Extracción determinista de pedimento para planchas laminadas en caliente 7219.',
    empleadoNombre: 'Carlos Andrés Benítez Mora',
    empleadoId: 'EMP-029',
    encargadoId: 'EMP-021', // Asignado a Lic. María Elena Morales
    aduana: 'Aduana de Veracruz',
    referenciaExpediente: 'EXP-2026-0421-MX',
    tipoBadge: 'pendiente',
  },
  {
    id: 'REG-2026-0912',
    fechaHora: 'Hoy • 01:15 hrs',
    timestamp: new Date(2026, 9, 6, 1, 15).getTime(),
    accion: 'reasignacion_jerarquia',
    tituloAccion: 'Reasignación de Colaborador',
    descripcion: 'Personal operativo reasignado al equipo de supervisión de la aduana marítima.',
    empleadoNombre: 'Patricia Delgado Herrera',
    empleadoId: 'EMP-042',
    encargadoId: 'EMP-021', // Asignada a Lic. María Elena Morales
    aduana: 'Aduana de Manzanillo',
    tipoBadge: 'info',
  },
  {
    id: 'REG-2026-0911',
    fechaHora: 'Hoy • 00:32 hrs',
    timestamp: new Date(2026, 9, 6, 0, 32).getTime(),
    accion: 'emision_dictamen',
    tituloAccion: 'Emisión de Dictamen Final',
    descripcion: 'Determinación arancelaria para fracción 7219.34.01 NICO 01 con certificado digital.',
    empleadoNombre: 'Diego Ramírez',
    empleadoId: 'EMP-014',
    encargadoId: 'EMP-021', // Asignado a Lic. María Elena Morales
    aduana: 'Aduana de Nuevo Laredo',
    referenciaExpediente: 'EXP-2026-0419-MX',
    tipoBadge: 'exito',
  },
  {
    id: 'REG-2026-0910',
    fechaHora: 'Ayer • 23:45 hrs',
    timestamp: new Date(2026, 9, 5, 23, 45).getTime(),
    accion: 'ingesta_documento',
    tituloAccion: 'Ingesta de Certificado de Molino',
    descripcion: 'Recepción de especificación de composición química ASTM A240 Grado 410.',
    empleadoNombre: 'Patricia Delgado Herrera',
    empleadoId: 'EMP-042',
    encargadoId: 'EMP-021', // Asignada a Lic. María Elena Morales
    aduana: 'Aduana de Manzanillo',
    referenciaExpediente: 'EXP-2026-0418-MX',
    tipoBadge: 'info',
  },
  {
    id: 'REG-2026-0909',
    fechaHora: 'Ayer • 21:30 hrs',
    timestamp: new Date(2026, 9, 5, 21, 30).getTime(),
    accion: 'ascenso_encargado',
    tituloAccion: 'Promoción a Encargado',
    descripcion: 'Designación de jerarquía institucional como Encargada de Equipo de Supervisión.',
    empleadoNombre: 'Lic. María Elena Morales Sánchez',
    empleadoId: 'EMP-021',
    encargadoId: 'EMP-001',
    aduana: 'Aduana de Manzanillo',
    tipoBadge: 'exito',
  },
  {
    id: 'REG-2026-0908',
    fechaHora: '30 de sep • 14:10 hrs',
    timestamp: new Date(2026, 8, 30, 14, 10).getTime(),
    accion: 'ingesta_documento',
    tituloAccion: 'Carga de Certificado de Molino',
    descripcion: 'Validación de aceros aleados y trazabilidad ASTM.',
    empleadoNombre: 'Diego Ramírez',
    empleadoId: 'EMP-014',
    encargadoId: 'EMP-021',
    aduana: 'Aduana de Nuevo Laredo',
    tipoBadge: 'info',
  },
  {
    id: 'REG-2026-0907',
    fechaHora: '25 de sep • 11:20 hrs',
    timestamp: new Date(2026, 8, 25, 11, 20).getTime(),
    accion: 'vobo_aprobado',
    tituloAccion: 'Visto Bueno de Supervisión',
    descripcion: 'Resolución favorable de expediente para bobina galvanizada G90.',
    empleadoNombre: 'Carlos Andrés Benítez Mora',
    empleadoId: 'EMP-029',
    encargadoId: 'EMP-021',
    aduana: 'Aduana de Veracruz',
    tipoBadge: 'exito',
  },
];

const EXPEDIENTES_DEL_DIA_INICIALES: ExpedienteDelDia[] = [
  {
    id: 'EXP-2026-0422-MX',
    archivo: 'Ficha_Tecnica_Bobina_Inox_304.pdf',
    hora: 'Hoy • 02:10 hrs',
    clasificador: 'Juan Carlos Pérez Gómez',
    empleadoId: 'EMP-050',
    aduana: 'Aduana de Quito',
    fraccion: '7219.34.01',
    estado: 'pendiente_supervision',
    tipo: 'ficha',
  },
  {
    id: 'EXP-2026-0421-MX',
    archivo: 'Pedimento_Aduanal_Planchas_7219.pdf',
    hora: 'Hoy • 01:45 hrs',
    clasificador: 'Carlos Andrés Benítez Mora',
    empleadoId: 'EMP-029',
    aduana: 'Aduana de Veracruz',
    fraccion: '7219.21.01',
    estado: 'pendiente_supervision',
    tipo: 'pedimento',
  },
  {
    id: 'EXP-2026-0419-MX',
    archivo: 'Ficha_Tecnica_Aceros_304.pdf',
    hora: 'Hoy • 00:32 hrs',
    clasificador: 'Diego Ramírez',
    empleadoId: 'EMP-014',
    aduana: 'Aduana de Nuevo Laredo',
    fraccion: '7219.34.01',
    estado: 'aprobado',
    tipo: 'ficha',
  },
  {
    id: 'EXP-2026-0418-MX',
    archivo: 'Certificado_Calidad_Inox_410.pdf',
    hora: 'Ayer • 23:45 hrs',
    clasificador: 'Patricia Delgado Herrera',
    empleadoId: 'EMP-042',
    aduana: 'Aduana de Manzanillo',
    fraccion: '7220.20.02',
    estado: 'aprobado',
    tipo: 'ficha',
  },
];

export interface DashboardOverviewProps {
  usuario: PerfilAutenticado | null;
  onIrAClasificar: () => void;
  onIrAHistorial: () => void;
  onIrASupervision?: () => void;
  onIrAEmpleados?: () => void;
  onIrARoles?: () => void;
  onIrAJerarquia?: () => void;
  pendientesSupervisionCount?: number;
  expedientesPendientes?: ExpedientePendiente[];
  listaEmpleados?: Empleado[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  usuario,
  onIrAClasificar,
  onIrAHistorial,
  onIrASupervision,
  onIrAEmpleados,
  onIrARoles,
  onIrAJerarquia,
  pendientesSupervisionCount = 2,
  expedientesPendientes = [],
  listaEmpleados = [],
}) => {
  const [busquedaBitacora, setBusquedaBitacora] = useState<string>('');
  const [filtroBitacora, setFiltroBitacora] = useState<string>('todos');
  const [rangoBitacora, setRangoBitacora] = useState<RangoFechas>({
    desde: null,
    hasta: null,
    preset: 'all_time',
  });

  const esAdmin =
    usuario?.rol === 'admin' ||
    usuario?.rol === 'administrador' ||
    Boolean(usuario?.correo && usuario.correo.toLowerCase().includes('admin'));

  const esEncargado =
    usuario?.rol === 'encargado' ||
    Boolean(usuario?.correo && usuario.correo.toLowerCase().includes('encargado'));

  // Identificar el perfil de encargado si está en sesión
  const encargadoActual = useMemo(() => {
    if (!esEncargado) return null;
    return (
      listaEmpleados.find(
        (e) =>
          e.correo.toLowerCase() === usuario?.correo?.toLowerCase() ||
          e.rolJerarquico === 'encargado'
      ) || {
        id: 'EMP-021',
        nombre: usuario?.nombre || 'Lic. María Elena Morales',
        aduana: usuario?.sede || 'Aduana de Manzanillo',
      }
    );
  }, [esEncargado, listaEmpleados, usuario]);

  // Lista de IDs de los empleados asignados a este encargado
  const idsEmpleadosMiEquipo = useMemo(() => {
    if (!esEncargado || !encargadoActual) return new Set<string>();
    const ids = listaEmpleados
      .filter((e) => e.encargadoId === encargadoActual.id)
      .map((e) => e.id);

    // Fallback con demo si aún no se han sincronizado
    if (ids.length === 0) {
      return new Set(['EMP-029', 'EMP-042', 'EMP-014']);
    }
    return new Set(ids);
  }, [esEncargado, encargadoActual, listaEmpleados]);

  // Filtrar expedientes del día según rol
  const expedientesDelDia = useMemo(() => {
    if (esAdmin) {
      return EXPEDIENTES_DEL_DIA_INICIALES;
    }
    if (esEncargado) {
      return EXPEDIENTES_DEL_DIA_INICIALES.filter((exp) =>
        idsEmpleadosMiEquipo.has(exp.empleadoId)
      );
    }
    // Si es empleado común, solo ve sus propios expedientes
    return EXPEDIENTES_DEL_DIA_INICIALES.filter(
      (exp) =>
        exp.clasificador.toLowerCase().includes(usuario?.nombre?.toLowerCase().split(' ')[0] || '') ||
        exp.empleadoId === 'EMP-014'
    );
  }, [esAdmin, esEncargado, idsEmpleadosMiEquipo, usuario]);

  // Filtrar expedientes que requieren supervisión según rol
  const expedientesRequierenSupervision = useMemo(() => {
    const listaBase =
      expedientesPendientes.length > 0
        ? expedientesPendientes.filter((e) => e.estado === 'pendiente')
        : [
            {
              id: 'EXP-2026-0422-MX',
              nombreArchivo: 'Ficha_Tecnica_Bobina_Inox_304.pdf',
              formato: 'pdf',
              peso: '3.4 MB',
              remitente: {
                nombre: 'Juan Carlos Pérez',
                rol: 'Operativo',
                aduana: 'Aduana de Quito',
              },
              fechaRecepcion: 'Hoy • 02:10 hrs',
              numeroParte: 'NP-ACERO-304-X',
              proveedor: 'Aceros Especiales S.A.',
            },
            {
              id: 'EXP-2026-0421-MX',
              nombreArchivo: 'Pedimento_Aduanal_Planchas_7219.pdf',
              formato: 'pdf',
              peso: '1.8 MB',
              remitente: {
                nombre: 'Carlos Andrés Benítez',
                rol: 'Operativo',
                aduana: 'Aduana de Veracruz',
              },
              fechaRecepcion: 'Hoy • 01:45 hrs',
              numeroParte: 'PED-2026-ECU-00918',
              proveedor: 'Consignatario Industrial Quito',
            },
          ];

    if (esAdmin) {
      return listaBase;
    }

    if (esEncargado) {
      return listaBase.filter((exp) =>
        exp.remitente.nombre.toLowerCase().includes('carlos andrés') ||
        exp.remitente.nombre.toLowerCase().includes('patricia') ||
        exp.remitente.nombre.toLowerCase().includes('diego')
      );
    }

    return [];
  }, [esAdmin, esEncargado, expedientesPendientes]);

  // Filtrar bitácora según rol:
  // - Admin: ve todo
  // - Supervisor: SOLO ve los registros de sus propios empleados asignados
  // - Empleado: NO ve la bitácora
  const bitacoraFiltrada = useMemo(() => {
    if (!esAdmin && !esEncargado) return [];

    return REGISTROS_BITACORA_INICIALES.filter((item) => {
      // Regla de visibilidad para supervisor
      if (esEncargado) {
        const esDeMiEquipo =
          item.encargadoId === encargadoActual?.id ||
          idsEmpleadosMiEquipo.has(item.empleadoId) ||
          item.empleadoNombre.toLowerCase().includes('carlos andrés') ||
          item.empleadoNombre.toLowerCase().includes('patricia') ||
          item.empleadoNombre.toLowerCase().includes('diego');

        if (!esDeMiEquipo) return false;
      }

      // Filtro de texto
      const coincideTexto =
        item.descripcion.toLowerCase().includes(busquedaBitacora.toLowerCase()) ||
        item.empleadoNombre.toLowerCase().includes(busquedaBitacora.toLowerCase()) ||
        item.tituloAccion.toLowerCase().includes(busquedaBitacora.toLowerCase()) ||
        item.id.toLowerCase().includes(busquedaBitacora.toLowerCase()) ||
        (item.referenciaExpediente && item.referenciaExpediente.toLowerCase().includes(busquedaBitacora.toLowerCase()));

      // Filtro de categoría
      const coincideCategoria =
        filtroBitacora === 'todos' || item.accion === filtroBitacora;

      // Filtro de rango de fecha
      let coincideFecha = true;
      if (rangoBitacora.desde || rangoBitacora.hasta) {
        if (item.timestamp) {
          const itemFecha = new Date(item.timestamp);
          if (rangoBitacora.desde && itemFecha < rangoBitacora.desde) coincideFecha = false;
          if (rangoBitacora.hasta && itemFecha > rangoBitacora.hasta) coincideFecha = false;
        }
      }

      return coincideTexto && coincideCategoria && coincideFecha;
    });
  }, [esAdmin, esEncargado, encargadoActual, idsEmpleadosMiEquipo, busquedaBitacora, filtroBitacora, rangoBitacora]);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. BANNER DE BIENVENIDA INSTITUCIONAL Y ACCIÓN PRIMARIA                  */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
        <div className="space-y-1.5">
          <div className="text-xs text-slate-400 font-medium mb-1">
            {usuario?.sede || 'Aduana de Nuevo Laredo'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            Bienvenido, {usuario?.nombre || 'Funcionario Acreditado'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            {esAdmin
              ? 'Panel de control administrativo general: gestión de personal, organigrama de jerarquías y supervisión de expedientes de la jornada.'
              : esEncargado
              ? 'Supervisión y control directo sobre los colaboradores específicamente asignados a su cargo y sus trámites del día.'
              : 'Seleccione una acción para iniciar la clasificación arancelaria de mercancías de acero o consulte el estado de sus trámites.'}
          </p>
        </div>

        {/* Botón común principal */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={onIrAClasificar}
            className="w-full md:w-auto px-5 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer group"
          >
            <FileText className="w-4 h-4" />
            <span>Iniciar Nueva Clasificación</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FUNCIONES COMUNES / ADMINISTRATIVAS (POR DEFECTO ARRIBA)               */}
      {/* ========================================================================= */}

      {/* A) PARA ADMINISTRADOR: FUNCIONES ADMINISTRATIVAS POR DEFECTO ARRIBA */}
      {esAdmin && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Funciones Administrativas Institucionales
              </h3>
              <p className="text-xs text-slate-500">
                Módulos de administración, control jerárquico y padrón aduanero.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Función 1: Gestión de Roles */}
            <div
              onClick={onIrARoles}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#dc2626] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626] transition-colors">
                    Gestión de Roles
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Definición de permisos, accesos y roles institucionales.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-semibold text-slate-400 group-hover:text-[#dc2626]">
                <span>Configurar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Función 2: Gestión de Empleados */}
            <div
              onClick={onIrAEmpleados}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5 text-[#dc2626]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626] transition-colors">
                    Gestión de Empleados
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Padrón de personal, fichas de credenciales y aduanas.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-semibold text-slate-400 group-hover:text-[#dc2626]">
                <span>Consultar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Función 3: Jerarquía en Árbol */}
            <div
              onClick={onIrAJerarquia}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626] transition-colors">
                    Jerarquía en Árbol
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Organigrama interactivo y asignación de colaboradores.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-semibold text-slate-400 group-hover:text-[#dc2626]">
                <span>Organizar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Función 4: Supervisión de Dictámenes */}
            <div
              onClick={onIrASupervision}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#dc2626] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626] transition-colors">
                    Bandeja de Supervisión
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {pendientesSupervisionCount} expedientes pendientes de visto bueno.
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-semibold text-slate-400 group-hover:text-[#dc2626]">
                <span>Revisar ({pendientesSupervisionCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B) PARA ENCARGADO / SUPERVISOR: ACCIONES DE EQUIPO */}
      {esEncargado && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Acciones de Supervisión de Equipo
              </h3>
              <p className="text-xs text-slate-500">
                Herramientas directas de gestión para el personal a su cargo.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              Mando Intermedio
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={onIrAEmpleados}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#dc2626] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626]">
                    Gestión de Mi Equipo
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Fichas del personal asignado a su cargo
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#dc2626]" />
            </div>

            <div
              onClick={onIrASupervision}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626]">
                    Supervisión de Dictámenes
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Expedientes pendientes de sus subordinados
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#dc2626]" />
            </div>

            <div
              onClick={onIrAClasificar}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5 text-[#dc2626]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626]">
                    Clasificar Mercancía
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Ingresar expediente técnico de acero
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#dc2626]" />
            </div>
          </div>
        </div>
      )}

      {/* C) PARA EMPLEADO: ACCIONES OPERATIVAS BÁSICAS (SIN OPCIONES ADMIN NI SUPERVISIÓN) */}
      {!esAdmin && !esEncargado && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={onIrAClasificar}
            className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer shadow-xs flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#dc2626] flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626]">
                Iniciar Nueva Clasificación Arancelaria
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Suba la ficha técnica o el pedimento de mercancías de acero para determinar la fracción oficial con sustento en normas ASTM.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#dc2626]">
              <span>Comenzar trámite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={onIrAHistorial}
            className="p-6 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#dc2626] dark:hover:border-[#dc2626] hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer shadow-xs flex flex-col justify-between space-y-3 group"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5 text-[#dc2626]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#dc2626]">
                Consultar Mi Historial de Expedientes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Revise el estado de sus trámites ingresados, verifique resoluciones de visto bueno y descargue certificados de trazabilidad.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#dc2626]">
              <span>Ver mis trámites</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DEBAJO: EXPEDIENTES DEL DÍA Y LOS QUE REQUIEREN SUPERVISIÓN            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* BLOQUE IZQUIERDO: EXPEDIENTES QUE REQUIEREN SUPERVISIÓN (ADMIN O ENCARGADO) */}
        {(esAdmin || esEncargado) && (
          <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Requieren Supervisión ({expedientesRequierenSupervision.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={onIrASupervision}
                className="text-xs font-semibold text-[#dc2626] hover:underline cursor-pointer"
              >
                Ver bandeja
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {esAdmin
                ? 'Expedientes que necesitan visto bueno antes de dictamen final.'
                : 'Expedientes cargados por sus colaboradores que aguardan revisión.'}
            </p>

            <div className="space-y-3">
              {expedientesRequierenSupervision.length > 0 ? (
                expedientesRequierenSupervision.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 bg-amber-50/50 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-900/50 rounded-xl space-y-2 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                          {exp.nombreArchivo}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono block">
                          {exp.id} • {exp.tipoDocumento === 'pedimento' ? 'Pedimento' : 'Ficha Técnica'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md shrink-0">
                        Pendiente
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-amber-200/40 dark:border-amber-900/40">
                      <span className="truncate">
                        👤 {exp.remitente.nombre} ({exp.remitente.aduana})
                      </span>
                      <button
                        type="button"
                        onClick={onIrASupervision}
                        className="text-[10px] font-bold text-[#dc2626] hover:underline shrink-0 cursor-pointer"
                      >
                        Revisar →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
                  ✓ No hay expedientes pendientes de visto bueno en este momento.
                </div>
              )}
            </div>
          </div>
        )}

        {/* BLOQUE DERECHO (O COMPLETO PARA EMPLEADOS): EXPEDIENTES DEL DÍA */}
        <div
          className={`${
            esAdmin || esEncargado ? 'lg:col-span-7' : 'lg:col-span-12'
          } bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#dc2626]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {esAdmin
                  ? 'Expedientes del Día (Jornada Activa)'
                  : esEncargado
                  ? 'Expedientes del Día de Mi Equipo'
                  : 'Mis Trámites del Día'}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {expedientesDelDia.length} registrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-2.5">Expediente</th>
                  <th className="pb-2.5">Clasificador</th>
                  <th className="pb-2.5">Aduana</th>
                  <th className="pb-2.5">Fracción</th>
                  <th className="pb-2.5 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {expedientesDelDia.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 pr-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block truncate max-w-[160px]">
                        {item.archivo}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {item.id} • {item.hora}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
                      {item.clasificador}
                    </td>
                    <td className="py-3 px-2 text-slate-500 dark:text-slate-400 truncate max-w-[110px]">
                      {item.aduana}
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-700 dark:text-slate-300 font-semibold">
                      {item.fraccion || 'En análisis'}
                    </td>
                    <td className="py-3 pl-2 text-right">
                      {item.estado === 'aprobado' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Aprobado
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          En Supervisión
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BITÁCORA DE REGISTROS (SOLO PARA ADMIN Y SUPERVISOR; EMPLEADOS NO)     */}
      {/* ========================================================================= */}
      {(esAdmin || esEncargado) && (
        <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#dc2626]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {esAdmin
                    ? 'Bitácora General de Registros del Sistema'
                    : 'Bitácora de Supervisión de Equipo (Colaboradores Asignados)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {esAdmin
                  ? 'Registro cronológico y trazabilidad de todos los eventos, cargas, dictámenes y asignaciones en el sistema.'
                  : 'Mostrando exclusivamente la actividad y eventos registrados por los colaboradores a su cargo.'}
              </p>
            </div>

            {/* Aviso remarcado para el Supervisor */}
            {esEncargado && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-[11px] font-bold">
                <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Vista Remarcada: Solo Personal de su Equipo</span>
              </span>
            )}
          </div>

          {/* Filtros de la Bitácora */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={busquedaBitacora}
                  onChange={(e) => setBusquedaBitacora(e.target.value)}
                  placeholder="Buscar por colaborador, acción o referencia..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              {/* Filtro Rango de Fechas (Idéntico a la imagen) */}
              <FiltroRangoFechas
                rango={rangoBitacora}
                onChange={setRangoBitacora}
                placeholder="Filtrar por fecha"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'vobo_aprobado', label: 'Vistos Buenos' },
                { id: 'ingesta_documento', label: 'Cargas' },
                { id: 'emision_dictamen', label: 'Dictámenes' },
                ...(esAdmin ? [{ id: 'reasignacion_jerarquia', label: 'Jerarquía' }] : []),
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFiltroBitacora(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    filtroBitacora === f.id
                      ? 'bg-[#dc2626] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Eventos de la Bitácora */}
          <div className="space-y-3 pt-2">
            {bitacoraFiltrada.length > 0 ? (
              bitacoraFiltrada.map((item) => {
                const esDeMiEquipo = esEncargado;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all ${
                      esDeMiEquipo
                        ? 'border-l-4 border-l-[#dc2626] border-slate-200 dark:border-slate-800 bg-red-50/15 dark:bg-red-950/20 hover:bg-red-50/25 dark:hover:bg-red-950/30 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded">
                          {item.id}
                        </span>

                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            item.tipoBadge === 'exito'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : item.tipoBadge === 'pendiente'
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : item.tipoBadge === 'info'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {item.tituloAccion}
                        </span>

                        {/* Distintivo remarcado para el Supervisor */}
                        {esDeMiEquipo && (
                          <span className="text-[10px] font-bold text-[#dc2626] dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                            ★ Colaborador a su cargo
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        {item.fechaHora}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 font-medium mt-2 leading-relaxed">
                      {item.descripcion}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Funcionario: {item.empleadoNombre} ({item.aduana})
                      </span>

                      {item.referenciaExpediente && (
                        <span className="font-mono text-slate-400 dark:text-slate-500">
                          Ref: {item.referenciaExpediente}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-500 dark:text-slate-400">
                No se encontraron registros que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
