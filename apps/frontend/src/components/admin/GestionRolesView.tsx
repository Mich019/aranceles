import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Users,
  ShieldCheck,
  Check,
  RotateCcw,
  Save,
  Download,
  ChevronRight,
  X,
  SlidersHorizontal,
  LayoutDashboard,
  FileText,
  GitBranch,
} from 'lucide-react';

export interface PermisoColumna {
  id: string;
  label: string;
  descripcion: string;
}

export interface CategoriaPermisos {
  id: string;
  titulo: string;
  descripcion: string;
  icono?: React.ComponentType<{ className?: string }>;
  columnas: PermisoColumna[];
}

export interface RolInstitucional {
  id: string;
  nombre: string;
  etiquetaVisual: string;
  fechaCreacion: string;
  descripcion: string;
  estado: 'activo' | 'desactivado';
  usuariosAsignados: number;
  avatares: string[];
}

// 1. Roles institucionales oficiales del sistema
export const ROLES_INICIALES: RolInstitucional[] = [
  {
    id: 'admin',
    nombre: 'Administrador',
    etiquetaVisual: 'Super Admin • Acceso Total',
    fechaCreacion: '12 de enero de 2026',
    descripcion:
      'Control total del sistema, árbol jerárquico, visto bueno y políticas institucionales.',
    estado: 'activo',
    usuariosAsignados: 1,
    avatares: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
    ],
  },
  {
    id: 'encargado',
    nombre: 'Encargado',
    etiquetaVisual: 'Supervisor de Equipo Asignado',
    fechaCreacion: '18 de enero de 2026',
    descripcion:
      'Supervisión y visto bueno de expedientes del personal asignado a su cargo.',
    estado: 'activo',
    usuariosAsignados: 2,
    avatares: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    ],
  },
  {
    id: 'empleado',
    nombre: 'Empleado',
    etiquetaVisual: 'Personal Operativo de Clasificación',
    fechaCreacion: '01 de febrero de 2026',
    descripcion:
      'Ingesta de documentos, clasificación determinista e historial propio.',
    estado: 'activo',
    usuariosAsignados: 4,
    avatares: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
    ],
  },
];

