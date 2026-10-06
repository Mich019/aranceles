import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Printer,
  X,
  FileText,
} from 'lucide-react';

export interface PermisosEmpleado {
  consultaTigie: boolean;
  ingestaDocumentos: boolean;
  edicionAtributos: boolean;
  firmaDictamen: boolean;
}

export interface Empleado {
  id: string;
  nombre: string;
  cargo: string;
  nivel: string;
  correo: string;
  aduana: string;
  estado: 'activo' | 'pendiente' | 'suspendido';
  iniciales: string;
  fotoUrl: string;
  permisos: PermisosEmpleado;
  requiereVistoBueno: boolean;
  rolJerarquico?: 'admin' | 'encargado' | 'empleado';
  encargadoId?: string | null;
}

export interface GestionEmpleadosViewProps {
  onVolver?: () => void;
  onEmpleadoActualizado?: (empleado: Empleado) => void;
  usuarioActivo?: {
    id?: string;
    nombre: string;
    cargo: string;
    correo: string;
    rol: 'admin' | 'encargado' | 'operativo';
    sede: string;
  } | null;
  empleados?: Empleado[];
  onActualizarEmpleados?: (empleados: Empleado[]) => void;
}

export const EMPLEADOS_INICIALES: Empleado[] = [
  {
    id: 'EMP-001',
    nombre: 'Lic. Sofía Valenzuela Morales',
    cargo: 'Administrador Central de Aranceles',
    nivel: 'Nivel Ejecutivo',
    correo: 'sofia.valenzuela@valdezwoodward.com',
    aduana: 'Administración General Central',
    estado: 'activo',
    iniciales: 'SV',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=face',
    permisos: {
      consultaTigie: true,
      ingestaDocumentos: true,
      edicionAtributos: true,
      firmaDictamen: true,
    },
    requiereVistoBueno: false,
    rolJerarquico: 'admin',
    encargadoId: null,
  },
  {
    id: 'EMP-021',
    nombre: 'Lic. María Elena Morales Sánchez',
    cargo: 'Encargada de Equipo (Manzanillo)',
    nivel: 'Nivel 2',
    correo: 'elena.morales@valdezwoodward.com',
    aduana: 'Aduana de Manzanillo',
    estado: 'activo',
    iniciales: 'MM',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=480&fit=crop&crop=face',
    permisos: {
      consultaTigie: true,
      ingestaDocumentos: true,
      edicionAtributos: true,
      firmaDictamen: true,
    },
    requiereVistoBueno: false,
    rolJerarquico: 'encargado',
    encargadoId: 'EMP-001',
  },
  {
    id: 'EMP-033',
    nombre: 'Abg. Roberto Mendoza Viteri',
    cargo: 'Encargado de Equipo (Altamira)',
    nivel: 'Nivel 3',
    correo: 'roberto.mendoza@valdezwoodward.com',
    aduana: 'Aduana de Altamira',
    estado: 'activo',
    iniciales: 'RM',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=480&fit=crop&crop=face',
    permisos: {
      consultaTigie: true,
      ingestaDocumentos: false,
      edicionAtributos: false,
      firmaDictamen: true,
    },
    requiereVistoBueno: false,
    rolJerarquico: 'encargado',
    encargadoId: 'EMP-001',
  },
  {
    id: 'EMP-014',
    nombre: 'Diego Ramírez Montes',
    cargo: 'Personal Operativo de Clasificación',
    nivel: 'Nivel 1',
    correo: 'diego.ramirez@valdezwoodward.com',
    aduana: 'Aduana de Nuevo Laredo',
    estado: 'activo',
    iniciales: 'DR',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop&crop=face',
    permisos: {
      consultaTigie: true,
      ingestaDocumentos: true,
      edicionAtributos: true,
      firmaDictamen: false,
    },
    requiereVistoBueno: true,
    rolJerarquico: 'empleado',
    encargadoId: 'EMP-021', // Asignado a María Elena Morales
  },
  {
    id: 'EMP-029',
    nombre: 'Carlos Andrés Benítez Mora',
    cargo: 'Operador de Despacho y Aforo',
    nivel: 'Nivel 1',
    correo: 'carlos.benitez@valdezwoodward.com',
    aduana: 'Aduana de Veracruz',
    estado: 'pendiente',
    iniciales: 'CB',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=480&fit=crop&crop=face',
    permisos: {
      consultaTigie: true,
      ingestaDocumentos: true,
      edicionAtributos: false,
      firmaDictamen: false,
    },
    requiereVistoBueno: true,
    rolJerarquico: 'empleado',
    encargadoId: 'EMP-021', // Asignado a María Elena Morales
  },
  {
    id: 'EMP-042',
    nombre: 'Patricia Delgado Herrera',
    cargo: 'Analista de Documentación Aduanal',
    nivel: 'Nivel 1',
    correo: 'patricia.delgado@valdezwoodward.com',
    aduana: 'Aduana de Tijuana',
    estado: 'suspendido',
    iniciales: 'PD',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=480&fit=crop&crop=face',
    permisos: {
      consultaTigie: false,
      ingestaDocumentos: false,
      edicionAtributos: false,
      firmaDictamen: false,
    },
    requiereVistoBueno: true,
    rolJerarquico: 'empleado',
    encargadoId: 'EMP-033', // Asignada a Roberto Mendoza
  },
  {
    id: 'EMP-050',
    nombre: 'Juan Carlos Pérez Gómez',
    cargo: 'Clasificador Operativo Nivel 1',
    nivel: 'Nivel 1',
    correo: 'juan.perez@valdezwoodward.com',
    aduana: 'Aduana de Quito',
    estado: 'activo',
    iniciales: 'JP',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=480&fit=crop&crop=face',
    permisos: {
      consultaTigie: true,
      ingestaDocumentos: true,
      edicionAtributos: true,
      firmaDictamen: false,
    },
    requiereVistoBueno: true,
    rolJerarquico: 'empleado',
    encargadoId: null, // Sin encargado asignado (disponible)
  },
];

