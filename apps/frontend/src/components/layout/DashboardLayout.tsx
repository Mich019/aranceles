import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Network,
  Sun,
  Moon,
  RefreshCw,
} from 'lucide-react';
import { PerfilAutenticado } from '../auth/LoginView';

export type SeccionMenu =
  | 'dashboard'
  | 'clasificar'
  | 'historial'
  | 'supervision'
  | 'empleados'
  | 'jerarquia'
  | 'roles'
  | 'configuracion';

export interface DashboardLayoutProps {
  seccionActiva: SeccionMenu;
  setSeccionActiva: (seccion: SeccionMenu) => void;
  usuario: PerfilAutenticado | null;
  onCerrarSesion: () => void;
  onCambiarRol?: () => void;
  pendientesSupervisionCount?: number;
  modoOscuro?: boolean;
  onToggleModoOscuro?: (val: boolean) => void;
  children: React.ReactNode;
}

const FOTO_POR_DEFECTO: Record<string, string> = {
  admin: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=480&fit=crop&crop=face',
  encargado: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=480&fit=crop&crop=face',
  operativo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=480&fit=crop&crop=face',
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  seccionActiva,
  setSeccionActiva,
  usuario,
  onCerrarSesion,
  onCambiarRol,
  pendientesSupervisionCount = 0,
  modoOscuro = false,
  onToggleModoOscuro,
  children,
}) => {
  const [sidebarAbiertoMovil, setSidebarAbiertoMovil] = useState<boolean>(false);
  const esAdmin =
    usuario?.rol === 'admin' ||
    usuario?.rol === 'administrador' ||
    Boolean(usuario?.correo && usuario.correo.toLowerCase().includes('admin'));

  const esEncargado =
    usuario?.rol === 'encargado' ||
    Boolean(usuario?.correo && usuario.correo.toLowerCase().includes('encargado'));

  const fotoAvatar =
    usuario?.fotoUrl ||
    (usuario?.rol && FOTO_POR_DEFECTO[usuario.rol]) ||
    FOTO_POR_DEFECTO.admin;

  const TITULOS_SECCION: Record<SeccionMenu, { titulo: string; subtitulo: string }> = {
    dashboard: {
      titulo: 'Panel Principal',
      subtitulo: 'Visión general y estado de la plataforma arancelaria',
    },
    clasificar: {
      titulo: 'Clasificación Arancelaria',
      subtitulo: 'Análisis determinista de fichas técnicas y pedimentos aduanales',
    },
    historial: {
      titulo: 'Historial de Expedientes',
      subtitulo: 'Registro inmutable de dictámenes y sellos criptográficos SHA-256',
    },
    supervision: {
      titulo: 'Bandeja de Aprobación Previa',
      subtitulo: 'Visto bueno de expedientes enviados por el personal operativo',
    },
    empleados: {
      titulo: esEncargado && !esAdmin ? 'Gestión de Mi Equipo Asignado' : 'Gestión de Empleados',
      subtitulo: esEncargado && !esAdmin
        ? 'Supervisión y control del personal operativo asignado bajo su cargo'
        : 'Padrón institucional de funcionarios, aduanas y acreditaciones',
    },
    jerarquia: {
      titulo: 'Jerarquía Institucional y Asignación de Equipos',
      subtitulo: 'Árbol jerárquico para mover y asignar empleados a encargados o promoverlos',
    },
    roles: {
      titulo: 'Gestión de Roles',
      subtitulo: 'Definición de perfiles institucionales: Administrador, Encargado y Empleado',
    },
    configuracion: {
      titulo: 'Políticas y Configuración',
      subtitulo: 'Parámetros del motor determinista y reglas institucionales',
    },
  };

  const infoActual = TITULOS_SECCION[seccionActiva] || {
    titulo: 'Sistema Nacional de Aranceles',
    subtitulo: 'Plataforma Institucional de Control Arancelario',
  };

  const navItemClass = (id: SeccionMenu) => {
    const activo = seccionActiva === id;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
      activo
        ? 'bg-[#1b4332] text-white shadow-xs'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
    }`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex font-sans antialiased selection:bg-[#dc2626]/10 selection:text-[#dc2626]">
      {/* ========================================================================= */}
      {/* 1. BARRA LATERAL (SIDEBAR) - Exacta a la estética de la imagen            */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#edf2ee] dark:bg-[#0f172a] border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          sidebarAbiertoMovil ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          {/* Logo y Nombre Institucional */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Logo Institucional"
                className="w-8 h-8 object-contain drop-shadow-xs"
              />
              <div>
                <span className="text-xs font-black tracking-tight block text-slate-900 dark:text-slate-100 leading-tight">
                  SNA • ARANCELES
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                  Plataforma Institucional
                </span>
              </div>
            </div>

            {/* Botón cerrar en móvil */}
            <button
              type="button"
              onClick={() => setSidebarAbiertoMovil(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menú de Navegación Principal */}
          <nav className="space-y-5">
            {/* GRUPO 1: PRINCIPAL / OPERACIÓN */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                Principal
              </span>

              <button
                type="button"
                onClick={() => {
                  setSeccionActiva('dashboard');
                  setSidebarAbiertoMovil(false);
                }}
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Panel Principal</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSeccionActiva('clasificar');
                  setSidebarAbiertoMovil(false);
                }}
                className={navItemClass('clasificar')}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Clasificar Mercancía</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSeccionActiva('historial');
                  setSidebarAbiertoMovil(false);
                }}
                className={navItemClass('historial')}
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4" />
                  <span>Historial</span>
                </div>
              </button>
            </div>

            {/* GRUPO 2: GESTIÓN Y SUPERVISIÓN (SOLO ADMINISTRADOR) */}
            {esAdmin && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                  Gestión Administrativa
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSeccionActiva('jerarquia');
                    setSidebarAbiertoMovil(false);
                  }}
                  className={navItemClass('jerarquia')}
                >
                  <div className="flex items-center gap-2.5">
                    <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Jerarquía en Árbol</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSeccionActiva('roles');
                    setSidebarAbiertoMovil(false);
                  }}
                  className={navItemClass('roles')}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Gestión de Roles</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSeccionActiva('supervision');
                    setSidebarAbiertoMovil(false);
                  }}
                  className={navItemClass('supervision')}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aprobar Expedientes</span>
                  </div>
                  {pendientesSupervisionCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#dc2626] text-white">
                      {pendientesSupervisionCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSeccionActiva('empleados');
                    setSidebarAbiertoMovil(false);
                  }}
                  className={navItemClass('empleados')}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Gestión de Empleados</span>
                  </div>
                </button>
              </div>
            )}

            {/* GRUPO 2.5: EQUIPO ASIGNADO (SOLO ENCARGADO) */}
            {esEncargado && !esAdmin && (
              <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
                  Supervisión de Equipo
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSeccionActiva('empleados');
                    setSidebarAbiertoMovil(false);
                  }}
                  className={navItemClass('empleados')}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Gestión de Mi Equipo</span>
                  </div>
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* PIE DEL SIDEBAR: SECCIÓN GENERAL Y TARJETA DE USUARIO FUSIONADA CON EL ENTORNO (EXACTA A LA IMAGEN) */}
        <div className="p-3.5 space-y-1.5 border-t border-slate-200/50 dark:border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block">
            General
          </span>

          <button
            type="button"
            onClick={() => {
              alert('Notificaciones del Sistema: 2 expedientes en revisión de visto bueno y 1 dictamen emitido hoy.');
            }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Notifications</span>
            </div>
            {pendientesSupervisionCount > 0 && esAdmin && (
              <span className="w-2 h-2 rounded-full bg-[#dc2626]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSeccionActiva('configuracion');
              setSidebarAbiertoMovil(false);
            }}
            className={navItemClass('configuracion')}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </button>

          {/* Tarjeta de usuario fusionada al 100% con el entorno (Sin bordes duros, fondo sutil integrado) */}
          <div
            onClick={onCambiarRol}
            className="mt-2 p-2.5 rounded-2xl bg-black/[0.05] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.09] flex items-center justify-between gap-3 transition-colors cursor-pointer"
            title="Haga clic para alternar rol o perfil institucional"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-2xs">
                <img
                  src={fotoAvatar}
                  alt={usuario?.nombre || 'Regina Phalange'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
                  {usuario?.nombre || 'Regina Phalange'}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {esAdmin
                    ? 'Administrator'
                    : esEncargado
                    ? 'Supervisor'
                    : 'Employee'}
                </div>
              </div>
            </div>

            {onCambiarRol && (
              <div
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors shrink-0"
                title="Alternar rol institucional (Admin / Encargado / Empleado)"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Backdrop para móvil */}
      {sidebarAbiertoMovil && (
        <div
          onClick={() => setSidebarAbiertoMovil(false)}
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-2xs lg:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* 2. CONTENIDO PRINCIPAL Y BARRA SUPERIOR (TOP BAR)                         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-white dark:bg-[#0f172a] border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarAbiertoMovil(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {infoActual.titulo}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                {infoActual.subtitulo}
              </p>
            </div>
          </div>

          {/* Acciones del Top Bar (Tema Claro/Oscuro, Campana y Cerrar Sesión) */}
          <div className="flex items-center gap-2.5">
            {/* Botón rápido de alternar tema Claro / Oscuro */}
            {onToggleModoOscuro && (
              <button
                type="button"
                onClick={() => onToggleModoOscuro(!modoOscuro)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-amber-400 transition-colors cursor-pointer"
                title={modoOscuro ? 'Cambiar a Fondo Claro' : 'Cambiar a Fondo Oscuro'}
              >
                {modoOscuro ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Notificaciones */}
            <div className="relative">
              <button
                type="button"
                onClick={() => alert('Notificaciones: 2 revisiones pendientes de visto bueno.')}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title="Notificaciones de sistema"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
              {pendientesSupervisionCount > 0 && esAdmin && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#dc2626]" />
              )}
            </div>

            {/* Botón Salir / Sign Out */}
            <button
              type="button"
              onClick={onCerrarSesion}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#dc2626] hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Cerrar sesión activa"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>

        {/* LIENZO DE CONTENIDO */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* PIE DE PÁGINA INSTITUCIONAL OFICIAL */}
        <footer className="py-4 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0f172a] transition-colors">
          <p>© 2026 FASITLAC • Todos los derechos reservados</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
