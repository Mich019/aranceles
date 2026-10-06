import React, { useState } from 'react';
import GestionEmpleadosView from './GestionEmpleadosView';
import ConfiguracionSistemaView from './ConfiguracionSistemaView';
import BandejaSupervisorView, { ExpedientePendiente } from './BandejaSupervisorView';

export interface AdminHubViewProps {
  onEntrarOperacion: () => void;
  onEntrarOperacionConExpediente?: (expediente: ExpedientePendiente) => void;
  onCerrarSesion: () => void;
  usuario?: {
    nombre?: string;
    cargo?: string;
    correo?: string;
    sede?: string;
  } | null;
  expedientes?: ExpedientePendiente[];
  onActualizarExpedientes?: (expedientes: ExpedientePendiente[]) => void;
  supervisionObligatoria?: boolean;
  onToggleSupervision?: (activa: boolean) => void;
}

type SubArea = 'principal' | 'personal' | 'configuraciones' | 'supervision';

const EXPEDIENTES_INICIALES_DEFAULT: ExpedientePendiente[] = [
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

export const AdminHubView: React.FC<AdminHubViewProps> = ({
  onEntrarOperacion,
  onEntrarOperacionConExpediente,
  onCerrarSesion,
  usuario,
  expedientes = EXPEDIENTES_INICIALES_DEFAULT,
  onActualizarExpedientes,
  supervisionObligatoria: propSupervision = true,
  onToggleSupervision,
}) => {
  const [subArea, setSubArea] = useState<SubArea>('principal');
  
  // Estado para la política de supervisión previa obligatoria
  const [supervisionObligatoria, setSupervisionObligatoria] = useState<boolean>(propSupervision);
  const [notificacionGuardada, setNotificacionGuardada] = useState<string | null>(null);

  // Lista local de expedientes si no se maneja arriba
  const [listaExpedientes, setListaExpedientes] = useState<ExpedientePendiente[]>(expedientes);

  // Sincronizar si entran nuevos expedientes por props
  React.useEffect(() => {
    if (expedientes && expedientes.length > 0) {
      setListaExpedientes(expedientes);
    }
  }, [expedientes]);

  const pendientesCount = listaExpedientes.filter((e) => e.estado === 'pendiente').length;

  const mostrarMensaje = (msg: string) => {
    setNotificacionGuardada(msg);
    setTimeout(() => setNotificacionGuardada(null), 3000);
  };

  const handleAprobarExpediente = (expAprobado: ExpedientePendiente) => {
    const actualizados = listaExpedientes.map((item) =>
      item.id === expAprobado.id ? expAprobado : item
    );
    setListaExpedientes(actualizados);
    if (onActualizarExpedientes) {
      onActualizarExpedientes(actualizados);
    }

    mostrarMensaje(`Visto bueno otorgado a ${expAprobado.nombreArchivo}. Transfiriendo al motor de clasificación determinista...`);

    setTimeout(() => {
      if (onEntrarOperacionConExpediente) {
        onEntrarOperacionConExpediente(expAprobado);
      } else {
        onEntrarOperacion();
      }
    }, 500);
  };

  const handleRechazarExpediente = (id: string, motivo: string) => {
    const actualizados = listaExpedientes.map((item) =>
      item.id === id ? { ...item, estado: 'rechazado' as const, motivoRechazo: motivo } : item
    );
    setListaExpedientes(actualizados);
    if (onActualizarExpedientes) {
      onActualizarExpedientes(actualizados);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-black font-sans flex flex-col justify-between select-none">
      
      {/* 1. ENCABEZADO DE LA CONSOLA CON GAFETE INSTITUCIONAL */}
      <header className="bg-white border-b border-black/[0.12] px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Lado izquierdo: Identidad Institucional y Acción Rápida */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              {/* Logo institucional */}
              <img
                src="/logo.png"
                alt="Logo Institucional"
                className="w-8 h-8 object-contain shrink-0 drop-shadow-xs"
              />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block text-black">
                  Sistema Nacional de Aranceles
                </span>
                <span className="text-[10px] text-black/[0.6] block">
                  Plataforma Institucional de Control Arancelario
                </span>
              </div>
            </div>

            {/* Divisor */}
            <div className="hidden sm:block h-6 w-px bg-black/[0.12]" />

            {/* Botón de retorno visible para cerrar sesión o cambiar de módulo */}
            <button
              type="button"
              onClick={onCerrarSesion}
              className="text-xs text-black/[0.7] hover:text-black font-medium border border-black/[0.12] hover:border-black/[0.3] hover:bg-black/[0.02] px-3 py-1.5 rounded-[10px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar sesión / Salir</span>
            </button>
          </div>

          {/* Lado derecho: Gafete Institucional del Administrador */}
          <div className="flex items-center justify-end">
            <div className="bg-white border border-black/[0.12] rounded-[10px] px-3.5 py-1.5 flex items-center gap-2.5 shadow-none">
              {/* Cordón o perforación superior del gafete */}
              <div className="w-2 h-2 rounded-full bg-black/[0.15] border border-black/[0.2] shrink-0" />
              
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-xs font-bold text-black leading-tight">
                    {usuario?.nombre || 'Lic. Sofía Valenzuela'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" title="En línea" />
                </div>
                <span className="text-[10px] text-black/[0.6] block leading-tight font-medium">
                  Administrador Central • Aduana Quito • En línea
                </span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* NOTIFICACIÓN FLOTANTE TEMPORAL */}
      {notificacionGuardada && (
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-8 pt-4">
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-[10px] text-xs font-medium flex items-center justify-between">
            <span>✓ {notificacionGuardada}</span>
            <button
              type="button"
              onClick={() => setNotificacionGuardada(null)}
              className="text-emerald-800 hover:text-emerald-950 font-bold px-2 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. CUERPO PRINCIPAL */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* =================================================================== */}
        {/* VISTA A: CONSOLA DE ADMINISTRACIÓN (VISTA PRINCIPAL DE 3 OPCIONES)  */}
        {/* =================================================================== */}
        {subArea === 'principal' && (
          <div className="space-y-8">
            
            {/* Títulos formales institucionales */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                  Consola de Administración y Control Operativo
                </h1>
                <p className="text-xs sm:text-sm text-black/[0.6]">
                  Seleccione el área de trabajo institucional
                </p>
              </div>

              {/* Botón directo a la bandeja de supervisión si hay expedientes en espera */}
              <button
                type="button"
                onClick={() => setSubArea('supervision')}
                className="self-start sm:self-auto px-4 py-2 text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-950 rounded-[10px] hover:bg-amber-100 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                <span>Bandeja de Supervisión: <strong>{pendientesCount} en espera</strong></span>
              </button>
            </div>

            {/* BANNER DESTACADO DE LA BANDEJA DE SUPERVISIÓN PREVIA */}
            <div className="bg-amber-50/70 border border-amber-300 rounded-[18px] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-none">
              <div className="flex items-start gap-4">
                <div className="w-12 h-14 rounded-[8px] bg-amber-100 border border-amber-300 flex flex-col items-center justify-between p-1.5 shrink-0">
                  <span className="text-[8px] font-mono font-bold text-amber-900 uppercase">Vo.Bo.</span>
                  <svg className="w-5 h-5 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[7px] font-mono text-amber-800">PREVIO</span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-amber-950">
                      Bandeja de Autorización Previa (Supervisión Obligatoria)
                    </h2>
                    <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 border border-amber-300 px-2 py-0.5 rounded-[6px]">
                      {pendientesCount} expedientes pendientes
                    </span>
                  </div>
                  <p className="text-xs text-amber-900/90 leading-relaxed">
                    Los expedientes cargados por personal operativo se resguardan en almacenamiento local seguro hasta recibir el visto bueno oficial del supervisor acreditado antes de pasar al motor determinista.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setSubArea('supervision')}
                  className="w-full md:w-auto px-4 py-2.5 text-xs font-semibold bg-[#dc2626] text-white rounded-[10px] hover:bg-[#b91c1c] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Revisar bandeja de supervisión</span>
                </button>
              </div>
            </div>

            {/* Grid de 3 tarjetas tangibles amplias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Tarjeta 1: Operación Arancelaria Directa */}
              <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-7 flex flex-col justify-between transition-colors hover:bg-black/[0.02] space-y-6">
                <div className="space-y-4">
                  {/* Ilustración sobria del objeto real: Expediente/Hoja técnica */}
                  <div className="w-12 h-12 rounded-[10px] border border-black/[0.12] bg-black/[0.02] flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-black">
                      Operación Arancelaria Directa
                    </h2>
                    <p className="text-xs text-black/[0.7] leading-relaxed">
                      Cargar expedientes, analizar fichas técnicas de acero y ejecutar el motor de clasificación.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.06] space-y-2">
                  <button
                    type="button"
                    onClick={onEntrarOperacion}
                    className="w-full py-2.5 px-4 bg-[#dc2626] text-white text-xs font-semibold rounded-[10px] hover:bg-[#b91c1c] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Entrar al flujo de clasificación</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tarjeta 2: Administración de Personal y Permisos */}
              <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-7 flex flex-col justify-between transition-colors hover:bg-black/[0.02] space-y-6">
                <div className="space-y-4">
                  {/* Ilustración sobria del objeto real: Gafete/Acreditación de empleado */}
                  <div className="w-12 h-12 rounded-[10px] border border-black/[0.12] bg-black/[0.02] flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-black">
                      Administración de Personal y Permisos
                    </h2>
                    <p className="text-xs text-black/[0.7] leading-relaxed">
                      Gestionar el padrón de empleados operativos, asignar niveles de autorización y definir políticas de visto bueno.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => setSubArea('personal')}
                    className="w-full py-2.5 px-4 bg-white border border-black/[0.12] hover:border-black/[0.3] text-black text-xs font-semibold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Gestionar empleados</span>
                    <svg className="w-3.5 h-3.5 text-black/[0.6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tarjeta 3: Configuraciones y Políticas del Sistema */}
              <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 sm:p-7 flex flex-col justify-between transition-colors hover:bg-black/[0.02] space-y-6">
                <div className="space-y-4">
                  {/* Ilustración sobria del objeto real: Selector de política / Regla */}
                  <div className="w-12 h-12 rounded-[10px] border border-black/[0.12] bg-black/[0.02] flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-bold text-black">
                      Configuraciones y Políticas del Sistema
                    </h2>
                    <p className="text-xs text-black/[0.7] leading-relaxed">
                      Ajustar parámetros del motor arancelario y activar el protocolo de supervisión previa obligatoria.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/[0.06]">
                  <button
                    type="button"
                    onClick={() => setSubArea('configuraciones')}
                    className="w-full py-2.5 px-4 bg-white border border-black/[0.12] hover:border-black/[0.3] text-black text-xs font-semibold rounded-[10px] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Ver configuraciones</span>
                    <svg className="w-3.5 h-3.5 text-black/[0.6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>

            {/* Resumen de estado operativo tangible */}
            <div className="bg-white border border-black/[0.12] rounded-[18px] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.08]">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Estado Operativo de la Aduana
                </span>
                <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-300 font-semibold px-2.5 py-0.5 rounded-[10px]">
                  Servicio Activo • Reglas LIGIE 2026
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-black/[0.6] block">Base Jurídica Vigente:</span>
                  <strong className="text-black font-medium mt-0.5 block">LIGIE 2026 (DOF Octubre 2026)</strong>
                </div>
                <div>
                  <span className="text-black/[0.6] block">Supervisión Previa Obligatoria:</span>
                  <strong className="text-black font-medium mt-0.5 block">
                    {supervisionObligatoria ? 'Habilitada (Activa)' : 'Deshabilitada'}
                  </strong>
                </div>
                <div>
                  <span className="text-black/[0.6] block">Expedientes en Espera de Vo.Bo.:</span>
                  <strong className="text-amber-900 font-semibold mt-0.5 block">
                    {pendientesCount} expedientes por autorizar
                  </strong>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* VISTA B: ADMINISTRACIÓN DE PERSONAL Y PERMISOS                      */}
        {/* =================================================================== */}
        {subArea === 'personal' && (
          <GestionEmpleadosView
            onVolver={() => setSubArea('principal')}
            onEmpleadoActualizado={(emp) => {
              mostrarMensaje(`Credencial de ${emp.nombre} actualizada correctamente.`);
            }}
          />
        )}

        {/* =================================================================== */}
        {/* VISTA C: CONFIGURACIONES Y POLÍTICAS DEL SISTEMA                    */}
        {/* =================================================================== */}
        {subArea === 'configuraciones' && (
          <ConfiguracionSistemaView
            onVolver={() => setSubArea('principal')}
            politicasIniciales={{
              supervisionObligatoria,
              umbralSemaforoVerde: 0.99,
              limitePreguntasDecisivas: 3,
              retencionExpedientesAnos: 5,
            }}
            onGuardarPoliticas={(politicas) => {
              setSupervisionObligatoria(politicas.supervisionObligatoria);
              if (onToggleSupervision) {
                onToggleSupervision(politicas.supervisionObligatoria);
              }
              mostrarMensaje('Políticas institucionales guardadas con éxito.');
            }}
          />
        )}

        {/* =================================================================== */}
        {/* VISTA D: BANDEJA DE AUTORIZACIÓN PREVIA DEL SUPERVISOR              */}
        {/* =================================================================== */}
        {subArea === 'supervision' && (
          <BandejaSupervisorView
            expedientesIniciales={listaExpedientes}
            supervisorActual={usuario?.nombre ? `${usuario.nombre} (Supervisor)` : 'Lic. Sofía Valenzuela (Supervisor Titular)'}
            onVolver={() => setSubArea('principal')}
            onAprobarExpediente={handleAprobarExpediente}
            onRechazarExpediente={handleRechazarExpediente}
          />
        )}

      </main>

      {/* 3. PIE DE PÁGINA OFICIAL */}
      <footer className="border-t border-black/[0.12] bg-white py-4 px-4 sm:px-8 text-center text-xs text-black/[0.6]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sistema Nacional de Aranceles • Plataforma Institucional de Control Arancelario</span>
          <span className="font-medium text-black/[0.8]">© 2026 FASITLAC • Todos los derechos reservados</span>
        </div>
      </footer>

    </div>
  );
};

export default AdminHubView;