export const GestionEmpleadosView: React.FC<GestionEmpleadosViewProps> = ({
  onVolver,
  onEmpleadoActualizado,
  usuarioActivo,
  empleados: empleadosProp,
  onActualizarEmpleados,
}) => {
  const [empleadosInternos, setEmpleadosInternos] = useState<Empleado[]>(EMPLEADOS_INICIALES);
  const empleados = empleadosProp || empleadosInternos;
  const setEmpleados = onActualizarEmpleados || setEmpleadosInternos;

  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activos' | 'pendientes' | 'suspendidos'>('todos');
  const [empleadoModal, setEmpleadoModal] = useState<Empleado | null>(null);
  const [modalNuevo, setModalNuevo] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const esEncargado =
    usuarioActivo?.rol === 'encargado' ||
    Boolean(usuarioActivo?.correo && usuarioActivo.correo.toLowerCase().includes('encargado'));

  // Encargado actualmente en sesión
  const encargadoActual = useMemo(() => {
    if (!esEncargado) return null;
    return (
      empleados.find(
        (e) =>
          e.correo.toLowerCase() === usuarioActivo?.correo?.toLowerCase() ||
          e.rolJerarquico === 'encargado'
      ) || null
    );
  }, [esEncargado, empleados, usuarioActivo]);

  // Si es Encargado, solo ve los empleados que tiene asignados bajo su mando
  const empleadosBase = useMemo(() => {
    if (esEncargado && encargadoActual) {
      return empleados.filter((emp) => emp.encargadoId === encargadoActual.id);
    }
    return empleados;
  }, [esEncargado, encargadoActual, empleados]);

  // Formulario nuevo empleado
  const [nuevoNombre, setNuevoNombre] = useState<string>('');
  const [nuevoCargo, setNuevoCargo] = useState<string>('Personal Operativo de Clasificación');
  const [nuevoCorreo, setNuevoCorreo] = useState<string>('');
  const [nuevaAduana, setNuevaAduana] = useState<string>('Aduana de Nuevo Laredo');
  const [nuevaFotoUrl, setNuevaFotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=face'
  );

  // Filtrado de la lista
  const empleadosFiltrados = useMemo(() => {
    return empleadosBase.filter((emp) => {
      const q = busqueda.trim().toLowerCase();
      const coincide =
        !q ||
        emp.nombre.toLowerCase().includes(q) ||
        emp.cargo.toLowerCase().includes(q) ||
        emp.correo.toLowerCase().includes(q) ||
        emp.aduana.toLowerCase().includes(q) ||
        emp.id.toLowerCase().includes(q);

      if (!coincide) return false;

      if (filtroEstado === 'activos') return emp.estado === 'activo';
      if (filtroEstado === 'pendientes') return emp.estado === 'pendiente';
      if (filtroEstado === 'suspendidos') return emp.estado === 'suspendido';
      return true;
    });
  }, [empleadosBase, busqueda, filtroEstado]);

  const conteos = useMemo(() => {
    return {
      todos: empleadosBase.length,
      activos: empleadosBase.filter((e) => e.estado === 'activo').length,
      pendientes: empleadosBase.filter((e) => e.estado === 'pendiente').length,
      suspendidos: empleadosBase.filter((e) => e.estado === 'suspendido').length,
    };
  }, [empleadosBase]);

  // Actualizar un empleado en el estado
  const handleGuardarEmpleado = (empActualizado: Empleado) => {
    setEmpleados((prev) =>
      prev.map((e) => (e.id === empActualizado.id ? empActualizado : e))
    );
    if (onEmpleadoActualizado) {
      onEmpleadoActualizado(empActualizado);
    }
    setEmpleadoModal(empActualizado);
    setMensajeExito(`Credencial de ${empActualizado.nombre} actualizada correctamente.`);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  // Crear nuevo empleado
  const handleCrearEmpleado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const iniciales = nuevoNombre
      .split(' ')
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join('');

    const correoFinal = nuevoCorreo.trim()
      ? nuevoCorreo.trim()
      : `${nuevoNombre.toLowerCase().replace(/\s+/g, '.')}@valdezwoodward.com`;

    const nuevo: Empleado = {
      id: `EMP-${String(empleados.length + 1).padStart(3, '0')}`,
      nombre: nuevoNombre.trim(),
      cargo: nuevoCargo,
      nivel: nuevoCargo.includes('Administrador') ? 'Nivel Ejecutivo' : 'Nivel 1',
      correo: correoFinal,
      aduana: nuevaAduana,
      estado: 'activo',
      iniciales: iniciales || 'VW',
      fotoUrl: nuevaFotoUrl,
      permisos: {
        consultaTigie: true,
        ingestaDocumentos: true,
        edicionAtributos: true,
        firmaDictamen: nuevoCargo.includes('Administrador'),
      },
      requiereVistoBueno: !nuevoCargo.includes('Administrador'),
    };

    setEmpleados([nuevo, ...empleados]);
    setModalNuevo(false);
    setNuevoNombre('');
    setNuevoCorreo('');
    setMensajeExito(`Ficha institucional para ${nuevo.nombre} emitida con éxito.`);
    setTimeout(() => setMensajeExito(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. ENCABEZADO Y CONTROLES SUPERIORES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Gestión de Empleados
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Credenciales institucionales oficiales y padrón de funcionarios aduaneros
          </p>
        </div>

        {/* Acciones principales */}
        <div className="flex items-center gap-3">
          {onVolver && (
            <button
              type="button"
              onClick={onVolver}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Volver al Panel
            </button>
          )}

          <button
            type="button"
            onClick={() => setModalNuevo(true)}
            className="px-4 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Nueva Credencial</span>
          </button>
        </div>
      </div>

      {/* AVISO DE ACCIÓN */}
      {mensajeExito && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
          <button
            type="button"
            onClick={() => setMensajeExito(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* BANNER INFORMATIVO PARA EL ROL DE ENCARGADO */}
      {esEncargado && (
        <div className="p-4 bg-amber-50/80 border border-amber-300/80 rounded-2xl flex items-start gap-3.5 shadow-2xs">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <span className="font-bold text-amber-950 text-sm block">
              Equipo Operativo Asignado — {encargadoActual?.nombre || 'Encargado'}
            </span>
            <span className="text-amber-800 leading-relaxed block">
              Usted tiene rol de <strong>Encargado de Equipo</strong>. En cumplimiento de las políticas de control jerárquico, esta sección únicamente le permite consultar, editar permisos y gestionar las credenciales de los <strong>{empleadosFiltrados.length} empleados</strong> que están específicamente asignados bajo su mando directo.
            </span>
          </div>
        </div>
      )}

      {/* 2. BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Buscador */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, cargo, correo o aduana..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#dc2626] focus:bg-white transition-colors"
          />
        </div>

        {/* Píldoras de Filtro */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setFiltroEstado('todos')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filtroEstado === 'todos'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({conteos.todos})
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('activos')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filtroEstado === 'activos'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            Activos ({conteos.activos})
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('pendientes')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filtroEstado === 'pendientes'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            Pendientes Vo.Bo. ({conteos.pendientes})
          </button>

          <button
            type="button"
            onClick={() => setFiltroEstado('suspendidos')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              filtroEstado === 'suspendidos'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60'
            }`}
          >
            Suspendidos ({conteos.suspendidos})
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CUADRÍCULA DE FICHAS DE EMPLEADOS (FORMATO CREDENCIAL VALDEZ & WOODWARD) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {empleadosFiltrados.map((emp) => (
          <div
            key={emp.id}
            onClick={() => setEmpleadoModal(emp)}
            className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
              emp.estado !== 'activo'
                ? 'opacity-60 bg-slate-100/80 dark:bg-slate-900/60 border-dashed border-slate-300 dark:border-slate-700 shadow-2xs'
                : 'bg-white dark:bg-[#111827] border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {/* PARTE SUPERIOR DE LA TARJETA */}
            <div className="p-5 pb-3">
              {/* Encabezado: Logo a la izquierda + "Valdez & Woodward" a la derecha */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="Logo Valdez & Woodward"
                    className="w-9 h-9 object-contain drop-shadow-xs"
                  />
                </div>

                <div className="text-right">
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-sans block leading-none">
                    Valdez &amp; Woodward
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider block mt-0.5">
                    {emp.id}
                  </span>
                </div>
              </div>

              {/* CUERPO: Foto a la izquierda + Datos del funcionario */}
              <div className="flex items-start gap-4">
                {/* Fotografía de retrato profesional (sin círculo de estado al lado) */}
                <div className="relative shrink-0">
                  <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-2xs">
                    <img
                      src={emp.fotoUrl}
                      alt={emp.nombre}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        // Fallback con iniciales
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Campos de datos limpios sin rótulos de NOMBRE, ROL ni CORREO */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h4
                      className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight block truncate"
                      title={emp.nombre}
                    >
                      {emp.nombre}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 leading-tight block truncate mt-1">
                      {emp.cargo}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate font-mono mt-1">
                      {emp.correo}
                    </p>
                  </div>

                  {/* Estado solo si está inactivo */}
                  {emp.estado !== 'activo' && (
                    <div>
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {emp.estado === 'pendiente' ? 'Pendiente' : 'Inactivo'}
                      </span>
                    </div>
                  )}

                  {/* SUPERVISIÓN JERÁRQUICA */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block leading-none mb-0.5">
                      ASIGNACIÓN
                    </span>
                    {emp.rolJerarquico === 'admin' ? (
                      <span className="text-[10px] font-bold text-[#dc2626]">
                        Administración Central
                      </span>
                    ) : emp.rolJerarquico === 'encargado' ? (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                        Encargado de Equipo
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block truncate">
                        {(() => {
                          const supervisor = empleados.find((enc) => enc.id === emp.encargadoId);
                          return supervisor
                            ? `Equipo: ${supervisor.nombre.split(' ')[0]} ${supervisor.nombre.split(' ')[1] || ''}`
                            : 'Sin Encargado Asignado';
                        })()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA INFERIOR DE DOS TONOS: OLA AZUL Y ROJO (IDÉNTICA A LA IMAGEN) */}
            <div className="relative w-full h-10 mt-2 overflow-hidden rounded-b-2xl">
              <svg
                viewBox="0 0 500 60"
                preserveAspectRatio="none"
                className="w-full h-full block"
              >
                {/* Franja derecha rojo institucional */}
                <rect x="0" y="0" width="500" height="60" fill="#8c1f24" />

                {/* Franja izquierda azul marino con ola distintiva hacia la derecha */}
                <path
                  d="M 0,0 L 260,0 C 285,0 305,4 322,12 C 334,18 334,26 322,32 C 298,42 276,46 258,60 L 0,60 Z"
                  fill="#1d4e7d"
                />
              </svg>

              {/* Botón sutil en hover sobre la franja */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <span className="text-[10px] text-white font-bold tracking-wider uppercase">
                  {emp.aduana}
                </span>
                <span className="text-[10px] text-white font-semibold underline underline-offset-2">
                  Ver Ficha Completa →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {empleadosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No se encontraron empleados</p>
          <p className="text-xs text-slate-400 mt-1">Pruebe con otros términos de búsqueda o cambie el filtro.</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: DETALLE DE LA FICHA Y EDICIÓN DE PERMISOS                       */}
      {/* ========================================================================= */}
      {empleadoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-7 space-y-6 animate-in fade-in zoom-in-95 duration-150 my-6">
            {/* Cabecera del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#dc2626]" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Credencial Institucional Oficial
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ID Expediente: {empleadoModal.id}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEmpleadoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* VISTA PREVIA DE LA FICHA A GRAN ESCALA (FORMATO FOTOCHECK) */}
            <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex justify-center">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-md w-full overflow-hidden">
                <div className="p-6 pb-4">
                  {/* Logo y Empresa */}
                  <div className="flex items-center justify-between mb-5">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-10 h-10 object-contain drop-shadow-xs"
                    />
                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900 tracking-tight block">
                        Valdez &amp; Woodward
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {empleadoModal.id}
                      </span>
                    </div>
                  </div>

                  {/* Foto y Datos */}
                  <div className="flex items-start gap-5">
                    <div className="w-28 h-36 rounded-xl overflow-hidden border border-slate-200 shadow-xs shrink-0 bg-slate-50">
                      <img
                        src={empleadoModal.fotoUrl}
                        alt={empleadoModal.nombre}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2.5">
                      <div>
                        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                          {empleadoModal.nombre}
                        </h4>
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                          {empleadoModal.cargo}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-600 font-mono truncate">
                          {empleadoModal.correo}
                        </p>
                      </div>

                      {empleadoModal.estado !== 'activo' && (
                        <div>
                          <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                            {empleadoModal.estado === 'pendiente' ? 'Pendiente' : 'Inactivo'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Franja de 2 colores con ola */}
                <div className="relative w-full h-12 overflow-hidden">
                  <svg
                    viewBox="0 0 500 60"
                    preserveAspectRatio="none"
                    className="w-full h-full block"
                  >
                    <rect x="0" y="0" width="500" height="60" fill="#8c1f24" />
                    <path
                      d="M 0,0 L 260,0 C 285,0 305,4 322,12 C 334,18 334,26 322,32 C 298,42 276,46 258,60 L 0,60 Z"
                      fill="#1d4e7d"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* PANEL DE CONFIGURACIÓN Y PERMISOS DEL FUNCIONARIO */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Configuración y Privilegios del Funcionario
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Aduana Asignada */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">
                    Aduana Asignada
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {empleadoModal.aduana}
                  </div>
                </div>

                {/* Nivel de Acreditación */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase">
                    Nivel Operativo
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    {empleadoModal.nivel}
                  </div>
                </div>
              </div>

              {/* Conmutadores de Permisos */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-700 block">
                  Permisos Operativos Asignados:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empleadoModal.permisos.consultaTigie}
                      onChange={(e) =>
                        handleGuardarEmpleado({
                          ...empleadoModal,
                          permisos: {
                            ...empleadoModal.permisos,
                            consultaTigie: e.target.checked,
                          },
                        })
                      }
                      className="rounded accent-[#dc2626] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700">Consulta TIGIE y Notas</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empleadoModal.permisos.ingestaDocumentos}
                      onChange={(e) =>
                        handleGuardarEmpleado({
                          ...empleadoModal,
                          permisos: {
                            ...empleadoModal.permisos,
                            ingestaDocumentos: e.target.checked,
                          },
                        })
                      }
                      className="rounded accent-[#dc2626] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700">Carga e Ingesta de Fichas</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empleadoModal.permisos.edicionAtributos}
                      onChange={(e) =>
                        handleGuardarEmpleado({
                          ...empleadoModal,
                          permisos: {
                            ...empleadoModal.permisos,
                            edicionAtributos: e.target.checked,
                          },
                        })
                      }
                      className="rounded accent-[#dc2626] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700">Modificación de Atributos</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={empleadoModal.permisos.firmaDictamen}
                      onChange={(e) =>
                        handleGuardarEmpleado({
                          ...empleadoModal,
                          permisos: {
                            ...empleadoModal.permisos,
                            firmaDictamen: e.target.checked,
                          },
                        })
                      }
                      className="rounded accent-[#dc2626] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium text-slate-700">Firma de Dictamen Final</span>
                  </label>
                </div>
              </div>

              {/* Selector de Estado de la Credencial */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Estado de la Credencial
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Permite o restringe el acceso al sistema arancelario
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleGuardarEmpleado({
                        ...empleadoModal,
                        estado: 'activo',
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      empleadoModal.estado === 'activo'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Activo
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleGuardarEmpleado({
                        ...empleadoModal,
                        estado: 'pendiente',
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      empleadoModal.estado === 'pendiente'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Pendiente
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleGuardarEmpleado({
                        ...empleadoModal,
                        estado: 'suspendido',
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      empleadoModal.estado === 'suspendido'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Suspender
                  </button>
                </div>
              </div>
            </div>

            {/* Botones de acción del Modal */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="w-full sm:w-auto px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Imprimir Credencial</span>
              </button>

              <button
                type="button"
                onClick={() => setEmpleadoModal(null)}
                className="w-full sm:w-auto px-5 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: EMITIR NUEVA CREDENCIAL                                         */}
      {/* ========================================================================= */}
      {modalNuevo && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#dc2626]" />
                <h3 className="text-base font-bold text-slate-900">
                  Emitir Nueva Credencial Oficial
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalNuevo(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearEmpleado} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nombre Completo del Funcionario
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Brenda Salazar Ramos"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#dc2626] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Cargo o Rol Institucional
                </label>
                <select
                  value={nuevoCargo}
                  onChange={(e) => setNuevoCargo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#dc2626] focus:bg-white cursor-pointer"
                >
                  <option value="Personal Operativo de Clasificación">Personal Operativo de Clasificación</option>
                  <option value="Clasificador Técnico de Metales">Clasificador Técnico de Metales</option>
                  <option value="Supervisor de Despacho Aduanal">Supervisor de Despacho Aduanal</option>
                  <option value="Auditor de Pedimentos y Glosa">Auditor de Pedimentos y Glosa</option>
                  <option value="Administrador Central de Aranceles">Administrador Central de Aranceles</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Correo Electrónico Institucional
                </label>
                <input
                  type="email"
                  placeholder="nombre.apellido@valdezwoodward.com"
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#dc2626] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Aduana de Adscripción
                </label>
                <select
                  value={nuevaAduana}
                  onChange={(e) => setNuevaAduana(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#dc2626] focus:bg-white cursor-pointer"
                >
                  <option value="Aduana de Nuevo Laredo">Aduana de Nuevo Laredo</option>
                  <option value="Aduana de Manzanillo">Aduana de Manzanillo</option>
                  <option value="Aduana de Veracruz">Aduana de Veracruz</option>
                  <option value="Aduana de Altamira">Aduana de Altamira</option>
                  <option value="Aduana de Tijuana">Aduana de Tijuana</option>
                  <option value="Administración General Central">Administración General Central</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Fotografía de Credencial
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img
                      src={nuevaFotoUrl}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex gap-2 overflow-x-auto pb-1">
                    {[
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=480&fit=crop&crop=face',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=480&fit=crop&crop=face',
                    ].map((foto, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNuevaFotoUrl(foto)}
                        className={`w-9 h-11 rounded-md overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                          nuevaFotoUrl === foto
                            ? 'border-[#dc2626] ring-2 ring-[#dc2626]/20'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={foto} alt={`Opción ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalNuevo(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Generar Credencial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEmpleadosView;