// 2. Categorías y acciones adaptadas al Sistema Nacional de Aranceles
export const CATEGORIAS_PERMISOS: CategoriaPermisos[] = [
  {
    id: 'dashboard',
    titulo: 'Panel Principal y Bitácora',
    icono: LayoutDashboard,
    descripcion: 'Supervisión general, indicadores de operaciones y registro de auditoría.',
    columnas: [
      { id: 'ver_dashboard', label: 'Ver Panel Principal', descripcion: 'Acceso a la vista panorámica de bienvenida y accesos rápidos' },
      { id: 'ver_resumen', label: 'Ver Resumen Operativo', descripcion: 'Resumen consolidado de expedientes y dictámenes del día' },
      { id: 'ver_bitacora', label: 'Ver Bitácora de Eventos', descripcion: 'Consulta del registro de eventos e intervenciones del sistema' },
      { id: 'exportar_csv', label: 'Exportar Datos (.CSV)', descripcion: 'Descarga en hoja de cálculo de los registros de eventos' },
    ],
  },
  {
    id: 'clasificacion',
    titulo: 'Clasificación Arancelaria y Expedientes',
    icono: FileText,
    descripcion: 'Proceso de ingesta, visor técnico de documentos y emisión de resoluciones.',
    columnas: [
      { id: 'ingesta_pdf', label: 'Ingesta de Documentos (PDF)', descripcion: 'Carga de fichas técnicas y pedimentos aduanales en PDF' },
      { id: 'validar_atributos', label: 'Validar Atributos (OCR)', descripcion: 'Revisión y confirmación de composición química y norma' },
      { id: 'pregunta_decisiva', label: 'Resolver Preguntas Deterministas', descripcion: 'Respuesta a preguntas deterministas de desambiguación' },
      { id: 'emitir_dictamen', label: 'Emitir Dictamen Final', descripcion: 'Generación formal de la fracción arancelaria con sello digital' },
      { id: 'auditoria_pedimento', label: 'Auditoría de Pedimento', descripcion: 'Cotejo automatizado de pedimento contra dictamen determinista' },
    ],
  },
  {
    id: 'supervision',
    titulo: 'Supervisión y Control de Trámites',
    icono: ShieldCheck,
    descripcion: 'Fiscalización, aprobación y visto bueno de trámites aduanales.',
    columnas: [
      { id: 'bandeja_vobo', label: 'Bandeja de Aprobación', descripcion: 'Revisión de expedientes remitidos para visto bueno previo' },
      { id: 'aprobar_expediente', label: 'Aprobar Dictamen (Vo.Bo.)', descripcion: 'Aprobación definitiva de resoluciones emitidas por personal' },
      { id: 'rechazar_expediente', label: 'Rechazar / Observar', descripcion: 'Devolución de trámites con observaciones y motivos fundados' },
      { id: 'historial_completo', label: 'Historial Inmutable', descripcion: 'Consulta del registro histórico sellado con hash SHA-256' },
    ],
  },
  {
    id: 'jerarquia',
    titulo: 'Jerarquía Institucional y Personal',
    icono: GitBranch,
    descripcion: 'Administración del árbol institucional y asignación de equipos de trabajo.',
    columnas: [
      { id: 'ver_jerarquia', label: 'Ver Jerarquía en Árbol', descripcion: 'Exploración visual del organigrama institucional interactivo' },
      { id: 'mover_empleados', label: 'Asignar / Mover Personal', descripcion: 'Arrastre e intercambio de dependencias entre encargados' },
      { id: 'promover_personal', label: 'Promover a Encargado', descripcion: 'Ascenso o reclasificación jerárquica de funcionarios' },
      { id: 'gestionar_equipo', label: 'Gestionar Equipo Asignado', descripcion: 'Administración directa de los empleados bajo su cargo' },
    ],
  },
  {
    id: 'politicas',
    titulo: 'Políticas Institucionales y Configuración',
    icono: SlidersHorizontal,
    descripcion: 'Gobernanza del motor determinista y configuración global del sistema.',
    columnas: [
      { id: 'modificar_politicas', label: 'Editar Políticas del Motor', descripcion: 'Configuración de directrices vinculantes y retención legal' },
      { id: 'ajustar_umbrales', label: 'Ajustar Umbral Semáforo', descripcion: 'Ajuste del umbral porcentual mínimo para dictamen directo' },
      { id: 'toggle_supervision', label: 'Régimen de Supervisión', descripcion: 'Activación de fiscalización previa obligatoria para el personal' },
      { id: 'administrar_roles', label: 'Gestionar Matriz de Roles', descripcion: 'Modificación y asignación de permisos para todos los perfiles' },
    ],
  },
];

// 3. Matriz institucional predeterminada
const MATRIZ_PREDETERMINADA: Record<string, Record<string, boolean>> = {
  admin: {
    // Dashboard
    ver_dashboard: true,
    ver_resumen: true,
    ver_bitacora: true,
    exportar_csv: true,
    // Clasificación
    ingesta_pdf: true,
    validar_atributos: true,
    pregunta_decisiva: true,
    emitir_dictamen: true,
    auditoria_pedimento: true,
    // Supervisión
    bandeja_vobo: true,
    aprobar_expediente: true,
    rechazar_expediente: true,
    historial_completo: true,
    // Jerarquía
    ver_jerarquia: true,
    mover_empleados: true,
    promover_personal: true,
    gestionar_equipo: true,
    // Políticas
    modificar_politicas: true,
    ajustar_umbrales: true,
    toggle_supervision: true,
    administrar_roles: true,
  },
  encargado: {
    // Dashboard
    ver_dashboard: true,
    ver_resumen: true,
    ver_bitacora: true,
    exportar_csv: true,
    // Clasificación
    ingesta_pdf: true,
    validar_atributos: true,
    pregunta_decisiva: true,
    emitir_dictamen: true,
    auditoria_pedimento: true,
    // Supervisión
    bandeja_vobo: true,
    aprobar_expediente: true,
    rechazar_expediente: true,
    historial_completo: true,
    // Jerarquía
    ver_jerarquia: false,
    mover_empleados: false,
    promover_personal: false,
    gestionar_equipo: true,
    // Políticas
    modificar_politicas: false,
    ajustar_umbrales: false,
    toggle_supervision: false,
    administrar_roles: false,
  },
  empleado: {
    // Dashboard
    ver_dashboard: true,
    ver_resumen: false,
    ver_bitacora: false,
    exportar_csv: false,
    // Clasificación
    ingesta_pdf: true,
    validar_atributos: true,
    pregunta_decisiva: true,
    emitir_dictamen: true,
    auditoria_pedimento: false,
    // Supervisión
    bandeja_vobo: false,
    aprobar_expediente: false,
    rechazar_expediente: false,
    historial_completo: true,
    // Jerarquía
    ver_jerarquia: false,
    mover_empleados: false,
    promover_personal: false,
    gestionar_equipo: false,
    // Políticas
    modificar_politicas: false,
    ajustar_umbrales: false,
    toggle_supervision: false,
    administrar_roles: false,
  },
};

export const GestionRolesView: React.FC = () => {
  const [roles, setRoles] = useState<RolInstitucional[]>(ROLES_INICIALES);
  // Se intercambia el orden: Fichas y Padrón es la pestaña inicial
  const [tabActiva, setTabActiva] = useState<'fichas' | 'matriz'>('fichas');

  // Estado reactivo de permisos [rolId][permisoId] = boolean
  const [matrizPermisos, setMatrizPermisos] = useState<Record<string, Record<string, boolean>>>(() => {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('aranceles_matriz_permisos');
      if (guardado) {
        try {
          return JSON.parse(guardado);
        } catch {
          // Fallback a predeterminados
        }
      }
    }
    return MATRIZ_PREDETERMINADA;
  });

  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroRol, setFiltroRol] = useState<string>('todos');
  const [notificacion, setNotificacion] = useState<string | null>(null);

  // Modal para ver o crear rol
  const [rolSeleccionado, setRolSeleccionado] = useState<RolInstitucional | null>(null);
  const [modalNuevoRol, setModalNuevoRol] = useState<boolean>(false);
  const [nuevoNombre, setNuevoNombre] = useState<string>('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState<string>('');
  const [nuevoEtiqueta, setNuevoEtiqueta] = useState<string>('');

  // Alternar permiso individual
  const togglePermiso = (rolId: string, permisoId: string) => {
    setMatrizPermisos((prev) => {
      const rolActual = prev[rolId] || {};
      const estadoActual = Boolean(rolActual[permisoId]);
      return {
        ...prev,
        [rolId]: {
          ...rolActual,
          [permisoId]: !estadoActual,
        },
      };
    });
  };

  // Guardar matriz de permisos
  const handleGuardarMatriz = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aranceles_matriz_permisos', JSON.stringify(matrizPermisos));
    }
    setNotificacion('Matriz institucional de roles y permisos actualizada correctamente.');
    setTimeout(() => setNotificacion(null), 3500);
  };

  // Restablecer valores predeterminados
  const handleRestablecerPredeterminados = () => {
    setMatrizPermisos(MATRIZ_PREDETERMINADA);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aranceles_matriz_permisos');
    }
    setNotificacion('Se han restablecido los permisos predeterminados de fábrica para todos los roles.');
    setTimeout(() => setNotificacion(null), 3500);
  };

  // Crear nuevo rol
  const handleCrearNuevoRol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;

    const idRol = `rol_${Date.now()}`;
    const nuevo: RolInstitucional = {
      id: idRol,
      nombre: nuevoNombre.trim(),
      etiquetaVisual: nuevoEtiqueta.trim() || 'Rol Personalizado',
      fechaCreacion: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      descripcion: nuevaDescripcion.trim() || 'Rol institucional configurado por el Administrador.',
      estado: 'activo',
      usuariosAsignados: 0,
      avatares: [],
    };

    setRoles([...roles, nuevo]);
    // Inicializar permisos heredando del rol empleado
    setMatrizPermisos((prev) => ({
      ...prev,
      [idRol]: { ...(prev.empleado || MATRIZ_PREDETERMINADA.empleado) },
    }));

    setModalNuevoRol(false);
    setNuevoNombre('');
    setNuevaDescripcion('');
    setNuevoEtiqueta('');
    setNotificacion(`Nuevo rol "${nuevo.nombre}" incorporado a la matriz de permisos.`);
    setTimeout(() => setNotificacion(null), 3500);
  };

  // Exportar permisos en CSV
  const handleExportarCsv = () => {
    let contenido = 'CATEGORIA,ACCION_PERMISO,' + roles.map((r) => r.nombre.toUpperCase()).join(',') + '\n';
    CATEGORIAS_PERMISOS.forEach((cat) => {
      cat.columnas.forEach((col) => {
        const valores = roles.map((r) => (matrizPermisos[r.id]?.[col.id] ? 'AUTORIZADO' : 'DENEGADO'));
        contenido += `"${cat.titulo}","${col.label}",${valores.join(',')}\n`;
      });
    });

    const blob = new Blob(['\uFEFF' + contenido], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Matriz_Permisos_Roles_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotificacion('Exportación de matriz de permisos (.CSV) descargada con éxito.');
    setTimeout(() => setNotificacion(null), 3000);
  };

  // Roles ordenados por jerarquía: Empleado (Member) -> Encargado (Manager) -> Admin
  const rolesOrdenados = [...roles].sort((a, b) => {
    const orden: Record<string, number> = { empleado: 1, encargado: 2, admin: 3 };
    return (orden[a.id] || 4) - (orden[b.id] || 4);
  });

  // Filtrar roles visibles según filtro seleccionado
  const rolesVisibles = rolesOrdenados.filter((rol) => {
    if (filtroRol === 'todos') return true;
    return rol.id === filtroRol;
  });

  // Filtrar categorías y acciones según término de búsqueda en matriz
  const categoriasFiltradas = CATEGORIAS_PERMISOS.map((cat) => {
    if (!busqueda.trim()) return cat;
    const query = busqueda.toLowerCase();
    const coincideTitulo = cat.titulo.toLowerCase().includes(query);
    const columnasCoincidentes = cat.columnas.filter(
      (col) => col.label.toLowerCase().includes(query) || col.descripcion.toLowerCase().includes(query)
    );
    if (coincideTitulo) return cat;
    if (columnasCoincidentes.length > 0) {
      return { ...cat, columnas: columnasCoincidentes };
    }
    return null;
  }).filter((cat): cat is CategoriaPermisos => cat !== null);

  // Filtrar roles en la pestaña de fichas
  const rolesFiltradosFichas = roles.filter((rol) => {
    if (!busqueda.trim()) return true;
    const query = busqueda.toLowerCase();
    return (
      rol.nombre.toLowerCase().includes(query) ||
      rol.descripcion.toLowerCase().includes(query) ||
      rol.etiquetaVisual.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6 select-none font-sans">
      {/* 1. CABECERA PRINCIPAL Y ACCIONES */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Padrón de Roles y Matriz de Permisos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-0.5">
            Consulte las fichas de roles institucionales y configure la matriz de permisos por acción con vista de verificación directa.
          </p>
        </div>

        {/* Botones de acción superior */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          <button
            type="button"
            onClick={handleRestablecerPredeterminados}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            title="Restablecer configuración predeterminada de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Restablecer</span>
          </button>

          <button
            type="button"
            onClick={handleExportarCsv}
            className="px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
            title="Descargar matriz en CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          <button
            type="button"
            onClick={() => setModalNuevoRol(true)}
            className="px-3.5 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Crear rol</span>
          </button>

          <button
            type="button"
            onClick={handleGuardarMatriz}
            className="px-4 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Guardar matriz</span>
          </button>
        </div>
      </div>

      {/* AVISO DE NOTIFICACIÓN TEMPORAL */}
      {notificacion && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notificacion}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotificacion(null)}
            className="text-emerald-800 dark:text-emerald-300 hover:opacity-75 font-bold px-2 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. PESTAÑAS (INTERCAMBIADAS: FICHAS PRIMERO, MATRIZ SEGUNDO) Y BUSCADOR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Pestañas intercambiadas */}
        <div className="flex items-center p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTabActiva('fichas')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              tabActiva === 'fichas'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fichas y Padrón de Roles ({roles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTabActiva('matriz')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              tabActiva === 'matriz'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Matriz de Permisos por Acción</span>
          </button>
        </div>

        {/* Barra de Búsqueda y Filtro de Rol */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder={tabActiva === 'fichas' ? 'Buscar rol o función...' : 'Buscar acción o permiso...'}
              className="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-[#dc2626] transition-colors"
            />
          </div>

          {tabActiva === 'matriz' && (
            <div className="relative">
              <select
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#dc2626] cursor-pointer"
              >
                <option value="todos">Todos los roles</option>
                {rolesOrdenados.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VISTA PRIMARIA: FICHAS Y PADRÓN DE ROLES INSTITUCIONALES               */}
      {/* ========================================================================= */}
      {tabActiva === 'fichas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rolesFiltradosFichas.map((rol) => {
            const esActivo = rol.estado === 'activo';
            const cantidadPermisosActivos = Object.values(matrizPermisos[rol.id] || {}).filter(Boolean).length;

            return (
              <div
                key={rol.id}
                className={`border rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4 shadow-xs ${
                  !esActivo
                    ? 'opacity-60 bg-slate-100/80 dark:bg-slate-900/80 border-dashed border-slate-300 dark:border-slate-700'
                    : 'bg-white dark:bg-[#111827] border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {rol.nombre}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{rol.etiquetaVisual}</p>
                    </div>

                    {!esActivo && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Inactivo
                      </span>
                    )}
                  </div>

                  {/* Definición concisa y corta del rol */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                    {rol.descripcion}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Facultades asignadas:
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {cantidadPermisosActivos} activas
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {rol.avatares.length > 0 ? (
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {rol.avatares.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt="Usuario"
                            className="inline-block w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <Users className="w-4 h-4 text-slate-400" />
                    )}

                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {rol.usuariosAsignados > 0
                        ? `${rol.usuariosAsignados} funcionarios`
                        : 'Sin personal'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRolSeleccionado(rol)}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
                    >
                      Detalles
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFiltroRol(rol.id);
                        setTabActiva('matriz');
                      }}
                      className="text-xs font-semibold text-[#dc2626] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Permisos</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VISTA SECUNDARIA: MATRIZ DE PERMISOS (ESTRUCTURA IDÉNTICA A LA IMAGEN) */}
      {/* ========================================================================= */}
      {tabActiva === 'matriz' && (
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              {/* CABECERA PRINCIPAL: ACTIONS / ACCIONES A LA IZQUIERDA, ROLES A LA DERECHA */}
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827]">
                  <th className="py-3.5 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Acciones
                  </th>
                  {rolesVisibles.map((rol) => {
                    const tagIngles =
                      rol.id === 'empleado'
                        ? 'Member'
                        : rol.id === 'encargado'
                        ? 'Manager'
                        : rol.id === 'admin'
                        ? 'Admin'
                        : 'Custom';

                    return (
                      <th
                        key={rol.id}
                        className="py-3.5 px-4 text-center w-28 sm:w-36 text-xs font-semibold text-slate-700 dark:text-slate-200"
                      >
                        <div className="flex flex-col items-center">
                          <span>{rol.nombre}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {tagIngles}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* CUERPO: SECCIONES/CATEGORÍAS CON SUS ACCIONES Y CASILLAS */}
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {categoriasFiltradas.map((categoria) => {
                  const Icono = categoria.icono || LayoutDashboard;

                  return (
                    <React.Fragment key={categoria.id}>
                      {/* FILA DE CATEGORÍA CON ICONO Y TÍTULO (IDÉNTICO A LA IMAGEN) */}
                      <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-t border-b border-slate-200/70 dark:border-slate-800">
                        <td
                          colSpan={1 + rolesVisibles.length}
                          className="py-2.5 px-6"
                        >
                          <div className="flex items-center gap-2">
                            <Icono className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {categoria.titulo}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* FILAS DE ACCIONES ESPECÍFICAS DENTRO DE LA CATEGORÍA */}
                      {categoria.columnas.map((col) => (
                        <tr
                          key={col.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/50 transition-colors"
                        >
                          {/* Columna Izquierda: Nombre de la acción */}
                          <td className="py-3 px-6">
                            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
                              {col.label}
                            </span>
                            {col.descripcion && (
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                                {col.descripcion}
                              </span>
                            )}
                          </td>

                          {/* Columnas Derechas: Casillas de verificación (Checklist) para cada Rol */}
                          {rolesVisibles.map((rol) => {
                            const estaActivo = Boolean(matrizPermisos[rol.id]?.[col.id]);

                            return (
                              <td key={rol.id} className="py-3 px-4 text-center">
                                <div className="flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => togglePermiso(rol.id, col.id)}
                                    aria-label={`Permiso ${col.label} para ${rol.nombre}: ${
                                      estaActivo ? 'habilitado' : 'deshabilitado'
                                    }`}
                                    title={`${col.label} — ${rol.nombre}: ${
                                      estaActivo ? 'Autorizado (clic para revocar)' : 'No autorizado (clic para habilitar)'
                                    }`}
                                    className={`w-5 h-5 rounded-[5px] flex items-center justify-center transition-all cursor-pointer ${
                                      estaActivo
                                        ? 'bg-[#2563eb] text-white border border-[#2563eb] shadow-2xs hover:bg-[#1d4ed8]'
                                        : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500'
                                    }`}
                                  >
                                    {estaActivo && (
                                      <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {categoriasFiltradas.length === 0 && (
            <div className="text-center py-12 p-8">
              <ShieldCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No se encontraron acciones o permisos coincidentes
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Pruebe ajustando el término de búsqueda ingresado.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: DETALLES DEL ROL SELECCIONADO                                   */}
      {/* ========================================================================= */}
      {rolSeleccionado && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-[#dc2626]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {rolSeleccionado.nombre}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {rolSeleccionado.etiquetaVisual} • Creado el {rolSeleccionado.fechaCreacion}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRolSeleccionado(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-1">
                  Descripción institucional:
                </span>
                <p className="leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {rolSeleccionado.descripcion}
                </p>
              </div>

              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200 block mb-2">
                  Facultades activas en la matriz:
                </span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {CATEGORIAS_PERMISOS.flatMap((cat) => cat.columnas)
                    .filter((col) => matrizPermisos[rolSeleccionado.id]?.[col.id])
                    .map((col) => (
                      <div
                        key={col.id}
                        className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{col.label}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
                <span>Personal asignado: <strong>{rolSeleccionado.usuariosAsignados} funcionarios</strong></span>
                {rolSeleccionado.estado !== 'activo' && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Inactivo
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRolSeleccionado(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoles(
                    roles.map((r) =>
                      r.id === rolSeleccionado.id
                        ? { ...r, estado: r.estado === 'activo' ? 'desactivado' : 'activo' }
                        : r
                    )
                  );
                  setRolSeleccionado(null);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl text-white ${
                  rolSeleccionado.estado === 'activo'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {rolSeleccionado.estado === 'activo' ? 'Desactivar rol' : 'Activar rol'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: CREAR NUEVO ROL                                                 */}
      {/* ========================================================================= */}
      {modalNuevoRol && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-lg w-full p-6 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#dc2626] flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Definir Nuevo Rol Institucional
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Se incorporará una nueva fila a la matriz de permisos por acción
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalNuevoRol(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearNuevoRol} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre del Rol Oficial:
                </label>
                <input
                  type="text"
                  required
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Auditor de Pedimentos"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Etiqueta o Cargo Institucional:
                </label>
                <input
                  type="text"
                  value={nuevoEtiqueta}
                  onChange={(e) => setNuevoEtiqueta(e.target.value)}
                  placeholder="Ej. Fiscalizador Nivel 2"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alcance y Funciones:
                </label>
                <textarea
                  rows={3}
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  placeholder="Describa el alcance de las facultades de este rol en el control arancelario..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalNuevoRol(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl cursor-pointer transition-colors"
                >
                  Crear e incorporar a la matriz
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionRolesView;
